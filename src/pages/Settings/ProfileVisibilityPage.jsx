import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { axiosInstance as axios } from "../../apis/axios";
import { toast } from "react-toastify";

const VISIBILITY_OPTIONS = [
  {
    value: "public",
    label: "Public",
    description: "Anyone can view your profile",
  },
  {
    value: "connections_only",
    label: "Connections Only",
    description: "Only your connections can view your profile",
  },
  {
    value: "private",
    label: "Private",
    description: "Only you can view your profile",
  },
];

const ProfileVisibilityPage = () => {
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState(null);
  const [selectedVisibility, setSelectedVisibility] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchVisibility = async () => {
      try {
        const response = await axios.get("/profile");
        const current = response.data.visibility;
        setVisibility(current);
        setSelectedVisibility(current);
      } catch (error) {
        console.error("Failed to fetch visibility:", error);
      }
    };

    fetchVisibility();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.patch("/profile", { visibility: selectedVisibility });
      setVisibility(selectedVisibility);
      toast.success(" Profile visibility updated successfully!");
    } catch (error) {
      toast.error(" Failed to update profile visibility.");
      console.error("Failed to save visibility", error);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = visibility && selectedVisibility !== visibility;

  return (
    <div className="min-h-screen p-6 bg-mainBackground">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack className="text-textContent" />
          </IconButton>
          <h1 className="text-2xl font-bold text-header">Profile Visibility</h1>
        </div>

        {/* Card */}
        <div className="bg-cardBackground p-6 rounded-xl shadow-lg border border-cardBorder">
          <p className="text-textContent mb-4">
            Choose who can view your profile on Tawasol.
          </p>

          <div className="space-y-3 text-text">
            {VISIBILITY_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`block cursor-pointer p-4 rounded-lg border transition-colors ${
                  selectedVisibility === option.value
                    ? "border-blue-500 bg-itemHoverBackground"
                    : "border-itemBorder hover:bg-itemHoverBackground"
                }`}
                onClick={() => setSelectedVisibility(option.value)}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="visibility"
                    value={option.value}
                    checked={selectedVisibility === option.value}
                    onChange={() => setSelectedVisibility(option.value)}
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
              disabled={!hasChanges || saving}
              className={`px-4 py-2 rounded-full text-white text-sm transition duration-200 ${
                hasChanges
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

export default ProfileVisibilityPage;
