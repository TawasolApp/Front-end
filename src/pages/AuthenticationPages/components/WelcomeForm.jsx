import React from "react";
import SignWithGoogle from "./SignWithGoogle";

const WelcomeForm = () => {
  const handleSignInWithEmail = () => {
    console.log("Sign in with email");
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
        <a href="/signup" className="text-blue-600 font-semibold hover:underline">
          Join now
        </a>
      </p>
    </div>
  );
};

export default WelcomeForm;
