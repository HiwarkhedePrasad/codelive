import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-gray-300 flex flex-col overflow-y-auto">
      {/* Navigation Bar */}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 flex-1">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-white">About CodeLive</h1>

          <div className="mb-10">
            <p className="mb-4">
              CodeLive is a real-time collaborative coding platform that enables
              developers to code together, no matter where they are in the
              world. Built with modern web technologies, CodeLive provides a
              seamless environment for pair programming, teaching, and
              collaborative problem-solving.
            </p>
            <p className="mb-4">
              Our mission is to make collaborative coding accessible and
              enjoyable, helping teams and individuals work together more
              effectively in real-time.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-white">Our Story</h2>
          <div className="mb-10">
            <p className="mb-4">
              CodeLive began as a passion project to solve a common problem in
              remote software development: the need for seamless real-time
              collaboration. Traditional code sharing methods often resulted in
              delays, confusion, and inefficiency.
            </p>
            <p className="mb-4">
              We envisioned a platform where developers could not only share
              code but also see each other's edits in real-time, communicate
              effectively, and execute code together – all in one integrated
              environment.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-white">
            Technology Stack
          </h2>
          <div className="mb-10">
            <p className="mb-4">
              CodeLive is built using modern web technologies:
            </p>
            <ul className="list-disc list-inside mb-4 pl-4 space-y-2">
              <li>React for the frontend interface</li>
              <li>Socket.IO for real-time communication</li>
              <li>Node.js for server-side operations</li>
              <li>
                Monaco Editor (VS Code's editor) for a powerful coding
                experience
              </li>
              <li>Tailwind CSS for responsive and clean UI design</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-white">Contact Us</h2>
          <div className="mb-6">
            <p className="mb-4">
              We're always looking to improve CodeLive and would love to hear
              your feedback.
            </p>
            <p className="mb-2">Email: contact@codelive.dev</p>
            <p className="mb-2">Twitter: @CodeLiveApp</p>
            <p className="mb-2">GitHub: github.com/codelive</p>
          </div>
        </div>
      </div>

      {/* Footer */}
    </div>
  );
};

export default About;
