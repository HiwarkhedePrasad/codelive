import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden mt-[60px]">
        <Outlet /> {/* This will be replaced by the current route */}
      </div>
    </div>
  );
};

export default Layout;
