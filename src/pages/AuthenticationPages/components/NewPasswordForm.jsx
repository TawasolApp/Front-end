import React, { useState } from "react";
import InputField from "./InputField";
import BlueSubmitButton from "./BlueSubmitButton";

const NewPasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!newPassword) {
      setNewPasswordError("Please enter your new password.");
      return;
    }
    if (newPassword.length < 8) {
      setNewPasswordError("Too short");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError("Passwords do not match.");
      return;
    }

    // Submit logic
    console.log("New password submitted");
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-4xl font-semibold text-gray-900 mb-2">
        Choose a new password
      </h2>

      <p className="text-lg mb-6">
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

      <BlueSubmitButton text="Submit" />
    </form>
  );
};

export default NewPasswordForm;
