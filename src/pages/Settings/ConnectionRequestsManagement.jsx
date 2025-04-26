import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { axiosInstance as axios } from "../../apis/axios";
import { toast } from "react-toastify";

const CONNECTION_OPTIONS = [
  {
    value: "everyone",
    label: "Everyone on Tawasol",
    description: "Anyone can send you a connection request (Recommended)",
  },
  {
    value: "email_or_contacts",
    label: "Email or Imported Contacts",
    description:
      "Only people who know your email or are in your imported contacts",
  },
  {
    value: "contacts_only",
    label: "Imported Contacts Only",
    description: "Only people from your imported contacts can connect with you",
  },
];

const ConnectionRequestsManagement = () => {
  const navigate = useNavigate();
  const [savedOption, setSavedOption] = useState(null);
  const [currentOption, setCurrentOption] = useState(null);
  const [saving, setSaving] = useState(false);

  // useEffect(() => {
  //   const fetchConnectionSetting = async () => {
  //     try {
  //       const res = await axios.get("/privacy/connection-setting");
  //       const normalized = (res.data?.toLowerCase?.() || "everyone").trim();
  //       setSavedOption(normalized);
  //       setCurrentOption(normalized);
  //     } catch (error) {
  //       console.error("Error fetching connection setting", error);
  //     }
  //   };

  //   fetchConnectionSetting();
  // }, []);
  useEffect(() => {
    // Mock the initial state manually until API is ready
    const value = "contacts_only"; // pretend the saved value is this
    setSavedOption(value);
    setCurrentOption(value);
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.patch("/privacy/connection-setting", {
        value: currentOption,
      });
      toast.success("Connection preference updated");
      setSavedOption(currentOption);
    } catch (error) {
      toast.error("Failed to update connection setting");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const isModified =
    savedOption !== null &&
    currentOption !== null &&
    savedOption !== currentOption;

  return (
    <div className="min-h-screen p-6 bg-mainBackground">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack className="text-textContent" />
          </IconButton>
          <h1 className="text-2xl font-bold text-header">
            Invitations to connect
          </h1>
        </div>

        {/* Card */}
        <div className="bg-cardBackground p-6 rounded-xl shadow-lg border border-cardBorder">
          <p className="text-textContent mb-4">
            Who can send you invitations to connect?
          </p>

          <div className="space-y-3 text-text">
            {CONNECTION_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`block cursor-pointer p-4 rounded-lg border transition-colors ${
                  currentOption === option.value
                    ? "border-blue-500 bg-itemHoverBackground"
                    : "border-itemBorder hover:bg-itemHoverBackground"
                }`}
                onClick={() => setCurrentOption(option.value)}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="connection-preference"
                    value={option.value}
                    checked={currentOption === option.value}
                    onChange={() => setCurrentOption(option.value)}
                    className="w-5 h-5 accent-blue-500"
                  />
                  <div>
                    <h3 className="text-base font-semibold text-textContent">
                      {option.label}
                    </h3>
                    <p className="text-sm text-textPlaceholder mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={!isModified || saving}
              className={`px-4 py-2 rounded-full text-white text-sm transition duration-200 ${
                isModified
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-400 opacity-60 cursor-not-allowed"
              }`}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionRequestsManagement;
