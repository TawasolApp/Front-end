import React from "react";
import SignWithGoogle from "../GenericComponents/SignWithGoogle";
import { Link, useNavigate } from "react-router-dom";

const WelcomeForm = () => {
  const navigate = useNavigate();

  const handleSignInWithEmail = () => {
    navigate("/auth/signin");
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
    </div>
  );
};

export default WelcomeForm;
