import React from "react";
import ForgotPasswordForm from "./Forms/ForgotPasswordForm";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen bg-mainBackground overflow-x-hidden">
      <AuthenticationHeader />

      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-cardBackground p-8 rounded-xl shadow-2xl">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;