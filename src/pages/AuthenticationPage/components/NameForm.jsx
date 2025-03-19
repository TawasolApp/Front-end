import React, { useState } from "react";
import InputField from "./InputField";
import BlueSubmitButton from "./BlueSubmitButton";

const NameForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "firstName" && firstNameError) {
      setFirstNameError("");
    }
    if (name === "lastName" && lastNameError) {
      setLastNameError("");
    }
  };

  const handleFirstNameBlur = () => {
    if (!formData.firstName) {
      setFirstNameError('Please enter your first name.');
    } else {
      setFirstNameError('');
    }
  };
  
  const handleLastNameBlur = () => {
    if (!formData.lastName) {
      setLastNameError('Please enter your last name.');
    } else {
      setLastNameError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName) {
      setFirstNameError('Please enter your first name.');
      return;
    }
    if (!formData.lastName) {
      setLastNameError('Please enter your last name.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        type="text"
        id="firstName"
        name="firstName"
        labelText="First name"
        value={formData.firstName}
        onChange={handleChange}
        onBlur={handleFirstNameBlur}
        placeholder=""
        required
        error={firstNameError}
      />
      <InputField
        type="text"
        id="lastName"
        name="lastName"
        labelText="Last name"
        value={formData.lastName}
        onChange={handleChange}
        onBlur={handleLastNameBlur}
        placeholder=""
        required
        error={lastNameError}
      />
      <BlueSubmitButton text="Continue"/>
    </form>
  );
};

export default NameForm;