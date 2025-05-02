import React, { useState } from "react";
import ChangeEmailForm from "./Forms/ChangeEmailForm";
import { useDispatch } from "react-redux";
import { setEmail } from "../../store/authenticationSlice";
import { axiosInstance } from "../../apis/axios";
import { useNavigate } from "react-router-dom";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";

const ChangeEmailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    newEmail,
    currentPassword,
    setEmailError,
    setCurrentPasswordError
  ) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.patch(
        "/users/request-email-update",
        {
          newEmail,
          password: currentPassword,
        }
      );
      const { verifyToken } = response.data;

      dispatch(setEmail(newEmail));

      if (String(import.meta.env.VITE_ENVIRONMENT || "").trim() === "test") {
        setIsLoading(false);

        if (!verifyToken) {
          console.log("Invalid verification link.");
          return;
        }

        axiosInstance
          .get(`/users/confirm-email-change?token=${verifyToken}`)
          .then((res) => {
            console.log("Email updated successfully! Redirecting...");
            setTimeout(() => {
              navigate("/feed"); // Navigating to /feed
            }, 1500);
            return;
          })
          .catch((err) => {
            console.error(err);
            if (err.response?.status === 400) {
              console.log(
                "Invalid or expired token. Please request a new verification email."
              );
            } else if (err.response?.status === 404) {
              console.log("User not found. Please contact support.");
            } else {
              console.log("Something went wrong. Please try again later.");
            }
            return;
          });
      }

      setIsLoading(false);
      navigate("/auth/verification-pending", {
        state: { type: "updateEmail" },
      });
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.status === 400) {
        setCurrentPasswordError("Incorrect password.");
      } else if (error.response && error.response.status === 401) {
        setCurrentPasswordError("Unauthorized.");
      } else if (error.response && error.response.status === 409) {
        setEmailError("Email already exists.");
      } else {
        console.error("Email update request failed:", error);
        setEmailError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-start pt-20 justify-center bg-mainBackground overflow-x-hidden">
      <AuthenticationHeader hideButtons={true} />

      <div className="bg-cardBackground p-10 rounded-lg w-full max-w-xl shadow-md">
        <ChangeEmailForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChangeEmailPage;
