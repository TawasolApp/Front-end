import React, { useState } from "react";
import BlueSubmitButton from "../GenericComponents/BlueSubmitButton";
import InputField from "../GenericComponents/InputField";
import { useSelector } from "react-redux";

const ChangeEmailForm = ({ onSubmit, isLoading = false }) => {
  const { email } = useSelector((state) => state.authentication);
  const [newEmail, setNewEmail] = useState(email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    setNewEmail(e.target.value);
    if (emailError) {
      setEmailError("");
    }
  };

  const handleEmailBlur = () => {
    if (!newEmail) {
      setEmailError("Please enter your new email.");
    } else if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newEmail) {
      setEmailError("Please enter your email.");
      return;
    }
    if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email.");
      return;
    }
    onSubmit(newEmail, currentPassword, setEmailError, setCurrentPasswordError);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-4xl font-semibold mb-4 text-textContent text-left">
        Update Email
      </h1>
      <p className="text-xl text-textContent text-left mb-2">
        Enter the new email you would like to be used by Tawasol.
      </p>
      <p className="text-lg text-textPlaceholder text-left mb-10">
        After submitting, you'll receive a verification email. You must click
        the link in that email to complete the email change process
      </p>

      <InputField
        type="text"
        id="newEmail"
        name="newEmail"
        labelText="New Email"
        value={newEmail}
        onChange={handleChange}
        onBlur={handleEmailBlur}
        placeholder=""
        required
        error={emailError}
      />

      <InputField
        type={showCurrentPassword ? "text" : "password"}
        id="currentPassword"
        name="currentPassword"
        labelText="Password"
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
        required
        showPasswordToggle
        onTogglePasswordVisibility={toggleCurrentPasswordVisibility}
        showPassword={showCurrentPassword}
        error={currentPasswordError}
      />

      <BlueSubmitButton text="Submit" isLoading={isLoading} />
    </form>
  );
};

export default ChangeEmailForm;
