import React from "react";
import SignUpForm from "./Forms/SignUpForm";
import { useDispatch } from "react-redux";
import { setEmail, setPassword } from "../../store/authenticationSlice";
import { axiosInstance } from "../../apis/axios";
import { useNavigate } from "react-router-dom";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-mainBackground px-4 sm:px-6 lg:px-8">
      <AuthenticationHeader hideButtons={true} />

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal mb-4 sm:mb-6 md:mb-8 text-textHeavyTitle text-center">
        Make the most of your professional life
      </h1>
      <div className="bg-cardBackground p-6 sm:p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
        <SignUpForm onSubmit={handleSignUp} />
      </div>
    </div>
  );
};

export default SignUpPage;
