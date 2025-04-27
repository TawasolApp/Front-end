import React from "react";
import { useNavigate } from "react-router-dom";

const PremiumAdvice = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-bold text-gray-900">
        Recruiter Lite users receive 3.7x more replies from candidates
      </h1>
      
      <p className="text-[14px] text-gray-600">
        Millions of members use Premium
      </p>
      
      <p className="text-[14px] text-gray-600">
        Claim your 1-month free trial today, Cancel anytime. We'll send you a reminder 7 days before your trial ends.
      </p>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-medium text-gray-900">Choose plan</span>
        <div className="w-24 h-2 bg-gray-200 rounded-full">
          <div className="h-2 bg-blue-500 rounded-full" style={{ width: '90%' }}></div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 my-4"></div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-[18px] font-bold text-gray-900 mb-2">Price: EGP5,499.99* 1-month free trial</h2>
        <p className="text-[14px] text-gray-600">
          After your free month, pay as little as EGP5,499.99 EGP ($59.00* / month (save 16%) when billed annually. 
          Cancel anytime. We'll remind you 7 days before your trial ends.
        </p>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={() => navigate('/checkout')} // Update with your actual checkout route
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors text-[14px]"
        >
          Start free trial
        </button>
        
        <p className="text-[12px] text-gray-500 text-center">
          Secure checkout
        </p>
      </div>
      
      <div className="text-[12px] text-gray-500 mt-6">
        <p>* Price shown excluding applicable taxes. Offer terms apply.</p>
      </div>
    </div>
  );
};

export default PremiumAdvice;