import React from "react";
import LocationForm from "./Forms/LocationForm";
import { useNavigate } from "react-router-dom";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";

const LocationPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (location) => {
    navigate("/auth/signup/experience");
  };

  return (
    <div className="min-h-screen flex items-start pt-20 justify-center bg-mainBackground overflow-x-hidden">
      <AuthenticationHeader hideButtons={true} />

      <div className="bg-cardBackground p-10 rounded-lg w-full max-w-xl shadow-lg">
        <LocationForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default LocationPage;
