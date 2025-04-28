import React from "react";
import { useNavigate } from "react-router-dom";

const PremiumAdvice = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-bold text-textHeavyTitle dark:text-darkTextHeavyTitle">
        Recruiter Lite users receive 3.7x more replies from candidates
      </h1>
      
      <p className="text-[14px] text-textActivity dark:text-darkTextActivity">
        Millions of members use Premium
      </p>
      
      <p className="text-[14px] text-textContent dark:text-darkTextContent">
        Claim your 1-month free trial today, Cancel anytime. We'll send you a reminder 7 days before your trial ends.
      </p>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-medium text-textHeavyTitle dark:text-darkTextHeavyTitle">Choose plan</span>
        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div className="h-2 bg-listSelected dark:bg-darkListSelected rounded-full" style={{ width: '90%' }}></div>
        </div>
      </div>
      
      <div className="border-t border-cardBorder dark:border-darkCardBorder my-4"></div>
      
      <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
        <h2 className="text-[18px] font-bold text-textHeavyTitle dark:text-darkTextHeavyTitle mb-2">
          Price: EGP5,499.99* 1-month free trial
        </h2>
        <p className="text-[14px] text-textContent dark:text-darkTextContent">
          After your free month, pay as little as EGP5,499.99 EGP ($59.00* / month (save 16%) when billed annually. 
          Cancel anytime. We'll remind you 7 days before your trial ends.
        </p>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={() => navigate('/checkout')}
          className="w-full py-3 bg-buttonSubmitEnable hover:bg-buttonSubmitEnableHover text-white font-medium rounded-full transition-colors text-[14px]"
        >
          Start free trial
        </button>
        
        <p className="text-[12px] text-textPlaceholder dark:text-darkTextPlaceholder text-center">
          Secure checkout
        </p>
      </div>
      
      <div className="text-[12px] text-textPlaceholder dark:text-darkTextPlaceholder mt-6">
        <p>* Price shown excluding applicable taxes. Offer terms apply.</p>
      </div>
    </div>
  );
};

export default PremiumAdvice;