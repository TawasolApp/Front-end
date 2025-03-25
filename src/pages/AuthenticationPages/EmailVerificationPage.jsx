import React from "react";
import EmailVerificationForm from "./components/EmailVerificationForm";

const EmailVerificationPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--main-background))] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-[rgb(var(--card-background))] p-8 rounded-xl shadow-2xl">
        <EmailVerificationForm />
      </div>
    </div>
  );
};

export default EmailVerificationPage;
