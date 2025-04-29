import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CurrentPlanPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleRenew = () => {
    // Implement renew logic
    console.log('Renewing plan...');
  };

  const handleCancel = () => {
    // Implement cancel logic
    console.log('Canceling plan...');
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Current Plan</h1>
        
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Subscription Details</h2>
          <div className="grid grid-cols-2 gap-4">
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleRenew}
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700"
          >
            Renew Plan
          </button>
          <button
            onClick={handleCancel}
            className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700"
          >
            Cancel Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentPlanPage;