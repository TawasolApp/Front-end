import React, { useState } from "react";
import BlueSubmitButton from "./BlueSubmitButton";
import InputField from "./InputField";

const LocationForm = ({ onSubmit }) => {
  const [location, setLocation] = useState("");

  const [locationError, setLocationError] = useState("");

  const handleChange = (e) => {
    setLocation(e.target.value);
    if (locationError) {
      setLocationError("");
    }
  };

  const handleLocationBlur = () => {
    if (!location) {
      setLocationError('Please enter your location.');
    } else {
      setLocationError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location) {
      alert("Please enter your location");
      return;
    }
    onSubmit(location);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-3xl font-semibold mb-4 text-gray-800 text-center">
        Welcome, Jo! What's your location?
      </h1>
      <p className="text-xl text-gray-700 text-center mb-10">
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
