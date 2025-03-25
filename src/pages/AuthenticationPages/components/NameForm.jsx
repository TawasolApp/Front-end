import React, { useRef, useState } from "react";
import InputField from "./InputField";
import BlueSubmitButton from "./BlueSubmitButton";
import ReCAPTCHA from "react-google-recaptcha";

const NameForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const recaptchaRef = useRef(null);

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
      setFirstNameError("Please enter your first name.");
    } else {
      setFirstNameError("");
    }
  };

  const handleLastNameBlur = () => {
    if (!formData.lastName) {
      setLastNameError("Please enter your last name.");
    } else {
      setLastNameError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName) {
      setFirstNameError("Please enter your first name.");
      return;
    }
    if (!formData.lastName) {
      setLastNameError("Please enter your last name.");
      return;
    }

    const captchaToken = await recaptchaRef.current.getValue();

    if (!captchaToken) {
      alert("Please complete the CAPTCHA.");
      return;
    }

    onSubmit(formData, captchaToken);
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
        error={lastNameError}
      />
      {/* reCAPTCHA Widget */}
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey="6LdMDv0qAAAAAC935jMxhIW2ZSMaei6Hs1YU2PyR" // Site Key
        className="grid place-items-center my-6"
      />
      <BlueSubmitButton text="Continue" />
    </form>
  );
};

export default NameForm;
