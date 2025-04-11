import React, { useState } from "react";
import { useSelector } from "react-redux";
import InputField from "../GenericComponents/InputField";
import BlueSubmitButton from "../GenericComponents/BlueSubmitButton";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../apis/axios";

const NewPasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");
  const [status, setStatus] = useState("");

  const email = useSelector((state) => state.authentication.email); // Access email from Redux state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!newPassword) {
      setNewPasswordError("Please enter your new password.");
      return;
    }
    if (newPassword.length < 8) {
      setNewPasswordError("Password is too short.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError("Passwords do not match.");
      return;
    }

    try {
      setStatus("Submitting...");

      const response = await axiosInstance.patch("/auth/set-new-password", {
        email: email,
        newPassword: newPassword,
      });

      if (response.status === 200) {
        setStatus("Password reset successful! Redirecting...");
        setTimeout(() => {
          navigate("/auth/signin");
        }, 1500);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setStatus("Something went wrong. Please try again.");
    }
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-4xl font-semibold text-textContent mb-2">
        Choose a new password
      </h2>

      <p className="text-lg text-textContent mb-6">
        To secure your account, choose a strong password you haven’t used before
        and is at least 8 characters long.
      </p>

      {/* Input Fields */}
      <InputField
        type={showNewPassword ? "text" : "password"}
        id="newPassword"
        name="newPassword"
        labelText="New password"
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
          setNewPasswordError("");
        }}
        placeholder=""
        showPasswordToggle
        onTogglePasswordVisibility={toggleNewPasswordVisibility}
        showPassword={showNewPassword}
        error={newPasswordError}
      />

      <InputField
        type="password"
        id="confirmNewPassword"
        name="confirmNewPassword"
        labelText="Retype new password"
        value={confirmNewPassword}
        onChange={(e) => {
          setConfirmNewPassword(e.target.value);
          setConfirmNewPasswordError("");
        }}
        placeholder=""
        error={confirmNewPasswordError}
      />

      <p className="text-base text-center text-textHomeTitle">{status}</p>

      <BlueSubmitButton text="Submit" />
    </form>
  );
};

export default NewPasswordForm;
