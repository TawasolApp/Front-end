import React from "react";
import NewPasswordForm from "./Forms/NewPasswordForm";

const NewPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-mainBackground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-cardBackground p-8 rounded-xl shadow-2xl">
        <NewPasswordForm />
      </div>
    </div>
  );
};

export default NewPasswordPage;
