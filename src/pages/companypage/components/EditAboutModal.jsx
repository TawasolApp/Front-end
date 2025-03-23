import React, { useEffect, useState } from "react";
import axios from "axios";

function EditAboutModal({ show, companyData, onClose }) {
  const [formData, setFormData] = useState({
    logo: "",
    banner: "",
    description: "",
    overview: "",
    industry: "",
    address: "",
    website: "",
    phoneNumber: "",
    verified: false,
    verification_date: "",
    founded: "",
    specialities: "",
    location: "",
  });
  useEffect(() => {
    if (show && companyData) {
      setFormData({
        logo: companyData.logo || "",
        banner: companyData.banner || "",
        description: companyData.description || "",
        overview: companyData.overview || "",
        industry: companyData.industry || "",
        address: companyData.address || "",
        website: companyData.website || "",
        phoneNumber: companyData.phoneNumber || "",
        verified: companyData.verified || false,
        verification_date: companyData.verification_date || "",
        founded: companyData.founded || "",
        specialities: companyData.specialities || "",
        location: companyData.location || "",
      });
    }
  }, [show, companyData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/companies/${companyData.companyId}`,
        formData
      );
      console.log(" Company updated:", response.data);

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  useEffect(() => {
    if (show) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [show]);

  if (!show) return null; // Hide modal if not visible

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200/60 z-[999]">
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-3xl relative flex flex-col h-[80vh]">
        {/* Sticky Header */}
        <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10 rounded-lg">
          <h2 className="text-2xl font-semibold">Edit Company Profile</h2>
          <button
            className="text-gray-600 text-xl font-bold hover:text-gray-900 transition"
            onClick={onClose}
          >
            ✖
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-4 flex-1">
          {/* Company Banner */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700">Banner</label>
            <div className="w-full h-32 border border-gray-300 overflow-hidden">
              <img
                src={formData.banner || "https://via.placeholder.com/600x200"}
                alt="Company Banner"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="text"
              name="banner"
              className="mt-2 p-2 border rounded-md w-full"
              value={formData.banner}
              onChange={handleChange}
              placeholder="Enter new banner URL"
            />
          </div>
          {/* Company Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full border border-gray-300 overflow-hidden">
              <img
                src={formData.logo || "https://via.placeholder.com/100"}
                alt="Company Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="text"
              name="logo"
              className="mt-2 p-2 border rounded-md w-full"
              value={formData.logo}
              onChange={handleChange}
              placeholder="Enter new logo URL"
            />
          </div>
          {/* Overview */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Overview</label>
            <textarea
              name="overview"
              className="w-full p-2 border rounded-md"
              value={formData.overview}
              onChange={handleChange}
            />
          </div>
          {/* Description */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              className="w-full p-2 border rounded-md"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Industry */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Industry</label>
            <input
              type="text"
              name="industry"
              className="w-full p-2 border rounded-md"
              value={formData.industry}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="address"
              className="w-full p-2 border rounded-md"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          {/* Website */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Website</label>
            <input
              type="text"
              name="website"
              className="w-full p-2 border rounded-md"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phoneNumber"
              className="w-full p-2 border rounded-md"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          {/* Verification */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="verified"
              checked={formData.verified}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="font-medium text-gray-700">Verified Page</label>
          </div>

          {/* Verification Date */}
          {formData.verified && (
            <div className="mb-4">
              <label className="block font-medium text-gray-700">
                Verification Date
              </label>
              <input
                type="text"
                name="verification_date"
                className="w-full p-2 border rounded-md"
                value={formData.verification_date}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Founded Year */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Founded</label>
            <input
              type="text"
              name="founded"
              className="w-full p-2 border rounded-md"
              value={formData.founded}
              onChange={handleChange}
            />
          </div>

          {/* Specialities */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700">
              Specialities
            </label>
            <textarea
              name="specialities"
              className="w-full p-2 border rounded-md"
              value={formData.specialities}
              onChange={handleChange}
            />
          </div>

          {/* Maps Location */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700">
              Google Maps Location
            </label>
            <input
              type="text"
              name="location"
              className="w-full p-2 border rounded-md"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* Save Button */}
        <div className="p-4 border-t flex justify-end bg-white sticky bottom-0 rounded-lg">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 transition"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditAboutModal;
