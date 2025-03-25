import React from "react";
import SignWithGoogle from "./SignWithGoogle";
import { Link, useNavigate } from "react-router-dom";

const WelcomeForm = () => {
  const navigate = useNavigate();

  const handleSignInWithEmail = () => {
    navigate("/auth/signin");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Sign in with Google */}
      <SignWithGoogle />

      {/* Sign in with Email */}
      <button
        type="button"
        onClick={handleSignInWithEmail}
        className="w-full flex items-center justify-center 
                   bg-cardBackground text-textContent 
                   py-3 sm:py-4 px-4 border-2 border-cardBorder 
                   rounded-full hover:bg-cardBackgroundHover 
                   focus:outline-none focus:border-itemBorderFocus 
                   text-lg sm:text-xl font-medium 
                   transition duration-200 ease-in-out"
      >
        Sign in with Email
      </button>

      <p className="mt-4 sm:mt-6 text-center text-textPlaceholder text-base sm:text-lg">
        New to Tawasol?{" "}
        <Link
          to="/auth/signup"
          className="text-buttonSubmitEnable font-medium hover:underline"
        >
          Join now
        </Link>
      </p>
    </div>
  );
};

export default WelcomeForm;
