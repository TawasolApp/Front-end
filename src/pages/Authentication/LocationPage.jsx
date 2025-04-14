import React from "react";
import LocationForm from "./Forms/LocationForm";
import { useNavigate } from "react-router-dom";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";
import { useDispatch } from "react-redux";
import { setLocation } from "../../store/authenticationSlice";
import { toast } from "react-toastify";

const LocationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (location) => {
    if (!location) {
      console.error("Error: Missing location.");
      toast.error("Please enter your current location.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    dispatch(setLocation(location));

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
