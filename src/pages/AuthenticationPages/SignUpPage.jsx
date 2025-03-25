import React from "react";
import SignUpForm from "./components/SignUpForm";
import { useDispatch } from "react-redux";
import { setEmail, setPassword } from "../../store/authenticationSlice";
import { axiosInstance } from "../../apis/axios";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUp = async (formData, setEmailError) => {
    try {
      const response = await axiosInstance.post("/auth/check-email", {
        email: formData.email,
      });

      if (response.status === 200) {
        setEmailError("");
        dispatch(setEmail(formData.email));
        dispatch(setPassword(formData.password));

        // TODO: Navigate to NamePage
        navigate("/auth/signup/name");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setEmailError("Email already in use.");
        } else {
          console.log("Unexpected error:", error.response.status);
        }
      } else {
        console.log("Network error or server is down");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal mb-4 sm:mb-6 md:mb-8 text-gray-800 text-center">
        Make the most of your professional life
      </h1>
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
        <SignUpForm onSubmit={handleSignUp} />
      </div>
    </div>
  );
};

export default SignUpPage;
