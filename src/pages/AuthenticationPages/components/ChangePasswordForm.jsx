import React, { useState } from "react";
import InputField from "./InputField";
import BlueSubmitButton from "./BlueSubmitButton";
import ArrowBack from "@mui/icons-material/ArrowBack";

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [requireNewSignIn, setRequireNewSignIn] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!currentPassword) {
      setCurrentPasswordError("Please enter your current password.");
      return;
    }
    if (!newPassword) {
      setNewPasswordError("Please enter your new password.");
      return;
    }
    if (!confirmNewPassword) {
      setConfirmNewPasswordError("Please confirm your new password.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError("Passwords do not match.");
      return;
    }

    // Submit logic
    console.log("Password change submitted");
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleForgotPassword = () => {
    // go to forgot password page
    console.log("Forgot password");
  };

  const handleBack = () => {
    // Navigate back
    console.log("Back");
  };

  const isFormValid = () => {
    return (
      currentPassword &&
      newPassword &&
      confirmNewPassword &&
      newPassword.length >= 8 &&
      newPassword === confirmNewPassword
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-1/2 min-w-96">
      <button
        type="button"
        onClick={handleBack}
        className="relative top-0 left-0 mb-4 flex items-center text-gray-500 text-lg font-medium transition duration-200 ease-in-out"
      >
        <ArrowBack className="mr-2 max-w-6" />
        Back
      </button>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        Change Password
      </h2>
      <p className="text-lg mb-9">
        Create a new password that is at least 8 characters long.
      </p>
      {/* Current Password Field */}
      <InputField
        type={showCurrentPassword ? "text" : "password"}
        id="currentPassword"
        name="currentPassword"
        labelText="Type your current password *"
        value={currentPassword}
        onChange={(e) => {
          setCurrentPassword(e.target.value);
          setCurrentPasswordError("");
        }}
        onBlur={() => {
          if (!currentPassword) {
            setCurrentPasswordError("Please enter your current password.");
          }
        }}
        placeholder=""
        labelClassName="!text-lg !font-normal"
        inputClassName="!py-1 !text-lg rounded-md !border-black !border !bg-white !cursor-text"
        required
        showPasswordToggle
        onTogglePasswordVisibility={toggleCurrentPasswordVisibility}
        showPassword={showCurrentPassword}
        error={currentPasswordError}
      />

      {/* New Password Field */}
      <InputField
        type="password"
        id="newPassword"
        name="newPassword"
        labelText="Type your new password *"
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
          setNewPasswordError("");
        }}
        onBlur={() => {
          if (!newPassword) {
            setNewPasswordError("Please enter your new password.");
          } else if (newPassword.length < 8) {
            setNewPasswordError(
              "Your password is too short. It should be at least 8 characters long"
            );
          }
        }}
        placeholder=""
        labelClassName="!text-lg !font-normal"
        inputClassName="!py-1 !text-lg rounded-md !border-black !border !bg-white !cursor-text"
        required
        error={newPasswordError}
      />

      {/* Confirm New Password Field */}
      <InputField
        type={showNewPassword ? "text" : "password"}
        id="confirmNewPassword"
        name="confirmNewPassword"
        labelText="Retype your new password *"
        value={confirmNewPassword}
        onChange={(e) => {
          setConfirmNewPassword(e.target.value);
          setConfirmNewPasswordError("");
        }}
        onBlur={() => {
          if (!confirmNewPassword) {
            setConfirmNewPasswordError("Please confirm your new password.");
          } else if (confirmNewPassword.length < 8) {
            setConfirmNewPasswordError(
              "Your password is too short. It should be at least 8 characters long"
            );
          } else if (newPassword !== confirmNewPassword) {
            setConfirmNewPasswordError("Passwords do not match.");
          }
        }}
        placeholder=""
        labelClassName="!text-lg !font-normal"
        inputClassName="!py-1 !text-lg rounded-md !border-black !border !bg-white !cursor-text"
        required
        showPasswordToggle
        onTogglePasswordVisibility={toggleNewPasswordVisibility}
        showPassword={showNewPassword}
        error={confirmNewPasswordError}
      />

      {/* Submit Button and Forgot Password Link */}
      <div className="flex items-center justify-between">
        <div className="mb-6 flex flex-col items-center">
          <BlueSubmitButton text="Save Password" disabled={!isFormValid()} />
          <button
            type="button"
            onClick={handleForgotPassword}
            className="mt-4 bg-white w-full text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 text-xl font-medium transition duration-200 ease-in-out"
          >
            Forgot Password
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
