import React from "react";
import ChangeEmailForm from "./Forms/ChangeEmailForm";
import { useDispatch } from "react-redux";
import { setEmail } from "../../store/authenticationSlice";
import { axiosInstance } from "../../apis/axios";
import { useNavigate } from "react-router-dom";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";

const ChangeEmailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (
    newEmail,
    currentPassword,
    setEmailError,
    setCurrentPasswordError,
  ) => {
    try {
      await axiosInstance.patch(
        "/users/request-email-update",
        {
          newEmail,
          password: currentPassword,
        },
      );

      dispatch(setEmail(newEmail));
      console.log("requested update email");

      navigate("/auth/verification-pending", { state: { type: "updateEmail" } });
    } catch (error) {
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
        <ChangeEmailForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ChangeEmailPage;
