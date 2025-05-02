import React, { useEffect } from "react";
import WelcomeForm from "./Forms/WelcomeForm";
import WelcomeImage from "../../assets/images/WelcomeImage.jpeg";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authenticationSlice";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.authentication);

  useEffect(() => {
    if (token) {
      navigate("/feed");
      return;
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-mainBackground overflow-x-hidden">
      <AuthenticationHeader />

      {/* Mobile & Tablet: Single Column */}
      <div className="block lg:hidden">
        <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal text-textHeavyTitle mb-6 sm:mb-8 text-center leading-snug">
            Welcome to your professional community
          </h1>
          <img
            src={WelcomeImage}
            alt="Welcome to Tawasol"
            className="w-4/5 max-w-xs sm:max-w-sm md:max-w-md rounded-full mb-6 sm:mb-8 shadow-md darken"
          />
          <div className="w-full max-w-sm sm:max-w-md">
            <WelcomeForm />
          </div>
        </div>
      </div>

      {/* Desktop: Two Columns */}
      <div className="hidden lg:flex min-h-screen items-start justify-center px-10 xl:px-16 pt-10 pb-16">
        {/* Left Column - Content */}
        <div className="flex-1 max-w-xl mr-10 py-10">
          <h1 className="text-4xl xl:text-5xl font-normal text-textHeavyTitle mb-10 leading-tight">
            Welcome to your professional community
          </h1>
          <div className="max-w-md">
            <WelcomeForm />
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="flex-1 max-w-xl">
          <img
            src={WelcomeImage}
            alt="Welcome to Tawasol"
            className="w-full rounded-full shadow-xl darken max-h-[500px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;