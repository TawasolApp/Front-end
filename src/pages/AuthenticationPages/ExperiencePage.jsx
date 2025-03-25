import React from "react";
import ExperienceForm from "./components/ExperienceForm";

const ExperiencePage = () => {
  const handleSubmit = (experienceData) => {
    console.log("Experience Data:", experienceData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 md:pt-32 justify-start bg-white px-4 sm:px-6">
      <div className="w-full max-w-3xl text-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800">
          Your profile helps you discover new people and opportunities
        </h1>
      </div>
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg w-full max-w-md sm:max-w-xl">
        <ExperienceForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ExperiencePage;