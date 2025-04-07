import React, { useState } from "react";
import InputField from "../GenericComponents/InputField";
import BlueSubmitButton from "../GenericComponents//BlueSubmitButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { axiosInstance } from "../../../apis/axios";
import { useNavigate } from "react-router-dom";

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setErrorMessage("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      const response = await axiosInstance.patch("/users/update-password", {
        currentPassword,
        newPassword,
      });
      
      if (response.status === 200) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (error) {
      console.log("catch");
      if (error.response?.status === 400) {
        setErrorMessage("Incorrect current password.");
      } else if (error.response?.status === 401) {
        setErrorMessage("Unauthorized.");
      } else if (error.response?.status === 404) {
        setErrorMessage("User not found.");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleForgotPassword = () => {
    navigate("/auth/forgot-password");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isFormValid = () => {
    return (
      currentPassword &&
      newPassword &&
      confirmNewPassword &&
      newPassword.length >= 8 &&
      newPassword === confirmNewPassword &&
      !loading
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-3/4 lg:w-1/2 min-w-0">
      {/* Back Button */}
      <button
        type="button"
        onClick={handleBack}
        className="mb-3 sm:mb-4 flex items-center text-textPlaceholder text-base sm:text-lg font-medium"
      >
        <ArrowBack className="mr-2 w-5 h-5" />
        Back
      </button>

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-textContent mb-1 sm:mb-2">
          Change Password
        </h2>
        <p className="text-base text-textContent sm:text-lg">
          Create a new password that is at least 8 characters long.
        </p>
      </div>

      {/* Password Fields */}
      <div className="space-y-4 sm:space-y-6">
        <InputField
          type={showCurrentPassword ? "text" : "password"}
          id="currentPassword"
          name="currentPassword"
          labelText="Type your current password *"
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            setCurrentPasswordError("");
            setErrorMessage("");
          }}
          onBlur={() => {
            if (!currentPassword) {
              setCurrentPasswordError("Please enter your current password.");
            }
          }}
          labelClassName="!text-lg !font-normal"
          inputClassName="!py-1 !text-lg rounded-md !cursor-text"
          required
          showPasswordToggle
          onTogglePasswordVisibility={toggleCurrentPasswordVisibility}
          showPassword={showCurrentPassword}
          error={currentPasswordError}
        />

        <InputField
          type="password"
          id="newPassword"
          name="newPassword"
          labelText="Type your new password *"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setNewPasswordError("");
            setErrorMessage("");
          }}
          onBlur={() => {
            if (!newPassword) {
              setNewPasswordError("Please enter your new password.");
            } else if (newPassword.length < 8) {
              setNewPasswordError(
                "Your password is too short. It should be at least 8 characters long",
              );
            }
          }}
          labelClassName="!text-lg !font-normal"
          inputClassName="!py-1 !text-lg rounded-md !cursor-text"
          required
          error={newPasswordError}
        />

        <InputField
          type={showNewPassword ? "text" : "password"}
          id="confirmNewPassword"
          name="confirmNewPassword"
          labelText="Retype your new password *"
          value={confirmNewPassword}
          onChange={(e) => {
            setConfirmNewPassword(e.target.value);
            setConfirmNewPasswordError("");
            setErrorMessage("");
          }}
          onBlur={() => {
            if (!confirmNewPassword) {
              setConfirmNewPasswordError("Please confirm your new password.");
            } else if (newPassword !== confirmNewPassword) {
              setConfirmNewPasswordError("Passwords do not match.");
            }
          }}
          labelClassName="!text-lg !font-normal"
          inputClassName="!py-1 !text-lg rounded-md !cursor-text"
          required
          showPasswordToggle
          onTogglePasswordVisibility={toggleNewPasswordVisibility}
          showPassword={showNewPassword}
          error={confirmNewPasswordError}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <p className="text-red-500 text-base sm:text-lg mb-4">{errorMessage}</p>
      )}

      {/* Buttons */}
      <div className="flex flex-col space-y-4 mt-6">
        <BlueSubmitButton
          text={loading ? "Saving..." : "Save Password"}
          disabled={!isFormValid() || loading}
        />
        <button
          type="button"
          onClick={handleForgotPassword}
          className="bg-cardBackground text-textContent px-4 py-3 rounded-lg hover:bg-buttonSubmitDisable text-base sm:text-lg font-medium transition-colors"
        >
          Forgot Password
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
