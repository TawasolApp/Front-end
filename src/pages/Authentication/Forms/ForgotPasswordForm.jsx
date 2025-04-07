import React, { useState } from "react";
import InputField from "../GenericComponents//InputField";
import BlueSubmitButton from "../GenericComponents//BlueSubmitButton";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../apis/axios";
import { useDispatch } from "react-redux";
import { setEmail } from "../../../store/authenticationSlice";

const ForgotPasswordForm = () => {
  const [email, setEmailState] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      await axiosInstance.post("/auth/forgot-password", {
        email,
        isAndroid: false,
      });
      dispatch(setEmail(email));
      navigate("/auth/verification-pending");
    } catch (error) {
      if (error.response) {
        console.error("Forgot password error:", error.response.data);
        setError(
          error.response.data.message ||
            "Failed to send reset email. Please try again."
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
      <h2 className="text-4xl font-semibold text-textContent mb-8">
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
          setEmailState(e.target.value);
          setError("");
        }}
        placeholder="Enter your email"
        error={error}
      />

      {/* Info Text */}
      <p className="text-textPlaceholder text-lg my-8">
        We’ll send a verification code to this email if it matches an existing
        Tawasol account.
      </p>

      {/* Buttons */}
      <div className="flex flex-col items-center justify-between space-y-4">
        <BlueSubmitButton text="Next" />
        <button
          type="button"
          onClick={handleBack}
          className="text-textContent text-xl font-medium p-2 rounded-full transition duration-200 ease-in-out hover:underline"
        >
          Back
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
