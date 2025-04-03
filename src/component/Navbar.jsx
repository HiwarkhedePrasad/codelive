import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect, useContext } from "react";
import UserContext from "../context/userContext";

const Navbar = () => {
  const { user, isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleLinkClick = () => {
    setIsMenuOpen(false); // Close menu on link click
  };

  useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard");
      updateUser(user);
      user.update();
    }
  }, [isSignedIn, user]);
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="text-2xl font-bold">
          <Link to="/">Codelive</Link>
        </div>

        {/* Navigation Links (Visible on Desktop) */}
        <div className="hidden lg:flex flex-row space-x-4 items-center">
          <Link
            to="/"
            onClick={handleLinkClick}
            className="hover:text-blue-400"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={handleLinkClick}
            className="hover:text-blue-400"
          >
            About
          </Link>
          <Link
            to="/features"
            onClick={handleLinkClick}
            className="hover:text-blue-400"
          >
            Features
          </Link>

          {/* Authentication Section */}
          {!isSignedIn ? (
            <SignInButton>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                Sign In
              </button>
            </SignInButton>
          ) : (
            <div>
              <UserButton />
            </div>
          )}
        </div>

        {/* Hamburger Menu (Mobile Only) */}
        <button
          className="lg:hidden block text-2xl focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute bg-gray-900 w-full left-0 top-[60px] transition-all duration-300 ease-in-out z-50 ${
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "translate-y-[-200%] opacity-0"
          }`}
        >
          <Link
            to="/"
            onClick={handleLinkClick}
            className="block py-4 px-4 hover:text-blue-400"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={handleLinkClick}
            className="block py-4 px-4 hover:text-blue-400"
          >
            About
          </Link>
          <Link
            to="/features"
            onClick={handleLinkClick}
            className="block py-4 px-4 hover:text-blue-400"
          >
            Features
          </Link>

          {/* Authentication Section */}
          {!isSignedIn ? (
            <SignInButton>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full mt-4">
                Sign In
              </button>
            </SignInButton>
          ) : (
            <div className="mt-4">
              <UserButton />
            </div>
          )}
        </div>

        {/* Backdrop for Mobile Menu */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
