import React from "react";
import WelcomeForm from "./components/WelcomeForm";
import WelcomeImage from "../../assets/images/WelcomeImage.jpeg"

const WelcomePage = () => {
  return (
    <div className="min-h-screen flex items-start justify-center bg-white p-8 space-x-12 mt-24">
      {/* Left Side: Welcome Form */}
      <div className="w-full max-w-3xl bg-white p-8">
        {/* Welcome Heading */}
        <h1 className="text-6xl font-normal text-gray-600 mb-12">
          Welcome to your professional community
        </h1>
        <div className="w-full max-w-lg bg-white">
          <WelcomeForm />
        </div>
      </div>

      {/* Right Side: Image */}
      <img
        src={WelcomeImage}
        alt="Welcome to LinkedIn"
        className="w-full max-w-2xl rounded-full"
      />
    </div>
  );
};

export default WelcomePage;
