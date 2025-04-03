import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const CreateRoom = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleRoomIdChange = (event) => {
    setRoomId(event.target.value);
  };

  const handleCreateRoom = () => {
    const generatedRoomId = uuid();
    setRoomId(generatedRoomId);
    navigate(`/editor/${roomId}`);
    toast.success(`Room Created! Room ID: ${generatedRoomId}`);
  };

  const handleJoinRoom = () => {
    if (roomId) {
      // Check if roomId is provided before navigation
      navigate(`/editor/${roomId}`);
      toast.success("Room join successfully");
    } else {
      // Handle case where no roomId is provided (optional)
      console.warn("Please enter a room ID to join."); // Or display an error message
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      {/* Card Section */}
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-2xl text-white space-y-8">
        {/* Title Section */}
        <h1 className="text-4xl font-bold text-center">CodeLive</h1>

        {/* Input and Button Section */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            id="roomId"
            value={roomId}
            onChange={handleRoomIdChange}
            placeholder="Enter Room ID " // Indicate optional nature
            className="flex-grow px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
            onClick={handleJoinRoom}
          >
            Join Room
          </button>
        </div>

        {/* Text Section */}
        <p className="text-center text-sm text-gray-300">
          Create Your Own Room{" "}
          <Link
            to="#"
            onClick={handleCreateRoom}
            className="text-blue-400 hover:text-blue-500 underline"
          >
            Create Room
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CreateRoom;
