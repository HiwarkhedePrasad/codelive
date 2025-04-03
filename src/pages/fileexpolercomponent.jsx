import { useState } from "react";

const FileExplorer = ({ files, activeFile, onFileSelect, onCreateFile }) => {
  const [newFileName, setNewFileName] = useState("");
  const [isCreatingFile, setIsCreatingFile] = useState(false);

  const handleCreateFile = (e) => {
    e.preventDefault();
    if (newFileName.trim()) {
      onCreateFile(newFileName.trim());
      setNewFileName("");
      setIsCreatingFile(false);
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();

    // Map file extensions to icons
    switch (extension) {
      case "js":
        return "📄 "; // JavaScript
      case "jsx":
        return "📄 "; // React JSX
      case "css":
        return "📄 "; // CSS
      case "html":
        return "📄 "; // HTML
      case "json":
        return "📄 "; // JSON
      case "md":
        return "📄 "; // Markdown
      default:
        return "📄 "; // Default file icon
    }
  };

  return (
    <div className="mt-2">
      {/* File list */}
      <ul className="space-y-1">
        {files.map((file) => (
          <li
            key={file.id}
            className={`px-2 py-1 cursor-pointer rounded flex items-center ${
              activeFile === file.id
                ? "bg-[#37373d] text-white"
                : "hover:bg-[#2a2a2a]"
            }`}
            onClick={() => onFileSelect(file.id)}
          >
            <span className="mr-1">{getFileIcon(file.name)}</span>
            {file.name}
          </li>
        ))}
      </ul>

      {/* Create new file */}
      {isCreatingFile ? (
        <form onSubmit={handleCreateFile} className="mt-2 px-2">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="filename.js"
            className="w-full bg-[#3c3c3c] px-2 py-1 text-sm rounded border border-[#525252] focus:outline-none focus:border-blue-500"
            autoFocus
          />
          <div className="flex gap-2 mt-1">
            <button
              type="submit"
              className="text-xs px-2 py-1 bg-[#0e639c] hover:bg-[#1177bb] rounded"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingFile(false)}
              className="text-xs px-2 py-1 bg-[#3a3a3a] hover:bg-[#464646] rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsCreatingFile(true)}
          className="mt-2 text-sm flex items-center px-2 py-1 text-gray-400 hover:text-white"
        >
          <span className="mr-1">+</span> New File
        </button>
      )}
    </div>
  );
};

export default FileExplorer;
