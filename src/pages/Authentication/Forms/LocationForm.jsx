import React, { useState } from "react";
import BlueSubmitButton from "../GenericComponents//BlueSubmitButton";
import InputField from "../GenericComponents//InputField";
import { useSelector } from "react-redux";

const LocationForm = ({ onSubmit }) => {
  const [location, setLocation] = useState("");
  const [locationError, setLocationError] = useState("");
  const { firstName } = useSelector((state) => state.authentication);

  const handleChange = (e) => {
    setLocation(e.target.value);
    if (locationError) {
      setLocationError("");
    }
  };

  const handleLocationBlur = () => {
    if (!location) {
      setLocationError("Please enter your location.");
    } else {
      setLocationError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location) {
      setLocationError("Please enter your location.");
      return;
    }
    onSubmit(location);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-3xl font-semibold mb-4 text-textContent text-center">
        Welcome, {firstName}! What's your location?
      </h1>
      <p className="text-xl text-textContent text-center mb-10">
        See people, jobs, and news in your area.
      </p>
      <InputField
        type="text"
        id="location"
        name="location"
        labelText="Location *"
        value={location}
        onChange={handleChange}
        onBlur={handleLocationBlur}
        placeholder="City or State"
        required
        error={locationError}
      />
      <BlueSubmitButton text="Next" />
    </form>
  );
};

export default LocationForm;
