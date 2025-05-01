import React, { useState } from "react";
import Divider from "../GenericComponents/Divider";
import SignWithGoogle from "../GenericComponents/SignWithGoogle";
import InputField from "../GenericComponents/InputField";
import BlueSubmitButton from "../GenericComponents/BlueSubmitButton";
import { Link } from "react-router-dom";

const SignUpForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "email" && emailError) {
      setEmailError("");
    }
    if (name === "password" && passwordError) {
      setPasswordError("");
    }
  };

  const handleEmailBlur = () => {
    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordBlur = () => {
    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }
    onSubmit(formData, setEmailError);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        type="email"
        id="email"
        name="email"
        labelText="Email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleEmailBlur}
        placeholder="Email"
        required
        error={emailError}
      />
      <InputField
        type={showPassword ? "text" : "password"}
        id="password"
        name="password"
        labelText="Password (6+ characters)"
        value={formData.password}
        onChange={handleChange}
        onBlur={handlePasswordBlur}
        placeholder="Password"
        required
        showPasswordToggle
        onTogglePasswordVisibility={togglePasswordVisibility}
        showPassword={showPassword}
        error={passwordError}
      />
      <BlueSubmitButton text="Join" isLoading={isLoading} />
      <Divider />
      <SignWithGoogle />
      <p className="mt-4 text-center text-textContent text-base">
        Already on Tawasol?{" "}
        <Link
          to="/auth/signin"
          className="text-buttonSubmitEnable hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default SignUpForm;