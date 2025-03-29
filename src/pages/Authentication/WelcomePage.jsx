import React from "react";
import WelcomeForm from "./Forms/WelcomeForm";
import WelcomeImage from "../../assets/images/WelcomeImage.jpeg";

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-mainBackground">
      {/* Mobile & Tablet: Single Column */}
      <div className="block lg:hidden">
        <div className="p-6 sm:p-8 flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-textHeavyTitle mb-8 sm:mb-12 text-center">
            Welcome to your professional community
          </h1>
          <img
            src={WelcomeImage}
            alt="Welcome to Tawasol"
            className="w-full max-w-md rounded-full mb-8 sm:mb-12 darken"
          />
          <div className="w-full max-w-md">
            <WelcomeForm />
          </div>
        </div>
      </div>

      {/* Desktop: Two Columns */}
      <div className="hidden lg:flex min-h-screen items-center justify-center p-12">
        {/* Left Column - Content */}
        <div className="flex-1 max-w-2xl mr-12">
          <h1 className="text-5xl xl:text-6xl font-normal text-textHeavyTitle mb-12">
            Welcome to your professional community
          </h1>
          <div className="max-w-lg">
            <WelcomeForm />
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="flex-1 max-w-2xl">
          <img
            src={WelcomeImage}
            alt="Welcome to Tawasol"
            className="w-full rounded-full shadow-xl darken"
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
