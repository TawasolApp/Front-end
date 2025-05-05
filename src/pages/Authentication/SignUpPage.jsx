import React, { useEffect, useState } from "react";
import SignUpForm from "./Forms/SignUpForm";
import { useDispatch } from "react-redux";
import { logout, setEmail } from "../../store/authenticationSlice";
import { axiosInstance } from "../../apis/axios";
import { useNavigate } from "react-router-dom";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";
import { toast } from "react-toastify";

const SignUpPage = ({ onSubmit }) => {
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
        onSubmit(formData.email, formData.password)
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
          toast.error("Unexpected error, please try again.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } else {
        console.error("Network error or server is down");
        toast.error("Network error or server is down.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-mainBackground px-4 sm:px-6 lg:px-8 py-8">
      <AuthenticationHeader hideButtons={true} />

      <div className="w-full max-w-md sm:max-w-lg text-center mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-3xl font-normal text-textHeavyTitle px-4">
          Make the most of your professional life
        </h1>
      </div>

      <div className="bg-cardBackground p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
        <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default SignUpPage;