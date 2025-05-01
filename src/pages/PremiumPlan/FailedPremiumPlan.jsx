import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SubscriptionFailedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleRetry = () => {
    // Implement retry logic
    console.log('Retrying subscription...');
    // You might want to retry the payment process here
  };

  const handleGoHome = () => {
    // Navigate to home page
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscription Failed</h1>
          <p className="text-gray-600">
            We couldn't process your subscription. Please try again or contact support if the problem persists.
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
          <button
            onClick={handleGoHome}
            className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700"
          >
            Go to Home Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionFailedPage;