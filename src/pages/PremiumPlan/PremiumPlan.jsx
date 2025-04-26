import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PremiumPlan = () => {
  const navigate = useNavigate();
  const { firstName } = useSelector((state) => state.authentication);
  const [selectedOptions, setSelectedOptions] = useState({
    // Step 1 options
    personal: false,
    job: false,
    other: false,
    // Step 2 options
    profileViews: false,
    topApplicant: false,
    resumeFeedback: false,
    topChoice: false,
    recruiterContact: false,
    otherStep2: false,
    // Step 3 options
    jobSearch: false,
    professionalSkills: false,
    growNetwork: false,
    findLeads: false,
    hireTalent: false,
    otherStep3: false,
    // Step 4 options
    careerGuidance: false,
    skillCourses: false,
    certificates: false,
    learningVideos: false,
    dailyHabits: false,
    otherStep4: false,
    // Step 5 options
    candidateRecommendations: false,
    talentSearch: false,
    searchAlerts: false,
    inmailTemplates: false,
    otherStep5: false
  });
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Save selections to localStorage
  useEffect(() => {
    const savedSelections = localStorage.getItem('premiumSelections');
    if (savedSelections) {
      setSelectedOptions(JSON.parse(savedSelections));
    }
  }, []);

  const handleOptionChange = (option) => {
    const newSelections = {
      ...selectedOptions,
      [option]: !selectedOptions[option]
    };
    setSelectedOptions(newSelections);
    localStorage.setItem('premiumSelections', JSON.stringify(newSelections));
  };

  const handleNext = () => {
    if (step === 1) {
      setIsAnimating(true);
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 1;
        setProgress(currentProgress);
        if (currentProgress >= 40) {
          clearInterval(interval);
          setIsAnimating(false);
          setStep(2);
        }
      }, 15);
    } else if (step === 2) {
      setIsAnimating(true);
      let currentProgress = 40;
      const interval = setInterval(() => {
        currentProgress += 1;
        setProgress(currentProgress);
        if (currentProgress >= 50) {
          clearInterval(interval);
          setIsAnimating(false);
          setStep(3);
        }
      }, 15);
    } else if (step === 3) {
      setIsAnimating(true);
      let currentProgress = 50;
      const interval = setInterval(() => {
        currentProgress += 1;
        setProgress(currentProgress);
        if (currentProgress >= 60) {
          clearInterval(interval);
          setIsAnimating(false);
          setStep(4);
        }
      }, 15);
    } else if (step === 4) {
      setIsAnimating(true);
      let currentProgress = 60;
      const interval = setInterval(() => {
        currentProgress += 1;
        setProgress(currentProgress);
        if (currentProgress >= 80) {
          clearInterval(interval);
          setIsAnimating(false);
          setStep(5);
        }
      }, 15);
    } else if (step === 5) {
      setIsAnimating(true);
      let currentProgress = 80;
      const interval = setInterval(() => {
        currentProgress += 1;
        setProgress(currentProgress);
        if (currentProgress >= 90) {
          clearInterval(interval);
          setIsAnimating(false);
          setStep(6);
        }
      }, 15);
    } else {
      // Final step - handle submission
      console.log("Final selections:", selectedOptions);
      // Handle form submission or navigation
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setProgress(0);
    } else if (step === 3) {
      setStep(2);
      setProgress(40);
    } else if (step === 4) {
      setStep(3);
      setProgress(50);
    } else if (step === 5) {
      setStep(4);
      setProgress(60);
    } else if (step === 6) {
      setStep(5);
      setProgress(80);
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return false;
    if (step === 2) return !Object.values({
      profileViews: selectedOptions.profileViews,
      topApplicant: selectedOptions.topApplicant,
      resumeFeedback: selectedOptions.resumeFeedback,
      topChoice: selectedOptions.topChoice,
      recruiterContact: selectedOptions.recruiterContact,
      otherStep2: selectedOptions.otherStep2
    }).some(val => val);
    if (step === 3) return !Object.values({
      jobSearch: selectedOptions.jobSearch,
      professionalSkills: selectedOptions.professionalSkills,
      growNetwork: selectedOptions.growNetwork,
      findLeads: selectedOptions.findLeads,
      hireTalent: selectedOptions.hireTalent,
      otherStep3: selectedOptions.otherStep3
    }).some(val => val);
    if (step === 4) return !Object.values({
      careerGuidance: selectedOptions.careerGuidance,
      skillCourses: selectedOptions.skillCourses,
      certificates: selectedOptions.certificates,
      learningVideos: selectedOptions.learningVideos,
      dailyHabits: selectedOptions.dailyHabits,
      otherStep4: selectedOptions.otherStep4
    }).some(val => val);
    if (step === 5) return !Object.values({
      candidateRecommendations: selectedOptions.candidateRecommendations,
      talentSearch: selectedOptions.talentSearch,
      searchAlerts: selectedOptions.searchAlerts,
      inmailTemplates: selectedOptions.inmailTemplates,
      otherStep5: selectedOptions.otherStep5
    }).some(val => val);
    return false;
  };

  return (
    <div className="min-h-screen bg-mainBackground p-4 flex justify-center items-start">
      <div className="w-full max-w-[600px]">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {/* Header Section - Always visible */}
          <div className="mb-4 text-center">
            <h1 className="text-[24px] font-bold text-gray-900 mb-1 leading-[28px]">
              Achieve your goals faster with Premium.
            </h1>
            <p className="text-[14px] text-gray-600 mb-2">
              Millions of members use Premium
            </p>
            <p className="text-[12px] text-gray-800 mb-4">
              Claim your 1-month free trial today. Cancel anytime. We'll send you a reminder 7 days before your trial ends.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Progress Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[12px] text-gray-600">Plan recommendation</span>
              <span className="text-[12px] font-medium text-gray-900">{progress}%</span>
            </div>
            <div className="h-[3px] bg-gray-200 rounded-full w-full">
              <div 
                className="h-[3px] bg-blue-500 rounded-full transition-all duration-200" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Options Section */}
          <div className="mt-6">
            {step === 1 ? (
              <>
                <h3 className="text-[16px] font-semibold text-gray-900 mb-1">
                  {firstName}, which of these best describes your primary goal for using Premium?
                </h3>
                <p className="text-[14px] text-gray-800 mb-4">
                  We'll recommend the right plan for you.
                </p>

                <div className="space-y-2 mb-6">
                  <div 
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedOptions.personal ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                    onClick={() => handleOptionChange('personal')}
                  >
                    <div className="flex items-center">
                      <div className={`mr-2 h-4 w-4 rounded border ${selectedOptions.personal ? 'bg-green-500 border-green-500 flex items-center justify-center' : 'bg-white border-gray-300'}`}>
                        {selectedOptions.personal && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <label className="text-[14px] text-gray-900 font-medium">
                        I'd use Premium for my personal goals
                      </label>
                    </div>
                  </div>

                  <div 
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedOptions.job ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                    onClick={() => handleOptionChange('job')}
                  >
                    <div className="flex items-center">
                      <div className={`mr-2 h-4 w-4 rounded border ${selectedOptions.job ? 'bg-green-500 border-green-500 flex items-center justify-center' : 'bg-white border-gray-300'}`}>
                        {selectedOptions.job && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <label className="text-[14px] text-gray-900 font-medium">
                        I'd use Premium as part of my job
                      </label>
                    </div>
                  </div>

                  <div 
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedOptions.other ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                    onClick={() => handleOptionChange('other')}
                  >
                    <div className="flex items-center">
                      <div className={`mr-2 h-4 w-4 rounded border ${selectedOptions.other ? 'bg-green-500 border-green-500 flex items-center justify-center' : 'bg-white border-gray-300'}`}>
                        {selectedOptions.other && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <label className="text-[14px] text-gray-900 font-medium">
                        Other
                      </label>
                    </div>
                  </div>
                </div>
              </>
            ) : step === 2 ? (
              <>
                <h3 className="text-[16px] font-semibold text-gray-900 mb-1">
                  You're 2.6x more likely to get hired with Premium. What's key to your job search?
                </h3>
                <p className="text-[14px] text-gray-800 mb-4">
                  We'll recommend the right plan for you.
                </p>

                <div className="space-y-2 mb-6">
                  {[
                    { id: 'profileViews', label: "See who's viewed my profile" },
                    { id: 'topApplicant', label: "See jobs where I'm a top applicant" },
                    { id: 'resumeFeedback', label: "Get tailored resume feedback and tips" },
                    { id: 'topChoice', label: "Let employers know their job is my top choice" },
                    { id: 'recruiterContact', label: "Make it easier for recruiters to contact me" },
                    { id: 'otherStep2', label: "Other" }
                  ].map((option) => (
                    <div 
                      key={option.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${selectedOptions[option.id] ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                      onClick={() => handleOptionChange(option.id)}
                    >
                      <div className="flex items-center">
                        <div className={`mr-3 flex items-center justify-center h-5 w-5 rounded border-2 ${selectedOptions[option.id] ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white'}`}>
                          {selectedOptions[option.id] && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <label className="text-[14px] text-gray-900 font-medium">
                          {option.label}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : step === 3 ? (
              <>
                <h3 className="text-[16px] font-semibold text-gray-900 mb-1">
                  {firstName}, how would you like Premium to help?
                </h3>
                <p className="text-[14px] text-gray-800 mb-4">
                  We'll recommend the right plan for you.
                </p>
                <p className="text-[12px] text-gray-600 mb-2 font-medium">Required</p>

                <div className="space-y-2 mb-6">
                  {[
                    { id: 'jobSearch', label: "To job search with confidence and get hired" },
                    { id: 'professionalSkills', label: "To develop my professional skills" },
                    { id: 'growNetwork', label: "To grow my network, business, or reputation" },
                    { id: 'findLeads', label: "To find and contact new leads" },
                    { id: 'hireTalent', label: "To find and hire talent faster" },
                    { id: 'otherStep3', label: "Other" }
                  ].map((option) => (
                    <div 
                      key={option.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${selectedOptions[option.id] ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                      onClick={() => handleOptionChange(option.id)}
                    >
                      <div className="flex items-center">
                        <div className={`mr-3 flex items-center justify-center h-5 w-5 rounded border-2 ${selectedOptions[option.id] ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white'}`}>
                          {selectedOptions[option.id] && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <label className="text-[14px] text-gray-900 font-medium">
                          {option.label}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : step === 4 ? (
              <>
                <h3 className="text-[16px] font-semibold text-gray-900 mb-1">
                  What is most important for you in developing your skills?
                </h3>
                <p className="text-[14px] text-gray-800 mb-4">
                  We'll recommend the right plan for you.
                </p>
                <p className="text-[12px] text-gray-600 mb-2 font-medium">Required</p>

                <div className="space-y-2 mb-6">
                  {[
                    { id: 'careerGuidance', label: "Get personalized career guidance and insights" },
                    { id: 'skillCourses', label: "Grow my skills with 21,000+ courses" },
                    { id: 'certificates', label: "Earn and showcase professional certificates" },
                    { id: 'learningVideos', label: "Learn from bite‐sized or in‐depth videos" },
                    { id: 'dailyHabits', label: "Build daily learning habits" },
                    { id: 'otherStep4', label: "Other" }
                  ].map((option) => (
                    <div 
                      key={option.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${selectedOptions[option.id] ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                      onClick={() => handleOptionChange(option.id)}
                    >
                      <div className="flex items-center">
                        <div className={`mr-3 flex items-center justify-center h-5 w-5 rounded border-2 ${selectedOptions[option.id] ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white'}`}>
                          {selectedOptions[option.id] && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <label className="text-[14px] text-gray-900 font-medium">
                          {option.label}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : step === 5 ? (
              <>
                <h3 className="text-[16px] font-semibold text-gray-900 mb-1">
                  Reach up to 3.4x more candidates with Recruiter Lite. What are your top hiring goals?
                </h3>
                <p className="text-[14px] text-gray-800 mb-4">
                  We'll recommend the right plan for you.
                </p>
                <p className="text-[12px] text-gray-600 mb-2 font-medium">Required</p>

                <div className="space-y-2 mb-6">
                  {[
                    { id: 'candidateRecommendations', label: "Receive tailored candidate recommendations" },
                    { id: 'talentSearch', label: "Search for top talent with 20+ filters" },
                    { id: 'searchAlerts', label: "Get automated search alerts to find qualified candidates" },
                    { id: 'inmailTemplates', label: "Streamline outreach with InMail templates" },
                    { id: 'otherStep5', label: "Other" }
                  ].map((option) => (
                    <div 
                      key={option.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${selectedOptions[option.id] ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                      onClick={() => handleOptionChange(option.id)}
                    >
                      <div className="flex items-center">
                        <div className={`mr-3 flex items-center justify-center h-5 w-5 rounded border-2 ${selectedOptions[option.id] ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white'}`}>
                          {selectedOptions[option.id] && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <label className="text-[14px] text-gray-900 font-medium">
                          {option.label}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              // Final Step (Step 6)
              <>
                <div className="text-center mb-6">
                  <h3 className="text-[20px] font-bold text-gray-900 mb-2">Premium Plan Recommendation</h3>
                  <p className="text-[14px] text-gray-600 mb-4">Based on your selections, we recommend:</p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                    <h4 className="text-[18px] font-semibold text-blue-800 mb-2">LinkedIn Premium Career</h4>
                    <p className="text-[14px] text-gray-700">Best for job seekers and career growth</p>
                  </div>

                  <div className="border-t border-gray-200 my-4"></div>

                  <div className="text-left mb-6">
                    <p className="text-[16px] font-medium text-gray-900 mb-2">
                      Price: <span className="line-through">EGP5,499.99</span>* 1-month free trial
                    </p>
                    <p className="text-[14px] text-gray-700 mb-4">
                      After your free month, pay as little as <span className="line-through">EGP5,499.99</span> EGP4,599.00* / month (save 16%) when billed annually. Cancel anytime. We'll remind you 7 days before your trial ends.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-colors text-[16px]"
                  >
                    Start free trial
                  </button>
                  <p className="text-[12px] text-gray-500 mt-2">Secure checkout</p>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            {step < 6 && (
              <div className="flex justify-between">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="py-2 px-4 font-medium rounded-full transition-colors text-[14px] text-gray-700 hover:bg-gray-100"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={isNextDisabled() || isAnimating}
                  className={`py-2 px-4 font-medium rounded-full transition-colors text-[14px] ml-auto ${
                    isNextDisabled() || isAnimating
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                    Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPlan;