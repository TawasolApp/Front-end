import React, { useState } from "react";
import BlueSubmitButton from "./BlueSubmitButton";
import InputField from "./InputField";
import { useSelector } from "react-redux";

const ChangeEmailForm = ({ onSubmit }) => {
  const { email } = useSelector((state) => state.authentication);
  const [newEmail, setNewEmail] = useState(email);

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
      alert("Please enter your email.");
      return;
    }
    if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email.");
      return;
    }
    onSubmit(newEmail);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-4xl font-semibold mb-4 text-gray-800 text-left">
        Update Email
      </h1>
      <p className="text-xl text-gray-700 text-left mb-10">
        Enter the new email you would like to be used by Tawasol.
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
      <BlueSubmitButton text="Submit" />
    </form>
  );
};

export default ChangeEmailForm;
