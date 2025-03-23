import React from "react";
import SignUpForm from "./components/SignUpForm";
import { useDispatch } from 'react-redux';
import { setEmail, setPassword } from "../../store/authenticationSlice";

const SignUpPage = () => {
  const dispatch = useDispatch();

  const handleSignUp = (formData) => {
    // Handle form submission (e.g., send data to an API)
    console.log("Form Data Submitted:", formData);

    dispatch(setEmail(formData.email));
    dispatch(setPassword(formData.password));
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