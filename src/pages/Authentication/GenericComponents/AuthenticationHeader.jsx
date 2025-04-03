import React from "react";
import { getIconComponent } from "../../../utils";
import { useNavigate } from "react-router-dom";

const AuthenticationHeader = ({ hideButtons = false }) => {
  // Destructure props properly
  const Logo = getIconComponent("in-black");
  const navigate = useNavigate();

  return (
    <nav className={`bg-mainBackground pt-3 pb-6 px-4 sm:px-6 ${hideButtons ? "absolute top-0 left-0 right-0" : ""}`}>
      <div
        className={`mx-auto w-full max-w-7xl flex ${hideButtons ? "justify-start" : "justify-between"} items-center`}
      >
        {/* Logo on the left */}
        <div className="flex items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-textContent">
            Linked
          </h1>
          <Logo className="h-8 sm:h-10 w-auto" />
        </div>

        {!hideButtons && ( // Fixed: Removed erroneous curly brace comment
          /* Buttons on the right */
          <div className="flex space-x-2 sm:space-x-4">
            <button
              className="
              px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 
              bg-mainBackground text-textContent rounded-full 
              hover:bg-buttonSubmitDisable 
              text-base sm:text-lg md:text-xl 
              font-medium transition duration-200 ease-in-out
            "
              onClick={() => navigate("/auth/signup")}
            >
              Join now
            </button>
            <button
              className="
              px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 
              bg-mainBackground rounded-full 
              text-base sm:text-lg md:text-xl 
              font-medium 
              text-buttonSubmitEnable border border-buttonSubmitEnable 
              hover:bg-buttonSubmitDisable transition-colors
            "
              onClick={() => navigate("/auth/signin")}
            >
              Sign in
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AuthenticationHeader;
