import React, { useRef, useState } from "react";
import InputField from "../GenericComponents//InputField";
import BlueSubmitButton from "../GenericComponents//BlueSubmitButton";
import ReCAPTCHA from "react-google-recaptcha";

const NameForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [captchaError, setCaptchaError] = useState("");
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
      setCaptchaError("Please complete the CAPTCHA.");
      return;
    }
    setCaptchaError("");

    onSubmit(formData, captchaToken);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
      <div className="grid place-items-center my-6">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={String(
            import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY || ""
          ).trim()}
          className="bg-cardBackground text-textContent p-2 rounded-lg"
        />
        {captchaError && (
          <p className="text-red-500 text-sm sm:text-base md:text-lg mt-1 sm:mt-2">
            {captchaError}
          </p>
        )}
      </div>

      <BlueSubmitButton text="Continue" />
    </form>
  );
};

export default NameForm;
