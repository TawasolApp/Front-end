import React from "react";
import ChangePasswordForm from "./components/ChangePasswordForm";

const ChangePasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl lg:max-w-4xl bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;