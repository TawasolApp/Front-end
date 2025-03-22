import React from "react";
import ChangePasswordForm from "./components/ChangePasswordForm";

const ChangePasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-white p-8 rounded-lg shadow-lg">
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;