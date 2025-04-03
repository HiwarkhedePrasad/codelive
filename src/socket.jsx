import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    forceNew: true,
    reconnectionAttempts: 100, // Use a large number instead of Infinity
    timeout: 10000,
    transports: ["websocket", "polling"],
  };

  // Use the correct Vite environment variable prefix
  const backendUrl = "http://192.168.251.186:5000";

  if (!backendUrl) {
    console.error("Backend URL is not defined in the environment variables.");
    return null;
  }

  try {
    const socket = io(backendUrl, options);

    // Handle connection error
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return socket;
  } catch (error) {
    console.error("Error initializing socket:", error);
    return null;
  }
};
