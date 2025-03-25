import React from "react";
import SignWithGoogle from "./SignWithGoogle";
import { Link, useNavigate } from "react-router-dom";

const WelcomeForm = () => {
  const navigate = useNavigate();

  const handleSignInWithEmail = () => {
    // TODO: Navigate to SignInPage
    navigate("/auth/signin");
  };

  return (
    <div className="space-y-6">
      {/* Sign in with Google */}
      <SignWithGoogle />

      {/* Sign in with Email */}
      <button
        type="button"
        onClick={handleSignInWithEmail}
        className="w-full flex items-center justify-center bg-white text-gray-700 py-4 px-4 border-2 border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:border-black text-xl font-medium transition duration-200 ease-in-out"
      >
        Sign in with Email
      </button>

      <p className="mt-6 text-center text-gray-600 text-xl">
        New to Tawasol?{" "}
        <Link
          to="/auth/signup"
          className="text-blue-600 font-semibold hover:underline"
        >
          {/* TODO: Navigate to SignUpPage*/}
          Join now
        </Link>
      </p>
    </div>
  );
};

export default WelcomeForm;
