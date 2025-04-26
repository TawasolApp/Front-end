import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { firstName, lastName } = useSelector((state) => state.authentication);
  const [billingCycle, setBillingCycle] = useState('annual');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    firstName: firstName || '',
    lastName: lastName || '',
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
    country: '',
    postalCode: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate next month's same day
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const trialEndDate = nextMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  // Check form validity whenever cardDetails changes
  useEffect(() => {
    const newErrors = {};
    
    if (cardDetails.securityCode && !/^\d{3}$/.test(cardDetails.securityCode)) {
      newErrors.securityCode = 'CVC must be exactly 3 digits';
    }
    
    if (cardDetails.cardNumber && !/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be exactly 16 digits';
    }
    
    if (cardDetails.expiryDate && !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardDetails.expiryDate)) {
      newErrors.expiryDate = 'Please use MM/YY format';
    }
    
    if (cardDetails.postalCode && cardDetails.postalCode.trim() === '') {
      newErrors.postalCode = 'Postal code is required';
    }
    
    setErrors(newErrors);
    
    const isValid = (
      cardDetails.firstName.trim() !== '' &&
      cardDetails.lastName.trim() !== '' &&
      /^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, '')) &&
      /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardDetails.expiryDate) &&
      /^\d{3}$/.test(cardDetails.securityCode) &&
      cardDetails.country.trim() !== '' &&
      cardDetails.postalCode.trim() !== '' &&
      Object.keys(newErrors).length === 0
    );
    
    setIsFormValid(isValid);
  }, [cardDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces every 4 digits
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    // Format expiry date with slash
    if (name === 'expiryDate') {
      const formattedValue = value
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substring(0, 5);
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const validationErrors = {};
    
    if (!cardDetails.firstName.trim()) validationErrors.firstName = 'First name is required';
    if (!cardDetails.lastName.trim()) validationErrors.lastName = 'Last name is required';
    if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ''))) {
      validationErrors.cardNumber = 'Card number must be exactly 16 digits';
    }
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardDetails.expiryDate)) {
      validationErrors.expiryDate = 'Please use MM/YY format';
    }
    if (!/^\d{3}$/.test(cardDetails.securityCode)) {
      validationErrors.securityCode = 'CVC must be exactly 3 digits';
    }
    if (!cardDetails.country) validationErrors.country = 'Country is required';
    if (!cardDetails.postalCode.trim()) validationErrors.postalCode = 'Postal code is required';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setErrorMessage('Please fix the errors in the form');
      setShowErrorModal(true);
      return;
    }
    
    try {
      // Make the API call to subscribe
      const response = await fetch('/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store token
        },
        body: JSON.stringify({
          plantype: billingCycle === 'annual' ? 'Annual' : 'Monthly',
          payment_method: 'Credit Card',
          auto_renewal: true
        })
      });
  
      if (!response.ok) {
        throw new Error('Subscription failed');
      }
  
      const data = await response.json();
      
      // Navigate to current-plan page with subscription data
      navigate('/current-plan', { 
        state: { 
          subscription: data,
          paymentDetails: {
            firstName: cardDetails.firstName,
            lastName: cardDetails.lastName,
            maskedCardNumber: `•••• •••• •••• ${cardDetails.cardNumber.slice(-4)}`,
            expiryDate: cardDetails.expiryDate,
            billingCycle
          }
        }
      });
      
    } catch (error) {
      setErrorMessage('Subscription failed. Please try again.');
      setShowErrorModal(true);
      console.error('Subscription error:', error);
    }
  };

  // Calculate pricing based on billing cycle
  const monthlyPrice = 4824.55;
  const annualPrice = monthlyPrice * 12;
  const annualDiscount = annualPrice * 0.16;
  const finalAnnualPrice = annualPrice - annualDiscount;

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center items-start">
      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">Error</h3>
              <button 
                onClick={() => setShowErrorModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-700 mb-4">{errorMessage}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        {/* Left Column - Checkout Form */}
        <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {firstName}, unlock your 1-month free trial of Recruiter Lite.
            </h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Cancel anytime before {trialEndDate}. We'll send you a reminder 7 days before your free trial ends.
          </p>

          <div className="border-t border-gray-200 my-4"></div>

          {/* Billing Cycle Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm your billing cycle</h3>
            <p className="text-green-600 font-medium mb-4">
              Save EGP {annualDiscount.toLocaleString('en-EG')}/year when you select annual billing cycle
            </p>

            <div className="space-y-4">
              <div 
                className={`p-4 border rounded-lg cursor-pointer ${billingCycle === 'monthly' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setBillingCycle('monthly')}
              >
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    checked={billingCycle === 'monthly'}
                    onChange={() => setBillingCycle('monthly')}
                    className="h-5 w-5 text-blue-600"
                  />
                  <label className="ml-3 text-gray-900 font-medium">
                    Monthly
                    <span className="block text-gray-600 text-sm font-normal">
                      includes 1-month free trial
                    </span>
                  </label>
                </div>
              </div>

              <div 
                className={`p-4 border rounded-lg cursor-pointer ${billingCycle === 'annual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setBillingCycle('annual')}
              >
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    checked={billingCycle === 'annual'}
                    onChange={() => setBillingCycle('annual')}
                    className="h-5 w-5 text-blue-600"
                  />
                  <label className="ml-3 text-gray-900 font-medium">
                    Annual
                    <span className="block text-gray-600 text-sm font-normal">
                      includes 1-month free trial
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select your payment method</h3>

            <div className="space-y-2 mb-6">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked 
                  readOnly
                  className="h-5 w-5 text-blue-600"
                />
                <label className="ml-3 text-gray-900">
                  Add a payment method before continuing further.
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked 
                  readOnly
                  className="h-5 w-5 text-blue-600"
                />
                <label className="ml-3 text-gray-900">
                  Secure Checkout
                </label>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Credit/Debit card</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={cardDetails.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={cardDetails.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Credit or debit card number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiration date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Security code</label>
                  <input
                    type="text"
                    name="securityCode"
                    value={cardDetails.securityCode}
                    onChange={handleInputChange}
                    placeholder="CVC"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  {errors.securityCode && <p className="text-red-500 text-xs mt-1">{errors.securityCode}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select
                    name="country"
                    value={cardDetails.country}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={cardDetails.postalCode}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order summary</h3>
            
            <p className="font-medium text-gray-900 mb-2">
              Recruiter Lite (1 license, {billingCycle === 'annual' ? 'Annual' : 'Monthly'}) - 1-month free trial
            </p>
            <p className="text-green-600 font-medium mb-4">EGP 0 due today</p>

            <p className="text-gray-900 mb-2">After trial ends, on {trialEndDate}:</p>

            {billingCycle === 'annual' ? (
              <>
                <div className="flex justify-between mb-1">
                  <span>First license (EGP {monthlyPrice.toLocaleString('en-EG')} x 12 months)</span>
                  <span>EGP {annualPrice.toLocaleString('en-EG')}</span>
                </div>
                <div className="flex justify-between text-green-600 mb-2">
                  <span>Annual discount (Save 16%)</span>
                  <span>-EGP {annualDiscount.toLocaleString('en-EG')}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between font-medium">
                  <span>Total after free trial</span>
                  <span>EGP {finalAnnualPrice.toLocaleString('en-EG')}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between mb-2">
                  <span>First license</span>
                  <span>EGP {monthlyPrice.toLocaleString('en-EG')}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between font-medium">
                  <span>Total after free trial</span>
                  <span>EGP {monthlyPrice.toLocaleString('en-EG')}</span>
                </div>
              </>
            )}

            <div className="border-t border-gray-200 my-4"></div>

            <ul className="text-sm text-gray-600 space-y-2 mb-4">
              <li>
                Your free trial begins today and ends on <span className="font-medium">{trialEndDate}</span>. 
                We'll send you an email reminder 7 days before the free trial ends.
              </li>
              <li>
                Beginning <span className="font-medium">{trialEndDate}</span>, your payment method will be charged{' '}
                <span className="font-medium">
                  EGP {billingCycle === 'annual' ? finalAnnualPrice.toLocaleString('en-EG') : monthlyPrice.toLocaleString('en-EG')} 
                  (plus applicable taxes)
                </span>{' '}
                each {billingCycle === 'annual' ? 'year' : 'month'}. The plan will automatically renew each{' '}
                {billingCycle === 'annual' ? 'year' : 'month'} until canceled.
              </li>
              <li>
                Cancel anytime before {trialEndDate} to avoid being charged.
              </li>
              <li>
                All assigned team members will be able to use this <span className="font-medium">shared payment method</span>{' '}
                to promote <span className="font-medium">online job postings</span>. All team purchases can be viewed in LinkedIn Admin Center.
              </li>
            </ul>

            <p className="text-xs text-gray-500">
              By placing this order, you agree to our <a href="#" className="text-blue-600">terms of service</a>. 
              To ensure continued service, we'll store and update your payment method. 
              Learn about <a href="#" className="text-blue-600">how to cancel</a> and our{' '}
              <a href="#" className="text-blue-600">refund policy</a>.
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`w-full py-3 px-6 font-medium rounded-full transition-colors text-[16px] ${
              isFormValid
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Try now for EGP0
          </button>
          <p className="text-center text-xs text-gray-500 mt-2">Secure checkout</p>
        </div>

        {/* Right Column - FAQ */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently asked questions</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">
                Will I be charged during my free trial?
              </h4>
              <p className="text-gray-600">
                We will not charge you until your free trial has ended. You can cancel anytime before {trialEndDate} to avoid being charged.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">
                What happens after my free trial?
              </h4>
              <p className="text-gray-600">
                If you don't cancel before your free trial ends on {trialEndDate}, your subscription will renew, and we will automatically charge the payment method on file.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">
                How can I cancel during my free trial?
              </h4>
              <p className="text-gray-600">
                You can cancel your subscription anytime by navigating to LinkedIn Admin Center.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">
                Can I add more licenses after my purchase?
              </h4>
              <p className="text-gray-600">
                Yes, you may add more licenses at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;