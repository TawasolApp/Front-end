import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { axiosInstance } from "../../apis/axios";
import { setIsPremium } from '../../store/authenticationSlice';

const CurrentPlanPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRenew = () => {
    navigate('/premium');
  };

  const handleCancel = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axiosInstance.delete("/premium-plan", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 204) {
        // Update Redux state
        dispatch(setIsPremium(false));
        setSuccess('Your premium plan has been cancelled successfully');
        
        // Optionally redirect after a delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError('You are not on any premium plan');
            break;
          case 401:
            setError('Please log in to continue');
            break;
          case 409:
            setError('You have already cancelled your premium plan');
            break;
          default:
            setError(err.response.data?.message || `Request failed with status ${err.response.status}`);
        }
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Current Plan</h1>
        
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Subscription Details</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Add your subscription details here */}
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={handleRenew}
            disabled={isLoading}
            className={`bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Renew Plan
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className={`bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Cancelling...' : 'Cancel Plan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentPlanPage;