import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CurrentPlanPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subscription, paymentDetails } = location.state || {};

  const handleRenew = () => {
    // Implement renew logic
    console.log('Renewing plan...');
  };

  const handleCancel = () => {
    // Implement cancel logic
    console.log('Canceling plan...');
  };

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">No active subscription found</h2>
          <button 
            onClick={() => navigate('/checkout')}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Subscribe Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Current Plan</h1>
        
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Subscription Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Plan Type</p>
              <p className="font-medium">{paymentDetails?.billingCycle === 'annual' ? 'Annual' : 'Monthly'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{subscription.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium">{new Date(subscription['start-date']).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expiry Date</p>
              <p className="font-medium">{new Date(subscription['expiry-date']).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Payment Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Card Holder</p>
              <p className="font-medium">{paymentDetails?.firstName} {paymentDetails?.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Card Number</p>
              <p className="font-medium">{paymentDetails?.maskedCardNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expires</p>
              <p className="font-medium">{paymentDetails?.expiryDate}</p>
            </div>
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