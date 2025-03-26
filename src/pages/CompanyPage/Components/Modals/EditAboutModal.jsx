import React, { useEffect, useState } from "react";
import { axiosInstance as axios } from "../../../../apis/axios";

function EditAboutModal({ show, companyData, onClose }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    logo: "",
    banner: "",
    description: "",
    overview: "",
    industry: "",
    address: "",
    website: "",
    contactNumber: "",
    isVerified: false,
    verification_date: "",
    founded: "",
    specialities: "",
    email: "",
    location: "",
    companyType: "",
    companySize: "",
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
        contactNumber: companyData.contactNumber || "",
        isVerified: companyData.isVerified || false,
        verification_date: companyData.verification_date || "",
        founded: companyData.founded || "",
        specialities: companyData.specialities || "",
        location: companyData.location || "",
        email: companyData.email || "",
        companyType: companyData.companyType || "",
        companySize: companyData.companySize || "",
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
        `/companies/${companyData.companyId}`,
        formData
      );
      console.log(" Company updated:", response.data);

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating company:", error);
      setErrorMessage("Failed to update company profile.");
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

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-modalbackground z-[999]">
      <div className="bg-boxbackground rounded-lg shadow-xl w-[90%] max-w-3xl relative flex flex-col h-[80vh]">
        {/* Sticky Header */}
        <div className="p-4 flex justify-between items-center bg-boxbackground sticky top-0 z-10 rounded-lg">
          <h2 className="text-2xl font-semibold text-text">
            Edit Company Profile
          </h2>
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
            <label className="block font-medium text-text2">Banner</label>
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
              className="mt-2 p-2 border rounded-md w-full bg-boxbackground text-text2"
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
              className="mt-2 p-2 border rounded-md w-full bg-boxbackground text-text2"
              value={formData.logo}
              onChange={handleChange}
              placeholder="Enter new logo URL"
            />
          </div>
          {/* Overview */}
          <div className="mb-4">
            <label className="block font-medium text-text2">Overview</label>
            <textarea
              name="overview"
              className="w-full p-2 border rounded-md bg-boxbackground text-text2"
              value={formData.overview}
              onChange={handleChange}
            />
          </div>
          {/* Description */}
          <div className="mb-4">
            <label className="block font-medium text-text2">Description</label>
            <textarea
              name="description"
              className="w-full p-2 border rounded-md bg-boxbackground text-text2"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Industry */}
          <div className="mb-4">
            <label className="block font-medium text-text2">Industry</label>
            <input
              type="text"
              name="industry"
              className="w-full p-2 border rounded-md bg-boxbackground text-text2"
              value={formData.industry}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block font-medium text-text2">Location</label>
            <input
              type="text"
              name="address"
              className="w-full p-2 border rounded-md bg-boxbackground text-text2"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          {/* Website */}
          <div className="mb-4">
            <label className="block font-medium text-text2">Website</label>
            <input
              type="text"
              name="website"
              className="w-full p-2 border rounded-md bg-boxbackground text-text2"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
          {/* Phone Number */}
          <div className="mb-4">
            <label className="block font-medium text-text2">Phone</label>
            <input
              type="text"
              name="contactNumber"
              className="w-full p-2 border rounded-md bg-boxbackground text-text2"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </div>

          {/* Verification */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="isVerified"
              aria-label="Verified Page"
              checked={formData.isVerified}
              onChange={handleChange}
              className="mr-2 "
            />
            <label className="font-medium text-text2">Verified Page</label>
          </div>

          {/* Verification Date */}
          {formData.isVerified && (
            <div className="mb-4">
              <label className="block font-medium text-text2 bg-boxbackground">
                Verification Date
              </label>
              <input
                type="text"
                name="verification_date"
                className="w-full p-2 border rounded-md bg-boxbackground text-text2"
                value={formData.verification_date}
                onChange={handleChange}
              />
            </div>
          )}
          {/* Email */}
          <div className="mb-4">
            <label className="block font-medium text-text2">Email</label>
            <input
              type="text"
              name="email"
              className="w-full p-2 border rounded-md bg-boxbackground text-text2"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {/* Founded Year */}
          <div className="mb-4">
            <label className="block font-medium text-text2">Founded</label>
            <input
              type="text"
              name="founded"
              className="w-full p-2 border rounded-md bg-boxbackground text-text2"
              value={formData.founded}
              onChange={handleChange}
            />
          </div>
          {/* companySize */}
          <div className="mb-4">
            <label className="block font-medium text-text2">Company Size</label>
            <input
              type="text"
              name="companySize"
              className="w-full p-2 border rounded-md bg-boxbackground text-text2"
              value={formData.companySize}
              onChange={handleChange}
            />
          </div>
          {/* companyType */}
          <div className="mb-4">
            <label className="block font-medium text-text2">Company Type</label>
            <input
              type="text"
              name="companyType"
              className="w-full p-2 border rounded-md bg-boxbackground text-text2"
              value={formData.companyType}
              onChange={handleChange}
            />
          </div>
          {/* Specialities */}
          <div className="mb-4">
            <label className="block font-medium text-text2">Specialities</label>
            <textarea
              name="specialities"
              className="w-full p-2 border rounded-md bg-boxbackground text-text2"
              value={formData.specialities}
              onChange={handleChange}
            />
          </div>

          {/* Maps Location */}
          <div className="mb-4">
            <label className="block font-medium text-text2">
              Google Maps Location
            </label>
            <input
              type="text"
              name="location"
              className="w-full p-2 border rounded-md bg-boxbackground text-text2"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
        </div>
        {errorMessage && (
          <p
            className="text-red-500 text-sm text-center mb-2"
            data-testid="error-message"
          >
            {errorMessage}
          </p>
        )}

        {/* Save Button */}
        <div className="p-4 flex justify-end bg-boxbackground sticky bottom-0 rounded-lg">
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
