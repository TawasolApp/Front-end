import React, { useState } from "react";
import InputField from "./InputField";
import SignWithGoogle from "./SignWithGoogle";
import Divider from "./Divider";
import BlueSubmitButton from "./BlueSubmitButton";

const SignInForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
    if (!formData.email) {
      setEmailError('Please enter your email.');
    } else {
      setEmailError('');
    }
  };
  
  const handlePasswordBlur = () => {
    if (!formData.password) {
      setPasswordError('Please enter your password.');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) {
      setEmailError('Please enter your email.');
      return;
    }
    if (!formData.password) {
      setPasswordError('Please enter your password.');
      return;
    }
    onSubmit(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-5xl font-semibold mb-8 text-gray-800 text-left">
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
      <div className="mb-6">
        <a
          href="/forgot-password"
          className="text-blue-600 hover:underline text-xl"
        >
          Forgot password?
        </a>
      </div>
      <div className="mb-6 flex items-center">
        <input
          type="checkbox"
          id="keepLoggedIn"
          className="w-5 h-5 mr-2 accent-green-600"
          defaultChecked
        />
        <label htmlFor="keepLoggedIn" className="text-gray-700 text-xl">
          Keep me logged in
        </label>
      </div>
      <BlueSubmitButton text="Sign in"/>
    </form>
  );
};

export default SignInForm;