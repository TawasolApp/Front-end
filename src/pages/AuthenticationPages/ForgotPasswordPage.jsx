import React from "react";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-mainBackground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-[rgb(var(--card-background))] p-8 rounded-xl shadow-2xl">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
