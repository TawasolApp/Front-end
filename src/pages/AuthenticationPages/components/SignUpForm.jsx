import React, { useState } from "react";
import Divider from "./Divider";
import SignWithGoogle from "./SignWithGoogle";
import InputField from "./InputField";
import BlueSubmitButton from "./BlueSubmitButton";

const SignUpForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

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
  
    if (name === 'email' && emailError) {
      setEmailError('');
    }
    if (name === 'password' && passwordError) {
      setPasswordError('');
    }
  };

  const handleEmailBlur = () => {
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };
  
  const handlePasswordBlur = () => {
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    onSubmit(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <div className="mb-6 flex items-center">
        <input
          type="checkbox"
          id="rememberMe"
          className="w-5 h-5 mr-2 accent-green-600"
          defaultChecked
        />
        <label htmlFor="rememberMe" className="text-gray-700 text-xl">
          Remember me
        </label>
      </div>
      <BlueSubmitButton text="Join" />
      <Divider />
      <SignWithGoogle />
      <p className="mt-6 text-center text-gray-600 text-xl">
        Already on Tawasol?{" "}
        <a href="/signin" className="text-blue-600 hover:underline">
          Sign in
        </a>
      </p>
    </form>
  );
};

export default SignUpForm;
