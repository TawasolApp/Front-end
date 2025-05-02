import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { axiosInstance } from "../../apis/axios";
import { setIsPremium } from '../../store/authenticationSlice';

const CurrentPlanPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isPremium = useSelector(state => state.authentication.isPremium);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Check premium status on component mount
  useEffect(() => {
    if (!isPremium) {
      navigate('/premium');
    }
  }, [isPremium, navigate]);

  const handleGoHome = () => {
    navigate('/feed');
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
        dispatch(setIsPremium(false));
        setSuccess('Your premium plan has been cancelled successfully');
        
        setTimeout(() => {
          navigate('/feed');
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

  // Don't render the page if user is not premium
  if (!isPremium) {
    return null;
  }

  return (
    <div className="min-h-screen bg-mainBackground p-4 sm:p-6">
      <div className="bg-cardBackground p-4 sm:p-6 rounded-lg shadow-md w-full mx-auto max-w-full sm:max-w-[900px] border border-cardBorder">
        <div className="border-b border-cardBorder pb-4 mb-4">
          <h1 className="text-xl font-semibold text-textHeavyTitle">
            Your Current Plan
          </h1>
        </div>

        <div className="border-b border-cardBorder pb-6 mb-6">
          <h2 className="text-lg font-semibold text-textHeavyTitle mb-4">Your premium plan is:</h2>
          <div className="bg-cardBackground p-4 rounded-md border border-cardBorder">
            <h3 className="text-lg font-medium text-textHeavyTitle">LinkedIn Premium Career</h3>
            <p className="text-textContent mt-1">Best for job seekers and career growth</p>
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

        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <button
            onClick={handleGoHome}
            className="px-4 py-2 text-sm font-semibold text-textActivity border-2 border-itemBorder hover:border-itemBorderHover rounded-full hover:bg-buttonIconHover hover:font-bold transition-all w-full sm:w-auto text-center"
          >
            Go to Home
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-semibold text-buttonSubmitText border-2 border-buttonSubmitEnable hover:border-buttonSubmitEnableHover rounded-full ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-buttonSubmitEnableHover hover:font-bold'
            } transition-all w-full sm:w-auto text-center bg-buttonSubmitEnable`}
          >
            {isLoading ? 'Cancelling...' : 'Cancel Plan'}
          </button>
        </div>
        <p className="text-sm text-textPlaceholder mt-3 text-center">If you want to cancel the premium plan</p>
      </div>
    </div>
  );
};

export default CurrentPlanPage;