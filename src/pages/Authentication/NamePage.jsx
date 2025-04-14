import React, { useState } from "react";
import NameForm from "./Forms/NameForm";
import { useDispatch, useSelector } from "react-redux";
import { setFirstName, setLastName } from "../../store/authenticationSlice";
import { axiosInstance } from "../../apis/axios";
import { useNavigate } from "react-router-dom";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";

const NamePage = () => {
  const dispatch = useDispatch();
  const { email, password, isNewGoogleUser } = useSelector(
    (state) => state.authentication,
  );
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleName = async (formData, captchaToken) => {
    if ((!email || !password) && !isNewGoogleUser) {
      console.error("Error: Missing email or password. Please sign up again.");
      return;
    }

    dispatch(setFirstName(formData.firstName));
    dispatch(setLastName(formData.lastName));

    // New Google user, account already exists, just navigate to next page
    if (isNewGoogleUser) {
      navigate("/auth/signup/location");

      return;
    }

    try {
      setIsLoading(true);
      await axiosInstance.post("/auth/register", {
        email,
        password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        captchaToken: "test-token",
      });

      setIsLoading(false);
      navigate("/auth/verification-pending", {
        state: { type: "verifyEmail" },
      });
    } catch (error) {
      setIsLoading(false);
      console.error(
        `Registration Failed: ${error.response?.data?.message || error.message}`,
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-mainBackground px-4 sm:px-8 md:px-12 lg:px-24 overflow-x-hidden">
      <AuthenticationHeader hideButtons={true} />

      <h1 className="text-4xl md:text-5xl font-normal mb-8 text-textHeavyTitle text-center max-w-screen-lg">
        Make the most of your professional life
      </h1>
      <div className="bg-cardBackground p-10 rounded-lg shadow-lg w-full max-w-lg min-w-[350px]">
        <NameForm onSubmit={handleName} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default NamePage;
