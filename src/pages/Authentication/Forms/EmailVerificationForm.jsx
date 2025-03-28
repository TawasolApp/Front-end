import React, { useState } from "react";
import { useSelector } from "react-redux";

const EmailVerificationForm = () => {
  const { email } = useSelector((state) => state.authentication);

  const serializeEmail = (email) => {
    return email[0] + "*****@" + email.split("@")[1];
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-textHomeTitle mb-8">
        Email Verification Pending
      </h2>

      {/* Display Email */}
      <p className="text-lg text-textHomeTitle">
        A verification link was sent to{" "}
        <span className="font-semibold">{serializeEmail(email)}</span>. Please
        check your email and verify to continue.
      </p>
      {/* Info Text */}
      <p className="text-textHomeTitle text-lg my-2">
        If you don’t see the email in your inbox, check your spam folder. If
        it’s not there, the email address may not be confirmed, or it may not
        match an existing Tawasol account.
      </p>
      <div>
        <button
          type="button"
          onClick={() => {}}
          className="text-buttonSubmitEnable hover:underline inline-block text-lg my-2 font-medium p-1 rounded-full transition duration-200 ease-in-out"
        >
          Resend code
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationForm;
