import React from "react";
import VerificationPendingForm from "./Forms/VerificationPendingForm";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";
import { useLocation } from "react-router-dom";

const VerificationPendingPage = () => {
  const location = useLocation();
  const showResend = location.state?.showResend || false;

  return (
    <div className="min-h-screen flex items-center justify-center bg-mainBackground py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <AuthenticationHeader hideButtons={true} />

      <div className="max-w-lg w-full bg-cardBackground p-8 rounded-xl shadow-2xl">
        <VerificationPendingForm showResend={showResend} />
      </div>
    </div>
  );
};

export default VerificationPendingPage;
