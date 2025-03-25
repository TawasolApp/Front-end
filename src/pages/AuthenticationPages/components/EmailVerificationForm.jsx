import React, { useState } from "react";
import InputField from "./InputField";
import BlueSubmitButton from "./BlueSubmitButton";
import { useSelector } from "react-redux";

const EmailVerificationForm = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const { email } = useSelector((state) => state.authentication);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!code) {
      setError("Please enter your email.");
      return;
    }

    console.log("Verification code:", code);
  };

  const serializeEmail = (email) => {
    return email[0] + "*****@" + email.split("@")[1];
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-4xl font-semibold text-textHomeTitle mb-8">
        Email Verification Pending
      </h2>

      {/* Display Email */}
      <p className="text-lg text-textHomeTitle">
        Check <span className="font-semibold">{serializeEmail(email)}</span> for
        a verification code.
      </p>

      <button
        type="button"
        onClick={() => {}}
        className="text-buttonSubmitEnable hover:underline inline-block text-lg mb-6 font-medium p-1 rounded-full transition duration-200 ease-in-out hover:bg-[rgb(var(--link-hover))]"
      >
        Change
      </button>

      {/* Code Input */}
      <InputField
        type="text"
        id="code"
        name="code"
        labelText=""
        value={code}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) {
            setCode(value);
          }
          setError("");
        }}
        placeholder="6-digit code"
        containerClassName="!mb-2"
        error={error}
      />

      <button
        type="button"
        onClick={() => {}}
        className="text-buttonSubmitEnable hover:underline inline-block text-lg mb-6 font-medium p-1 rounded-full transition duration-200 ease-in-out"
      >
        Resend code
      </button>

      <BlueSubmitButton text="Submit" />

      {/* Info Text */}
      <p className="text-textHomeTitle text-lg my-8">
        If you don’t see the email in your inbox, check your spam folder. If
        it’s not there, the email address may not be confirmed, or it may not
        match an existing Tawasol account.
      </p>
    </form>
  );
};

export default EmailVerificationForm;
