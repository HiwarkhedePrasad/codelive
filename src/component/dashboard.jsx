import { FaVideo, FaPhone, FaComments, FaSignOutAlt } from "react-icons/fa";
import {
  AiOutlineFolderAdd,
  AiOutlineFolderOpen,
  AiOutlineTeam,
} from "react-icons/ai";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { isSignedIn } = useUser(); // Check if the user is signed in

  return (
    <div className="bg-gray-900 text-white flex min-h-screen">
      {/* Sidebar */}
      <div className="border-white w-24 md:w-20 bg-gray-900 flex flex-col items-center py-6 space-y-6">
        <FaVideo className="text-xl cursor-pointer hover:text-blue-400" />
        <FaPhone className="text-xl cursor-pointer hover:text-blue-400" />
        <FaComments className="text-xl cursor-pointer hover:text-blue-400" />

        {/* Conditionally render the SignOut button */}
        {isSignedIn && (
          <SignOutButton>
            <FaSignOutAlt className="text-xl mt-auto cursor-pointer hover:text-red-400" />
          </SignOutButton>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex justify-center items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-screen-md">
          {/* Dashboard Cards */}
          <Link to="/room">
            {" "}
            <Card
              icon={<AiOutlineFolderAdd className="text-3xl" />}
              title="Create Project"
            />
          </Link>
          <Card
            icon={<HiOutlinePencilAlt className="text-3xl" />}
            title="Tasks"
          />
          <Card
            icon={<AiOutlineFolderOpen className="text-3xl" />}
            title="Open Project"
          />
          <Link to="/room">
            <Card
              icon={<AiOutlineTeam className="text-3xl" />}
              title="Live Collaboration"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

const Card = ({ icon, title }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 cursor-pointer flex flex-col items-center justify-center space-y-4">
      <div className="text-white">{icon}</div>
      <h3 className="text-lg font-medium">{title}</h3>
    </div>
  );
};

export default Dashboard;
