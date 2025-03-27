import React, { useState } from "react";
import InputField from "./InputField";
import SignWithGoogle from "./SignWithGoogle";
import Divider from "./Divider";
import BlueSubmitButton from "./BlueSubmitButton";
import { Link } from "react-router-dom";

const SignInForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [credentialsError, setCredentialsError] = useState("");

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
    setCredentialsError("");
  };

  const handleEmailBlur = () => {
    if (!formData.email) {
      setEmailError("Please enter your email.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordBlur = () => {
    if (!formData.password) {
      setPasswordError("Please enter your password.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) {
      setEmailError("Please enter your email.");
      return;
    }
    if (!formData.password) {
      setPasswordError("Please enter your password.");
      return;
    }
    onSubmit(formData, setCredentialsError);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 sm:mb-8 text-textHomeTitle">
        Sign in
      </h1>

      <SignWithGoogle />

      <Divider />

      <InputField
        type="text"
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
        labelText="Password"
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

      {credentialsError && (
        <p className="text-red-500 text-base sm:text-lg mt-2">
          {credentialsError}
        </p>
      )}

      <div className="mb-4 sm:mb-6">
        <Link
          to="/auth/forgot-password"
          className="text-buttonSubmitEnable hover:underline text-base sm:text-lg"
        >
          Forgot password?
        </Link>
      </div>

      <div className="mb-6 flex items-center">
        <input
          type="checkbox"
          id="keepLoggedIn"
          className="w-4 h-4 sm:w-5 sm:h-5 mr-2 accent-green-600"
          defaultChecked
        />
        <label
          htmlFor="keepLoggedIn"
          className="text-textContent text-base sm:text-lg"
        >
          Keep me logged in
        </label>
      </div>

      <BlueSubmitButton text="Sign in" />
    </form>
  );
};

export default SignInForm;
