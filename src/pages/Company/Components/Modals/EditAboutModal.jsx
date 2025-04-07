import React, { useEffect, useState } from "react";
import { axiosInstance as axios } from "../../../../apis/axios";
import { FiUpload } from "react-icons/fi";

function EditAboutModal({ show, companyData, onClose }) {
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    banner: "",
    description: "",
    overview: "",
    industry: "",
    address: "",
    website: "",
    contactNumber: "",
    isVerified: false,
    founded: "",
    email: "",
    location: "",
    companyType: "",
    companySize: "",
  });
  useEffect(() => {
    if (show && companyData) {
      setFormData({
        name: companyData.name,
        logo: companyData.logo || "",
        banner: companyData.banner || "",
        description: companyData.description || "",
        overview: companyData.overview || "",
        industry: companyData.industry || "",
        address: companyData.address || "",
        website: companyData.website || "",
        contactNumber: companyData.contactNumber || "",
        isVerified: companyData.isVerified || false,
        founded: companyData.founded || "",
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
      const payload = {};

      // Compare each field and only add it to payload if it's changed and valid
      for (const key in formData) {
        const originalValue = companyData[key] ?? "";
        const currentValue = formData[key];

        if (key === "founded") {
          const parsed = parseInt(currentValue);
          if (
            currentValue &&
            parsed !== companyData.founded &&
            !isNaN(parsed) &&
            parsed >= 1800 &&
            parsed <= new Date().getFullYear()
          ) {
            payload.founded = parsed;
          }
          continue;
        }

        if (key === "location") {
          const isValidLocation =
            currentValue?.trim() && /^https?:\/\/.+/.test(currentValue.trim());
          if (
            isValidLocation &&
            currentValue.trim() !== (originalValue?.trim() || "")
          ) {
            payload.location = currentValue.trim();
          }
          continue;
        }

        // Skip unchanged values (including booleans like isVerified)
        if (key === "isVerified") {
          if (!!currentValue !== !!originalValue) {
            payload.isVerified = !!currentValue;
          }
          continue;
        }

        // Default string fields
        if (
          typeof currentValue === "string" &&
          currentValue.trim() !== (originalValue?.trim() || "")
        ) {
          payload[key] = currentValue.trim();
        }
      }

      if (Object.keys(payload).length === 0) {
        setErrorMessage("No changes to save.");
        return;
      }

      const response = await axios.patch(
        `/companies/${companyData.companyId}`,
        payload
      );

      console.log("Company updated:", response.data);
      onClose();
      window.location.reload();
    } catch (error) {
      const backendMessage = error.response?.data?.message;
      console.error("Error updating company:", error);
      setErrorMessage(
        Array.isArray(backendMessage)
          ? backendMessage.join(", ")
          : backendMessage || "Failed to update company profile."
      );
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const uploadResponse = await axios.post(
        "/api/uploadImage",
        formDataUpload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const fileUrl = uploadResponse.data;

      setFormData((prev) => ({
        ...prev,
        [type]: fileUrl,
      }));

      if (type === "logo") setLogoFile(file);
      if (type === "banner") setBannerFile(file);
    } catch (error) {
      console.error("Upload failed:", error);
      setErrorMessage(`Failed to upload ${type}. Please try again.`);
    }
  };

  useEffect(() => {
    if (show) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-modalbackground z-[999] flex justify-center items-center px-4">
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
          {/* Company Banner Upload*/}
          <div className="mb-6">
            <label className="block font-medium text-normaltext mb-1">
              Banner
            </label>

            {/* Preview */}
            <div className="w-full h-32 border border-gray-300 overflow-hidden mb-2">
              <img
                src={formData.banner || "https://via.placeholder.com/600x200"}
                alt="Company Banner"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Upload box */}
            <div className="w-[300px] min-h-[80px] border border-gray-400 rounded-md bg-uploadimage relative flex flex-col items-center justify-center px-4 py-3 text-center mx-auto">
              <div className="flex flex-col items-center justify-center gap-1 text-gray-600">
                <FiUpload className="text-xl text-normaltext" />
                <p className="text-sm text-normaltext font-medium">
                  Upload Banner
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleFileUpload(e, "banner")}
              />
            </div>
          </div>

          {/* Company Logo Upload */}
          <div className="mb-6 flex flex-col items-center">
            {/* Preview image */}
            <div className="w-24 h-24 rounded-full border border-gray-300 overflow-hidden mb-2">
              <img
                src={formData.logo || "https://via.placeholder.com/100"}
                alt="Logo Preview"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Upload Box (smaller width) */}
            <div className="w-[200px] min-h-[80px] border border-gray-400 rounded-md bg-uploadimage relative flex flex-col items-center justify-center px-4 py-3 text-center">
              <div className="flex flex-col items-center justify-center gap-1 text-gray-600">
                <FiUpload className="text-xl text-normaltext" />
                <p className="text-sm text-normaltext font-medium">
                  Upload Logo
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleFileUpload(e, "logo")}
              />
            </div>
          </div>
          {/* Overview */}
          <div className="mb-4">
            <label className="block font-medium text-normaltext">
              Overview
            </label>
            <textarea
              name="overview"
              className="w-full p-2 border rounded-md bg-boxbackground text-normaltext"
              value={formData.overview}
              onChange={handleChange}
            />
          </div>
          {/* Description */}
          <div className="mb-4">
            <label className="block font-medium text-normaltext">
              Description
            </label>
            <textarea
              name="description"
              className="w-full p-2 border rounded-md bg-boxbackground text-normaltext"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Industry */}
          <div className="mb-4">
            <label className="block font-medium text-normaltext">
              Industry
            </label>
            <input
              type="text"
              name="industry"
              className="w-full p-2 border rounded-md bg-boxbackground text-normaltext"
              value={formData.industry}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block font-medium text-normaltext">Address</label>
            <input
              type="text"
              name="address"
              className="w-full p-2 border rounded-md bg-boxbackground text-normaltext"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          {/* Website */}
          <div className="mb-4">
            <label className="block font-medium text-normaltext">Website</label>
            <input
              type="text"
              name="website"
              className="w-full p-2 border rounded-md bg-boxbackground text-normaltext"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
          {/* Phone Number */}
          <div className="mb-4">
            <label className="block font-medium text-normaltext">Phone</label>
            <input
              type="text"
              name="contactNumber"
              className="w-full p-2 border rounded-md bg-boxbackground text-normaltext"
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
            <label className="font-medium text-normaltext">Verified Page</label>
          </div>
          {/* Email */}
          <div className="mb-4">
            <label className="block font-medium text-normaltext">Email</label>
            <input
              type="text"
              name="email"
              className="w-full p-2 border rounded-md bg-boxbackground text-normaltext"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {/* Founded Year */}
          <div className="mb-4">
            <label className="block font-medium text-normaltext">Founded</label>
            <input
              type="text"
              name="founded"
              className="w-full p-2 border rounded-md bg-boxbackground text-normaltext"
              value={formData.founded}
              onChange={handleChange}
            />
          </div>
          {/* companySize */}
          <div className="mb-4">
            <label className="block font-medium text-normaltext">
              Company Size
            </label>
            <select
              name="companySize"
              className="w-full p-2 border rounded-md bg-boxbackground text-normaltext"
              value={formData.companySize}
              onChange={handleChange}
            >
              <option value="">Select size</option>
              <option value="1-50 Employees">1-50 Employees</option>
              <option value="51-400 Employees">51-400 Employees</option>
              <option value="401-1000 Employees">401-1000 Employees</option>
              <option value="1001-10000 Employees">1001-10000 Employees</option>
              <option value="10000 Employees">10000+ Employees</option>
            </select>
          </div>

          {/* companyType */}
          <div className="mb-4">
            <label className="block font-medium text-normaltext">
              Company Type
            </label>
            <select
              name="companyType"
              className="w-full p-2 border rounded-md bg-boxbackground text-normaltext"
              value={formData.companyType}
              onChange={handleChange}
            >
              <option value="">Select type</option>
              <option value="Public Company">Public Company</option>
              <option value="Self Employed">Self Employed</option>
              <option value="Government Agency">Government Agency</option>
              <option value="Non Profit">Non Profit</option>
              <option value="Sole Proprietorship">Sole Proprietorship</option>
              <option value="Privately Held">Privately Held</option>
              <option value="Partnership">Partnership</option>
            </select>
          </div>

          {/* Maps Location */}
          <div className="mb-4">
            <label className="block font-medium text-normaltext">
              Google Maps Location
            </label>
            <input
              type="text"
              name="location"
              className="w-full p-2 border rounded-md bg-boxbackground text-normaltext"
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
