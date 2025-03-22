import React from 'react';
import LocationForm from './components/LocationForm';

const LocationPage = () => {
  const handleSubmit = (location) => {
    console.log('Location:', location);
  };

  return (
    <div className="min-h-screen flex items-start pt-20 justify-center bg-white">
      <div className="bg-white p-10 rounded-lg w-full max-w-xl">
        <LocationForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default LocationPage;