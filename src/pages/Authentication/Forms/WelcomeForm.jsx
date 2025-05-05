import React from "react";
import SignWithGoogle from "../GenericComponents/SignWithGoogle";
import { Link, useNavigate } from "react-router-dom";

const WelcomeForm = () => {
  const navigate = useNavigate();

  const handleSignInWithEmail = () => {
    navigate("/auth/signin");
  };

  const handleGetTheApp = () => {
    window.location.href = "https://tawasolapp.me/cross";
  };

  return (
    <div className="space-y-3 sm:space-y-5">
      {/* Sign in with Google */}
      <SignWithGoogle />

      {/* Sign in with Email */}
      <button
        type="button"
        onClick={handleSignInWithEmail}
        className="w-full flex items-center justify-center 
                   bg-cardBackground text-textContent 
                   py-2.5 sm:py-3.5 px-4 border-2 border-itemBorder 
                   rounded-full hover:bg-cardBackgroundHover 
                   focus:outline-none focus:border-itemBorderFocus 
                   text-base sm:text-lg font-medium 
                   transition duration-200 ease-in-out"
      >
        Sign in with Email
      </button>

      <p className="mt-3 sm:mt-5 text-center text-textContent text-sm sm:text-base">
        New to Tawasol?{" "}
        <Link
          to="/auth/signup"
          className="text-buttonSubmitEnable font-medium hover:underline"
        >
          Join now
        </Link>
      </p>
      
      {/* Get the app button */}
      <div className="pt-4 sm:pt-6 border-t border-itemBorder mt-4 sm:mt-6">
        <button
          type="button"
          onClick={handleGetTheApp}
          className="w-full sm:w-auto mx-auto flex items-center justify-center 
                     bg-transparent hover:bg-cardBackgroundHover
                     text-textActivity font-medium
                     py-2 sm:py-2.5 px-6 sm:px-8
                     border border-itemBorder rounded-full
                     text-sm sm:text-base
                     transition duration-200 ease-in-out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Get the app
        </button>
      </div>
    </div>
  );
};

export default WelcomeForm;