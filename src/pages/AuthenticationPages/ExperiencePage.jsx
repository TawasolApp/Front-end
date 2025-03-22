import React from "react";
import ExperienceForm from "./components/ExperienceForm";

const ExperiencePage = () => {
  const handleSubmit = (experienceData) => {
    console.log("Experience Data:", experienceData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-32 justify-start bg-white">
      <div className="w-full max-w-3xl text-center mb-2">
        <h1 className="text-3xl font-semibold text-gray-800">
          Your profile helps you discover new people and opportunities
        </h1>
      </div>
      <div className="bg-white p-10 rounded-lg w-full max-w-xl">
        <ExperienceForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ExperiencePage;