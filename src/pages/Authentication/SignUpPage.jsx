import React, { useEffect, useState } from "react";
import SignUpForm from "./Forms/SignUpForm";
import { useDispatch } from "react-redux";
import { logout, setEmail, setPassword } from "../../store/authenticationSlice";
import { axiosInstance } from "../../apis/axios";
import { useNavigate } from "react-router-dom";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";

const SignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleSignUp = async (formData, setEmailError) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/auth/check-email", {
        email: formData.email,
      });

      if (response.status === 201) {
        setEmailError("");
        dispatch(setEmail(formData.email));
        dispatch(setPassword(formData.password));

        setIsLoading(false);
        navigate("/auth/signup/name");
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        if (error.response.status === 409) {
          setEmailError("Email already in use.");
        } else {
          console.error("Unexpected error:", error.response.status);
        }
      } else {
        console.error("Network error or server is down");
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
        <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default SignUpPage;
