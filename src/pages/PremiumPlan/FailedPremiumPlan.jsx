import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SubscriptionFailedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-mainBackground p-4 sm:p-6 flex justify-center items-start">
      <div className="bg-cardBackground p-4 sm:p-6 rounded-lg shadow-md w-full mx-auto max-w-full sm:max-w-[900px] border border-cardBorder">
        <div className="text-center mb-6">
          {/* Failure icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          
          <h1 className="text-xl font-semibold text-textHeavyTitle mb-2">Subscription Failed</h1>
          <p className="text-textContent">
            We couldn't process your subscription. Please try again or contact support if the problem persists.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleGoHome}
            className="px-4 py-2 text-sm font-semibold text-buttonSubmitText border-2 border-buttonSubmitEnable hover:border-buttonSubmitEnableHover rounded-full hover:bg-buttonSubmitEnableHover hover:font-bold transition-all text-center bg-buttonSubmitEnable"
          >
            Go to Home Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionFailedPage;