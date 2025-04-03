import { SignInButton } from "@clerk/clerk-react";
import Laptop from "../assets/laptop.png";

const HeroSection = () => {
  const handleLearnMore = () => {
    document.getElementById("learn-more-section").scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center py-12 px-6 md:px-12">
        {/* Text Section */}
        <header className="flex-1 text-center md:text-left space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Collaborate on Code, <span className="text-blue-500">Live</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300">
            Experience seamless real-time coding collaboration with your team.
            Build, debug, and deploy together — all in one place.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <SignInButton>
              <button className="w-full md:w-auto px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition duration-300">
                Get Started
              </button>
            </SignInButton>
            <button
              onClick={handleLearnMore}
              className="w-full md:w-auto px-6 py-3 bg-transparent border border-blue-500 text-blue-500 font-medium rounded-xl hover:bg-blue-600 hover:text-white transition duration-300"
            >
              Learn More
            </button>
          </div>
        </header>

        {/* Image Section */}
        <div className="flex-1 flex justify-center">
          <img
            src={Laptop}
            alt="Laptop for live coding"
            className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl object-contain drop-shadow-2xl"
            loading="lazy"
          />
        </div>
      </div>

      {/* Target Section for "Learn More" */}
      <div id="learn-more-section" className="py-16 px-6 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-200">
          Discover the Power of Real-Time Collaboration
        </h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Whether you're debugging, brainstorming, or building the next big
          thing, CodeLive makes it easy for teams to work together.
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
