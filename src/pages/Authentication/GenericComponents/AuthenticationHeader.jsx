import React from "react";
import { getIconComponent } from "../../../utils";
import { useNavigate } from "react-router-dom";

const AuthenticationHeader = ({ hideButtons = false }) => {
  const Logo = getIconComponent("tawasol-icon");
  const navigate = useNavigate();

  return (
    <nav
      className={`bg-transparent pt-3 pb-6 px-4 sm:px-6 ${
        hideButtons ? "absolute top-0 left-0 right-0" : ""
      }`}
    >
      <div
        className={`mx-auto w-full max-w-7xl flex ${
          hideButtons ? "justify-start" : "justify-between"
        } items-center`}
      >
        {/* Logo and Name */}
        <div className="flex items-center">
          <Logo className="h-8 sm:h-12 w-auto" />
          <h1 className="text-xl sm:text-3xl font-bold text-buttonSubmitEnable ml-1">
            Tawasol
          </h1>
        </div>

        {!hideButtons && (
          <div className="flex space-x-2 sm:space-x-3">
            <button
              onClick={() => navigate("/auth/signup")}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full
                         bg-mainBackground text-textContent
                         text-sm sm:text-base font-medium
                         hover:bg-buttonSubmitDisable
                         transition duration-200 ease-in-out"
            >
              Join now
            </button>
            <button
              onClick={() => navigate("/auth/signin")}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full
                         border border-buttonSubmitEnable
                         text-sm sm:text-base font-medium
                         text-buttonSubmitEnable
                         hover:bg-buttonSubmitDisable
                         transition duration-200 ease-in-out"
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
