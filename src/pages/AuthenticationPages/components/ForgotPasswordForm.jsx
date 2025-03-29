import React, { useState } from "react";
import InputField from "./InputField";
import BlueSubmitButton from "./BlueSubmitButton";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../apis/axios";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email) {
      setError("Please enter your email.");
      return;
    } else if (!validateEmail(email)) {
      setError("Wrong email, Please try with an alternate email.");
      return;
    }

    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      navigate("/auth/email-verification");
    } catch (error) {
      if (error.response) {
        console.error("Forgot password error:", error.response.data);
        setError(
          error.response.data.message ||
            "Failed to send reset email. Please try again.",
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        setError("Network error. Please check your connection.");
      } else {
        console.error("Error:", error.message);
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-4xl font-semibold text-textHomeTitle mb-8">
        Forgot password
      </h2>

      {/* Email Input */}
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
      <p className="text-textHomeTitle text-lg my-8">
        We’ll send a verification code to this email if it matches an existing
        Tawasol account.
      </p>

      {/* Buttons */}
      <div className="flex flex-col items-center justify-between space-y-4">
        <BlueSubmitButton text="Next" />
        <button
          type="button"
          onClick={handleBack}
          className="text-textHomeTitle text-xl font-medium p-2 rounded-full transition duration-200 ease-in-out hover:bg-[rgb(var(--hover-bg))] hover:underline"
        >
          Back
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
