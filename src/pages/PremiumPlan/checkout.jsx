import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { axiosInstance } from "../../apis/axios";


const CheckoutPage = () => {
  const { firstName } = useSelector((state) => state.authentication);
  const [billingCycle, setBillingCycle] = useState('Yearly');
  const [paymentType, setPaymentType] = useState('subscription');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate next month's same day
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const trialEndDate = nextMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await axiosInstance.post(
        "/premium-plan",
        {
          planType: billingCycle === 'Yearly' ? 'Yearly' : 'Monthly',
          autoRenewal: paymentType === 'subscription'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
  
      if (response.data && response.data.checkoutSessionUrl) {
        window.location.href = response.data.checkoutSessionUrl;
      } else {
        throw new Error('Invalid response from server');
      }
  
    } catch (err) {
      // Handle different error cases
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
          setError('Please log in to continue');
        } else if (err.response.status === 404) {
          setError('Service endpoint not found. Please contact support.');
        } else if (err.response.status === 409) {
          setError('You already have an active premium plan');
        } else {
          setError(err.response.data?.message || `Request failed with status ${err.response.status}`);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError('Network error. Please check your connection and try again.');
      } else {
        // Other errors
        setError(err.message || 'An unexpected error occurred');
      }
      console.error('Premium plan request error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate pricing based on billing cycle
  const monthlyPrice = 4824.55;
  const YearlyPrice = monthlyPrice * 12;
  const YearlyDiscount = YearlyPrice * 0.16;
  const finalYearlyPrice = YearlyPrice - YearlyDiscount;

  return (
    <div className="min-h-screen bg-mainBackground dark:bg-darkMainBackground p-4 flex justify-center items-start">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        {/* Left Column - Checkout Form */}
        <div className="w-full md:w-2/3 bg-cardBackground dark:bg-darkCardBackground p-6 rounded-lg shadow-sm border border-cardBorder dark:border-darkCardBorder">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-textHeavyTitle dark:text-darkTextHeavyTitle">
              {firstName}, unlock your 1-month free trial of Recruiter Lite.
            </h2>
          </div>
          
          <p className="text-textContent dark:text-darkTextContent mb-6">
            Cancel anytime before {trialEndDate}. We'll send you a reminder 7 days before your free trial ends.
          </p>

          <div className="border-t border-cardBorder dark:border-darkCardBorder my-4"></div>

          {/* Billing Cycle Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-textHeavyTitle dark:text-darkTextHeavyTitle mb-4">Confirm your billing cycle</h3>
            <p className="text-green-600 dark:text-green-400 font-medium mb-4">
              Save EGP {YearlyDiscount.toLocaleString('en-EG')}/year when you select Yearly billing cycle
            </p>

            <div className="space-y-4">
              <div 
                className={`p-4 border rounded-lg cursor-pointer ${
                  billingCycle === 'monthly' 
                    ? 'border-listSelected dark:border-darkListSelected bg-blue-50 dark:bg-blue-900' 
                    : 'border-cardBorder dark:border-darkCardBorder hover:bg-cardBackgroundHover dark:hover:bg-darkCardBackgroundHover'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    checked={billingCycle === 'monthly'}
                    onChange={() => setBillingCycle('monthly')}
                    className="h-5 w-5 text-listSelected dark:text-darkListSelected"
                  />
                  <label className="ml-3 text-textHeavyTitle dark:text-darkTextHeavyTitle font-medium">
                    Monthly
                    <span className="block text-textContent dark:text-darkTextContent text-sm font-normal">
                      includes 1-month free trial
                    </span>
                  </label>
                </div>
              </div>

              <div 
                className={`p-4 border rounded-lg cursor-pointer ${
                  billingCycle === 'Yearly' 
                    ? 'border-listSelected dark:border-darkListSelected bg-blue-50 dark:bg-blue-900' 
                    : 'border-cardBorder dark:border-darkCardBorder hover:bg-cardBackgroundHover dark:hover:bg-darkCardBackgroundHover'
                }`}
                onClick={() => setBillingCycle('Yearly')}
              >
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    checked={billingCycle === 'Yearly'}
                    onChange={() => setBillingCycle('Yearly')}
                    className="h-5 w-5 text-listSelected dark:text-darkListSelected"
                  />
                  <label className="ml-3 text-textHeavyTitle dark:text-darkTextHeavyTitle font-medium">
                    Yearly
                    <span className="block text-textContent dark:text-darkTextContent text-sm font-normal">
                      includes 1-month free trial
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Type Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-textHeavyTitle dark:text-darkTextHeavyTitle mb-4">Select payment type</h3>

            <div className="space-y-4">
              <div 
                className={`p-4 border rounded-lg cursor-pointer ${
                  paymentType === 'one-time' 
                    ? 'border-listSelected dark:border-darkListSelected bg-blue-50 dark:bg-blue-900' 
                    : 'border-cardBorder dark:border-darkCardBorder hover:bg-cardBackgroundHover dark:hover:bg-darkCardBackgroundHover'
                }`}
                onClick={() => setPaymentType('one-time')}
              >
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    checked={paymentType === 'one-time'}
                    onChange={() => setPaymentType('one-time')}
                    className="h-5 w-5 text-listSelected dark:text-darkListSelected"
                  />
                  <label className="ml-3 text-textHeavyTitle dark:text-darkTextHeavyTitle font-medium">
                    One-time Payment
                  </label>
                </div>
              </div>

              <div 
                className={`p-4 border rounded-lg cursor-pointer ${
                  paymentType === 'subscription' 
                    ? 'border-listSelected dark:border-darkListSelected bg-blue-50 dark:bg-blue-900' 
                    : 'border-cardBorder dark:border-darkCardBorder hover:bg-cardBackgroundHover dark:hover:bg-darkCardBackgroundHover'
                }`}
                onClick={() => setPaymentType('subscription')}
              >
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    checked={paymentType === 'subscription'}
                    onChange={() => setPaymentType('subscription')}
                    className="h-5 w-5 text-listSelected dark:text-darkListSelected"
                  />
                  <label className="ml-3 text-textHeavyTitle dark:text-darkTextHeavyTitle font-medium">
                    Subscription (Auto-renewal)
                  </label>
                </div>
              </div>
            </div>

            <p className="text-sm text-textContent dark:text-darkTextContent mt-4">
              {paymentType === 'subscription' ? (
                "Your payment method will be automatically charged at the end of each billing period."
              ) : (
                "You'll only be charged once for this purchase."
              )}
            </p>
          </div>

          {/* Order Summary */}
          <div className="border border-cardBorder dark:border-darkCardBorder rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-textHeavyTitle dark:text-darkTextHeavyTitle mb-4">Order summary</h3>
            
            <p className="font-medium text-textHeavyTitle dark:text-darkTextHeavyTitle mb-2">
              Recruiter Lite (1 license, {billingCycle === 'Yearly' ? 'Yearly' : 'Monthly'}) - 1-month free trial
            </p>
            <p className="text-green-600 dark:text-green-400 font-medium mb-4">EGP 0 due today</p>

            <p className="text-textHeavyTitle dark:text-darkTextHeavyTitle mb-2">After trial ends, on {trialEndDate}:</p>

            {billingCycle === 'Yearly' ? (
              <>
                <div className="flex justify-between mb-1">
                  <span className="text-textContent dark:text-darkTextContent">First license (EGP {monthlyPrice.toLocaleString('en-EG')} x 12 months)</span>
                  <span className="text-textContent dark:text-darkTextContent">EGP {YearlyPrice.toLocaleString('en-EG')}</span>
                </div>
                <div className="flex justify-between text-green-600 dark:text-green-400 mb-2">
                  <span>Yearly discount (Save 16%)</span>
                  <span>-EGP {YearlyDiscount.toLocaleString('en-EG')}</span>
                </div>
                <div className="border-t border-cardBorder dark:border-darkCardBorder my-2"></div>
                <div className="flex justify-between font-medium">
                  <span className="text-textHeavyTitle dark:text-darkTextHeavyTitle">Total after free trial</span>
                  <span className="text-textHeavyTitle dark:text-darkTextHeavyTitle">EGP {finalYearlyPrice.toLocaleString('en-EG')}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between mb-2">
                  <span className="text-textContent dark:text-darkTextContent">First license</span>
                  <span className="text-textContent dark:text-darkTextContent">EGP {monthlyPrice.toLocaleString('en-EG')}</span>
                </div>
                <div className="border-t border-cardBorder dark:border-darkCardBorder my-2"></div>
                <div className="flex justify-between font-medium">
                  <span className="text-textHeavyTitle dark:text-darkTextHeavyTitle">Total after free trial</span>
                  <span className="text-textHeavyTitle dark:text-darkTextHeavyTitle">EGP {monthlyPrice.toLocaleString('en-EG')}</span>
                </div>
              </>
            )}

            <div className="border-t border-cardBorder dark:border-darkCardBorder my-4"></div>

            <ul className="text-sm text-textContent dark:text-darkTextContent space-y-2 mb-4">
              <li>
                Your free trial begins today and ends on <span className="font-medium">{trialEndDate}</span>. 
                We'll send you an email reminder 7 days before the free trial ends.
              </li>
              <li>
                Beginning <span className="font-medium">{trialEndDate}</span>, your payment method will be charged{' '}
                <span className="font-medium">
                  EGP {billingCycle === 'Yearly' ? finalYearlyPrice.toLocaleString('en-EG') : monthlyPrice.toLocaleString('en-EG')} 
                  (plus applicable taxes)
                </span>{' '}
                each {billingCycle === 'Yearly' ? 'year' : 'month'}. The plan will automatically renew each{' '}
                {billingCycle === 'Yearly' ? 'year' : 'month'} until canceled.
              </li>
              <li>
                Cancel anytime before {trialEndDate} to avoid being charged.
              </li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-3 px-6 font-medium rounded-full transition-colors text-[16px] ${
              isLoading
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-buttonSubmitEnable hover:bg-buttonSubmitEnableHover text-white'
            }`}
          >
            {isLoading ? 'Processing...' : 'Try now for EGP0'}
          </button>
          <p className="text-center text-xs text-textPlaceholder dark:text-darkTextPlaceholder mt-2">Secure checkout</p>
        </div>

        {/* Right Column - FAQ */}
        <div className="w-full md:w-1/3 bg-cardBackground dark:bg-darkCardBackground p-6 rounded-lg shadow-sm border border-cardBorder dark:border-darkCardBorder h-fit">
          <h3 className="text-lg font-semibold text-textHeavyTitle dark:text-darkTextHeavyTitle mb-4">Frequently asked questions</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-textHeavyTitle dark:text-darkTextHeavyTitle">
                Will I be charged during my free trial?
              </h4>
              <p className="text-textContent dark:text-darkTextContent">
                We will not charge you until your free trial has ended. You can cancel anytime before {trialEndDate} to avoid being charged.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-textHeavyTitle dark:text-darkTextHeavyTitle">
                What happens after my free trial?
              </h4>
              <p className="text-textContent dark:text-darkTextContent">
                If you don't cancel before your free trial ends on {trialEndDate}, your subscription will renew, and we will automatically charge the payment method on file.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-textHeavyTitle dark:text-darkTextHeavyTitle">
                How can I cancel during my free trial?
              </h4>
              <p className="text-textContent dark:text-darkTextContent">
                You can cancel your subscription anytime by navigating to LinkedIn Admin Center.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;