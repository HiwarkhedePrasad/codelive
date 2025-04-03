import React from "react";
import { Link } from "react-router-dom";

const Features = () => {
  // Feature data
  const features = [
    {
      title: "Real-Time Collaboration",
      description:
        "Code together with teammates in real-time. See cursors, edits, and changes instantly.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
          />
        </svg>
      ),
    },
    {
      title: "Multi-Language Support",
      description:
        "Write and execute code in multiple programming languages including JavaScript, Python, and more.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
    },
    {
      title: "VS Code-Like Experience",
      description:
        "Enjoy a familiar coding environment with features like syntax highlighting, file explorer, and terminal.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Integrated Terminal",
      description:
        "Run your code directly in the browser with our integrated terminal and see output in real-time.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Secure Rooms",
      description:
        "Create private coding rooms and share them only with those you want to collaborate with.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
    {
      title: "Cursor Tracking",
      description:
        "See exactly where your teammates are working with real-time cursor position tracking.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-gray-300 flex flex-col">
      {/* Navigation Bar */}
      <div className="w-full h-14 bg-[#323233] flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-xl font-bold text-white">
            CodeLive
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-300 hover:text-white">
            Dashboard
          </Link>
          <Link
            to="/features"
            className="text-gray-300 hover:text-white font-medium"
          >
            Features
          </Link>
          <Link to="/about" className="text-gray-300 hover:text-white">
            About
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-[#252525] py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-6 text-white">
            Powerful Features for Collaborative Coding
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            CodeLive provides all the tools you need for seamless real-time code
            collaboration, powered by modern web technologies.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#252525] p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
            >
              <div className="text-blue-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#2b2b2b] py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Ready to Start Coding Together?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of developers who use CodeLive for collaboration,
            teaching, and pair programming.
          </p>
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Create a Coding Room
          </Link>
        </div>
      </div>

      {/* Testimonials - Optional Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-10 text-center text-white">
          What Developers Say About Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#252525] p-6 rounded-lg border border-gray-700">
            <p className="mb-6 italic">
              "CodeLive has transformed how our remote team collaborates on
              code. The real-time editing and execution capabilities are
              game-changers."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-600 rounded-full mr-4"></div>
              <div>
                <p className="font-medium text-white">Sarah Johnson</p>
                <p className="text-sm text-gray-400">
                  Lead Developer at TechCorp
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#252525] p-6 rounded-lg border border-gray-700">
            <p className="mb-6 italic">
              "I use CodeLive daily for teaching programming. The ability to see
              my students' code in real-time has improved my teaching
              effectiveness immensely."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-600 rounded-full mr-4"></div>
              <div>
                <p className="font-medium text-white">Mark Rodriguez</p>
                <p className="text-sm text-gray-400">
                  Computer Science Professor
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#252525] p-6 rounded-lg border border-gray-700">
            <p className="mb-6 italic">
              "The VS Code-like interface with collaborative features makes
              CodeLive stand out from other pair programming tools."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-600 rounded-full mr-4"></div>
              <div>
                <p className="font-medium text-white">Alex Chen</p>
                <p className="text-sm text-gray-400">Full Stack Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#252525] py-6 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} CodeLive. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Features;
