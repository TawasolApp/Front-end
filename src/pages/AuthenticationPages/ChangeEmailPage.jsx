import React from "react";
import ChangeEmailForm from "./components/ChangeEmailForm";
import { useDispatch } from "react-redux";
import { setEmail } from "../../store/authenticationSlice";
import { axiosInstance } from "../../apis/axios";

const ChangeEmailPage = () => {
  const dispatch = useDispatch();

  const handleSubmit = async (
    newEmail,
    currentPassword,
    setEmailError,
    setCurrentPasswordError
  ) => {
    try {
      await axiosInstance.patch("/users/request-email-update", {
        newEmail,
        password: currentPassword,
      });

      dispatch(setEmail(newEmail));

      alert("Confirmation email sent! Please check your new email address.");
      // TODO: Navigate to EmailVerificationPage
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setCurrentPasswordError("Incorrect password.");
      } else if (error.response && error.response.status === 401) {
        setCurrentPasswordError("Unauthorized.");
      } else if (error.response && error.response.status === 409) {
        setEmailError("Email already exists.");
      } else {
        console.error("Email update request failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-start pt-20 justify-center bg-mainBackground">
      <div className="bg-cardBackground p-10 rounded-lg w-full max-w-xl shadow-md">
        <ChangeEmailForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ChangeEmailPage;
