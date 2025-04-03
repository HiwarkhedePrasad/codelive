import { useEffect, useRef, useState, Suspense, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Editor from "../component/editor";
import Client from "../component/client";
import FileExplorer from "./fileexpolercomponent";
import Terminal from "../component/terminal"; // Terminal component
import { initSocket } from "../socket";
import { ACTIONS } from "../assets/Actions";

const EditorPage = () => {
  const socketRef = useRef(null);
  const { roomId } = useParams();
  const { user, isLoaded: isUserLoaded } = useUser();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [terminalOutput, setTerminalOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [cursors, setCursors] = useState({});
  const [socketInitialized, setSocketInitialized] = useState(false);
  const handleCreateFileRef = useRef(null);

  // Get username safely even if user object isn't fully loaded
  const getUsername = useCallback(() => {
    if (!user) return "Anonymous";
    return (
      user.fullName ||
      (user.emailAddresses && user.emailAddresses[0]?.emailAddress) ||
      "Anonymous"
    );
  }, [user]);

  // Setup socket event handlers - separate from initialization
  const setupSocketListeners = useCallback(() => {
    if (!socketRef.current) return;

    // Handle joining events
    socketRef.current.on(
      ACTIONS.JOINED,
      ({ clients, username, files, cursors: existingCursors }) => {
        setClients(clients);
        if (files) setFiles(files);
        if (existingCursors) setCursors(existingCursors);

        const currentUsername = getUsername();
        if (username !== currentUsername) {
          toast.success(`${username} joined the room`);
        }
      }
    );

    // First person to join
    socketRef.current.on(ACTIONS.FIRST_JOIN, ({ clients, files }) => {
      setClients(clients);
      if (files && files.length > 0) {
        setFiles(files);
        setActiveFile(files[0].id);
      } else {
        // Create a default file for first-time room setup
        handleCreateFileRef.current("main.js", "// Start coding here");
      }
    });

    // Handle disconnection
    socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
      toast.success(`${username} left the room`);
      setClients((prev) =>
        prev.filter((client) => client.socketId !== socketId)
      );

      // Remove cursor for disconnected user
      setCursors((prev) => {
        const newCursors = { ...prev };
        delete newCursors[socketId];
        return newCursors;
      });
    });

    // Handle file changes from other users
    socketRef.current.on(
      ACTIONS.FILE_CHANGE,
      ({ fileId, content, cursorPosition, socketId }) => {
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === fileId ? { ...file, content } : file
          )
        );

        // If there's a cursor position included, update it
        if (cursorPosition && socketId) {
          setCursors((prev) => {
            // Get the username from clients state
            const username =
              clients.find((client) => client.socketId === socketId)
                ?.username || "Anonymous";

            return {
              ...prev,
              [socketId]: {
                fileId,
                position: cursorPosition,
                username,
              },
            };
          });
        }
      }
    );

    // Handle cursor position changes
    socketRef.current.on(
      ACTIONS.CURSOR_CHANGE,
      ({ socketId, fileId, position, username }) => {
        setCursors((prev) => ({
          ...prev,
          [socketId]: {
            fileId,
            position,
            username:
              username ||
              clients.find((client) => client.socketId === socketId)
                ?.username ||
              "Anonymous",
          },
        }));
      }
    );

    // Handle new file creation from other users
    socketRef.current.on(ACTIONS.FILE_CREATED, ({ file }) => {
      setFiles((prevFiles) => [...prevFiles, file]);
      toast.success(`New file created: ${file.name}`);
    });

    // Handle code execution results
    socketRef.current.on(ACTIONS.EXECUTION_RESULT, ({ result, username }) => {
      const { output, error } = result;

      if (error) {
        setTerminalOutput(
          (prev) => `${prev}\n\n[${username}] execution error:\n${error}`
        );
      } else {
        setTerminalOutput(
          (prev) => `${prev}\n\n[${username}] execution output:\n${output}`
        );
      }

      setIsRunning(false);
    });

    // Add error handler
    socketRef.current.on("connect_error", (err) => {
      console.log("Socket error:", err);
      toast.error("Failed to connect to the server.");
    });
  }, [clients, getUsername]);

  // Handle file creation - defined after setupSocketListeners
  const handleCreateFile = useCallback(
    (fileName, initialContent = "") => {
      const newFile = {
        id: `file-${Date.now()}`,
        name: fileName,
        content: initialContent,
        createdBy: getUsername(),
      };

      setFiles((prevFiles) => [...prevFiles, newFile]);
      setActiveFile(newFile.id);

      // Broadcast new file to other clients
      socketRef.current?.emit(ACTIONS.FILE_CREATED, {
        roomId,
        file: newFile,
      });

      return newFile;
    },
    [roomId, getUsername]
  );

  // Keep the ref updated with the latest function
  useEffect(() => {
    handleCreateFileRef.current = handleCreateFile;
  }, [handleCreateFile]);

  // Handle socket initialization
  const initializeSocket = useCallback(async () => {
    // Don't re-initialize if we already have a socket
    if (socketRef.current) return;

    try {
      socketRef.current = await initSocket();

      // Register connect listener first
      socketRef.current.on("connect", () => {
        console.log("Socket connected!");

        // Only emit JOIN after successful connection
        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username: getUsername(),
        });

        // Set up all event listeners after connection is established
        setupSocketListeners();
        setSocketInitialized(true);
      });
    } catch (error) {
      console.error("Socket initialization failed", error);
      toast.error("Connection failed. Please try again later.");
    }
  }, [roomId, getUsername, setupSocketListeners]);

  // Initialize socket only when user is loaded
  useEffect(() => {
    if (isUserLoaded && !socketInitialized) {
      initializeSocket();
    }

    // Cleanup function to run on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current.off(ACTIONS.FIRST_JOIN);
        socketRef.current.off(ACTIONS.FILE_CHANGE);
        socketRef.current.off(ACTIONS.FILE_CREATED);
        socketRef.current.off(ACTIONS.CURSOR_CHANGE);
        socketRef.current.off(ACTIONS.EXECUTION_RESULT);
        socketRef.current.off("connect_error");
        socketRef.current.off("connect");
        socketRef.current = null;
        setSocketInitialized(false);
      }
    };
  }, [isUserLoaded]);

  // Handle file content change
  const handleFileChange = useCallback(
    (fileId, newContent, cursorPosition) => {
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === fileId ? { ...file, content: newContent } : file
        )
      );

      // Broadcast changes to other clients
      socketRef.current?.emit(ACTIONS.FILE_CHANGE, {
        roomId,
        fileId,
        content: newContent,
        cursorPosition,
        socketId: socketRef.current.id,
      });
    },
    [roomId]
  );

  // Handle cursor position change
  const handleCursorChange = useCallback(
    (position) => {
      if (!socketRef.current || !activeFile) return;

      socketRef.current.emit(ACTIONS.CURSOR_CHANGE, {
        roomId,
        fileId: activeFile,
        position,
        socketId: socketRef.current.id,
        username: getUsername(),
      });
    },
    [roomId, activeFile, getUsername]
  );

  // Toggle file explorer visibility
  const toggleExplorer = useCallback(() => {
    setIsExplorerOpen((prev) => !prev);
  }, []);

  // Toggle terminal visibility
  const toggleTerminal = useCallback(() => {
    setIsTerminalOpen((prev) => !prev);
  }, []);

  // Run the code in the active file
  const runCode = useCallback(() => {
    if (!activeFile) {
      toast.error("No file selected to run");
      return;
    }

    const fileToRun = files.find((f) => f.id === activeFile);
    if (!fileToRun) return;

    setIsRunning(true);
    setTerminalOutput((prev) => `${prev}\n\n> Running ${fileToRun.name}...`);

    // Send code execution request to the server
    socketRef.current?.emit(ACTIONS.EXECUTE_CODE, {
      roomId,
      fileId: activeFile,
      code: fileToRun.content,
      fileName: fileToRun.name,
      username: getUsername(),
    });
  }, [activeFile, files, roomId, getUsername]);

  // Clear terminal output
  const clearTerminal = useCallback(() => {
    setTerminalOutput("");
  }, []);

  // Show loading while user data is being fetched
  if (!isUserLoaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#1e1e1e] text-gray-300">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-gray-300">
      {/* VS Code-like top bar */}
      <div className="w-full h-10 bg-[#323233] flex items-center px-4 justify-between fixed top-0 left-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleExplorer}
            className="text-gray-400 hover:text-white"
            title="Toggle Explorer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M3 3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3zm2-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H5z" />
            </svg>
          </button>
          <button
            onClick={toggleTerminal}
            className="text-gray-400 hover:text-white"
            title="Toggle Terminal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M6 9a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 6 9zM3.854 4.146a.5.5 0 1 0-.708.708L4.793 6.5 3.146 8.146a.5.5 0 1 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2z" />
              <path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h12z" />
            </svg>
          </button>
          <span>Room: {roomId}</span>
        </div>
        <div className="flex items-center gap-2">
          {activeFile && (
            <button
              onClick={runCode}
              disabled={isRunning}
              className={`px-2 py-1 text-sm ${
                isRunning
                  ? "bg-[#444444] text-gray-500 cursor-not-allowed"
                  : "bg-[#2b7d2b] hover:bg-[#39a339] text-white"
              } rounded flex items-center gap-1`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
              </svg>
              {isRunning ? "Running..." : "Run"}
            </button>
          )}
          <button
            onClick={() => navigate("/dashboard")}
            className="px-2 py-1 text-sm bg-[#2d2d2d] hover:bg-[#3e3e3e] rounded"
          >
            Exit Room
          </button>
        </div>
      </div>

      <div className="flex w-full h-[calc(100vh-40px)] mt-10">
        {/* File Explorer / Left Sidebar */}
        {isExplorerOpen && (
          <div className="bg-[#252525] w-60 flex flex-col">
            <div className="flex-1 overflow-y-auto p-2">
              <h3 className="text-sm uppercase font-bold text-gray-400 px-2 py-1">
                Explorer
              </h3>
              <FileExplorer
                files={files}
                activeFile={activeFile}
                onFileSelect={setActiveFile}
                onCreateFile={handleCreateFile}
              />
            </div>
          </div>
        )}

        {/* Main Editor and Terminal Section */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-full">
                Loading Editor...
              </div>
            }
          >
            <div
              className={`flex-1 overflow-hidden ${
                isTerminalOpen ? "h-2/3" : "h-full"
              }`}
            >
              {socketInitialized && activeFile ? (
                <Editor
                  socketRef={socketRef}
                  roomId={roomId}
                  fileId={activeFile}
                  content={
                    files.find((f) => f.id === activeFile)?.content || ""
                  }
                  onContentChange={handleFileChange}
                  onCursorChange={handleCursorChange}
                  cursors={Object.entries(cursors)
                    .filter(
                      ([socketId, cursor]) =>
                        cursor.fileId === activeFile &&
                        socketId !== socketRef.current?.id
                    )
                    .map(([socketId, cursor]) => ({
                      socketId,
                      position: cursor.position,
                      username: cursor.username,
                    }))}
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  {!socketInitialized
                    ? "Connecting..."
                    : "Select or create a file to begin editing"}
                </div>
              )}
            </div>
          </Suspense>

          {/* Terminal Component */}
          {/* Terminal Component */}
          {isTerminalOpen && (
            <div className="h-1/3 border-t border-gray-700 bg-[#1a1a1a] flex flex-col">
              <div className="flex justify-between items-center px-3 py-1 bg-[#252525] border-b border-gray-700">
                <div className="text-sm flex items-center gap-2">
                  <span>Terminal</span>
                  {/* Run button in terminal */}
                  {activeFile && (
                    <button
                      onClick={runCode}
                      disabled={isRunning}
                      className={`px-2 py-1 text-xs ${
                        isRunning
                          ? "bg-[#444444] text-gray-500 cursor-not-allowed"
                          : "bg-[#2b7d2b] hover:bg-[#39a339] text-white"
                      } rounded flex items-center gap-1 ml-4`}
                      title="Run current file"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        className="mr-1"
                      >
                        <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                      </svg>
                      {isRunning ? "Running..." : "Run"}
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={clearTerminal}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    Clear
                  </button>
                  <button
                    onClick={toggleTerminal}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                  </button>
                </div>
              </div>
              <Terminal output={terminalOutput} />
            </div>
          )}
        </div>

        {/* Connected Users / Right Sidebar */}
        <div className="bg-[#252525] w-60 border-l border-gray-700">
          <div className="p-4">
            <h3 className="text-sm uppercase font-bold text-gray-400 mb-2">
              Connected Users
            </h3>
            <div className="flex flex-col gap-2">
              {clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
