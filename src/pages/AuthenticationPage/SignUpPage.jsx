import React from "react";
import SignUpForm from "./components/SignUpForm";

const SignUpPage = () => {
  const handleSignUp = (formData) => {
    // Handle form submission (e.g., send data to an API)
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100">
      <h1 className="text-4xl font-normal mb-8 text-gray-800 text-center">
        Make the most of your professional life
      </h1>
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg">
        <SignUpForm onSubmit={handleSignUp} />{" "}
      </div>
    </div>
  );
};

export default SignUpPage;