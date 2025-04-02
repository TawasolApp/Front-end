import React from "react";
import ExperienceForm from "./Forms/ExperienceForm";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../apis/axios";

const ExperienceAuthPage = () => {
  const { firstName, lastName, location } = useSelector(
    (state) => state.authentication
  );

  const handleSubmit = async (experienceData) => {
    let profileData = {
      firstName,
      lastName,
      location,
    };

    if (experienceData.isStudent) {
      profileData.education = [
        {
          school: experienceData.school,
          startDate: experienceData.startDate,
          endDate: experienceData.endDate,
        },
      ];
    } else {
      profileData.workExperience = [
        {
          title: experienceData.title,
          employmentType: experienceData.employmentType,
          company: experienceData.company,
          startDate: experienceData.startDate,
        },
      ];
    }

    try {
      const response = await axiosInstance.post(
        "/profile",
        profileData,
      );

      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }

    // TODO: login request,
    // then request user profile and store it in states
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 md:pt-32 justify-start bg-mainBackground px-4 sm:px-6 overflow-x-hidden">
      <AuthenticationHeader hideButtons={true} />

      <div className="w-full max-w-3xl text-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-textHeavyTitle">
          Your profile helps you discover new people and opportunities
        </h1>
      </div>
      <div className="bg-cardBackground p-6 sm:p-8 md:p-10 rounded-lg w-full max-w-md sm:max-w-xl">
        <ExperienceForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ExperienceAuthPage;
