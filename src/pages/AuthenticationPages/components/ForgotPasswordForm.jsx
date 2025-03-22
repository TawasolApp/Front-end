import React, { useState } from "react";
import InputField from "./InputField";
import BlueSubmitButton from "./BlueSubmitButton";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!email) {
      setError("Please enter your email.");
      return;
    } else if (!validateEmail(email)) {
      setError("Wrong email, Please try with an alternate email.");
      return;
    }

    // Submit logic (e.g., send verification code)
    console.log("Verification code sent to:", email);
  };

  const handleBack = () => {
    return; // Go back to the previous page
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-4xl font-semibold text-gray-900 mb-8">
        Forgot password
      </h2>
      {/* Email or Phone Input */}
      <InputField
        type="text"
        id="email"
        name="email"
        labelText="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError("");
        }}
        placeholder="Enter your email"
        error={error}
      />

      {/* Info Text */}
      <p className="text-black text-lg my-8">
        We’ll send a verification code to this email if it matches an existing
        Tawasol account.
      </p>

      {/* Buttons */}
      <div className="flex flex-col items-center justify-between space-y-4">
        <BlueSubmitButton text="Next" />
        <a
          href=""
          onClick={handleBack}
          className="text-gray-500 text-xl font-medium p-2 rounded-full transition duration-200 ease-in-out hover:bg-stone-200 hover:underline"
        >
          Back
        </a>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
