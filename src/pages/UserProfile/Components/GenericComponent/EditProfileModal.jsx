import React, { useState, useEffect } from "react";
import axios from "axios";

function EditProfileModal({ user, isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  // Store edited user in state
  const [editedUser, setEditedUser] = useState({ ...user });
  const [errors, setErrors] = useState({}); // State for validation errors
  const [showDiscardModal, setShowDiscardModal] = useState(false); // Discard confirmation state
  // for changing  education and experience pinned at header,,and send BE to surive loading
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(0);
  const [selectedEducationIndex, setSelectedEducationIndex] = useState(0);
  useEffect(() => {
    if (isOpen) {
      setEditedUser({ ...user });
      setErrors({});
    }
  }, [isOpen, user]);

  // Handle Input Changes
  function handleChange(event) {
    const { name, value } = event.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }

  // Handle Save with Validation
  function handleSave() {
    let validationErrors = {};
    if (!editedUser.firstName?.trim())
      validationErrors.firstName = "First Name is required.";
    if (!editedUser.lastName?.trim())
      validationErrors.lastName = "Last Name is required.";
    if (!editedUser.country?.trim())
      validationErrors.country = "Country/Region is required.";
    if (!editedUser.industry?.trim())
      validationErrors.industry = "Industry is required.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop saving if errors exist
    }
    //  Only send changed fields
    const updates = {};
    for (let key in editedUser) {
      if (editedUser[key] !== user[key]) {
        updates[key] = editedUser[key];
      }
    }

    axios
      .patch("http://localhost:5000/profile", {
        id: user.id,
        ...updates,
        selectedExperienceIndex,
        selectedEducationIndex,
      })
      .then((res) => {
        onSave({
          ...res.data,
          selectedExperienceIndex,
          selectedEducationIndex,
        });
        onClose();
      })
      .catch((err) => {
        console.error(
          " Failed to update profile:",
          err.response?.data || err.message
        );
      });
  }

  function handleCancel() {
    // Check if any field is changed
    const isChanged = JSON.stringify(editedUser) !== JSON.stringify(user);
    if (isChanged) {
      setShowDiscardModal(true); // Show discard modal
    } else {
      onClose(); // Close immediately if no changes
    }
  }

  function confirmDiscard() {
    setShowDiscardModal(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        {/* First Name */}
        <label className="block text-sm font-medium text-gray-700">
          First name *
        </label>
        <input
          type="text"
          name="firstName"
          value={editedUser.firstName || ""}
          onChange={handleChange}
          className={`border p-2 w-full mb-2 ${
            errors.firstName ? "border-red-500" : ""
          }`}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm">{errors.firstName}</p>
        )}

        {/* Last Name */}
        <label className="block text-sm font-medium text-gray-700">
          Last name *
        </label>
        <input
          type="text"
          name="lastName"
          value={editedUser.lastName || ""}
          onChange={handleChange}
          className={`border p-2 w-full mb-2 ${
            errors.lastName ? "border-red-500" : ""
          }`}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm">{errors.lastName}</p>
        )}

        {/* Bio */}
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          name="bio"
          value={editedUser.bio || ""}
          onChange={handleChange}
          className="border p-2 w-full mb-2 h-20"
        />

        {/* country */}
        <label className="block text-sm font-medium text-gray-700">
          Country/Region *
        </label>
        <input
          type="text"
          name="country"
          value={editedUser.country || ""}
          onChange={handleChange}
          className={`border p-2 w-full mb-2 ${
            errors.country ? "border-red-500" : ""
          }`}
        />
        {errors.country && (
          <p className="text-red-500 text-sm">{errors.country}</p>
        )}

        <label className="block text-sm font-medium text-gray-700">
          City (Optional)
        </label>
        <input
          type="text"
          name="city"
          value={editedUser.city || ""}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        {/* Industry */}
        <label className="block text-sm font-medium text-gray-700">
          Industry *
        </label>
        <input
          type="text"
          name="industry"
          value={editedUser.industry || ""}
          onChange={handleChange}
          className={`border p-2 w-full mb-2 ${
            errors.industry ? "border-red-500" : ""
          }`}
        />
        {errors.industry && (
          <p className="text-red-500 text-sm">{errors.industry}</p>
        )}

        {/* Work Experience (Dropdown) */}
        <label className="block text-sm font-medium text-gray-700">
          Work Experience
        </label>
        <select
          name="experience"
          className="border p-2 w-full mb-2"
          value={selectedExperienceIndex}
          onChange={(e) => setSelectedExperienceIndex(Number(e.target.value))}
        >
          {editedUser.experience?.map((exp, index) => (
            <option key={index} value={index}>
              {exp.title} at {exp.company}
            </option>
          ))}
        </select>

        {/* Education (Dropdown) */}
        <label className="block text-sm font-medium text-gray-700">
          Education
        </label>
        <select
          name="education"
          className="border p-2 w-full mb-2"
          value={selectedEducationIndex}
          onChange={(e) => setSelectedEducationIndex(Number(e.target.value))}
        >
          {editedUser.education?.map((edu, index) => (
            <option key={index} value={index}>
              {edu.institution} - {edu.degree}
            </option>
          ))}
        </select>

        {/* Skills (Dropdown) */}
        <label className="block text-sm font-medium text-gray-700">
          Skills
        </label>
        <select name="skills" className="border p-2 w-full mb-2">
          {Array.isArray(editedUser.skills) && editedUser.skills.length > 0 ? (
            editedUser.skills.map((skill, index) => (
              <option key={index}>{skill.skillName}</option>
            ))
          ) : (
            <option>No Skill added</option>
          )}
        </select>

        {/* Buttons */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 mr-2 border rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
      {/* Discard Changes Modal */}
      {showDiscardModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] relative">
            {/* Close Button (X) */}
            <button
              onClick={() => setShowDiscardModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-2 text-2xl p-3"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold">Discard changes</h3>
            <p className="text-gray-700 mt-2">
              Are you sure you want to discard the changes you made?
            </p>

            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowDiscardModal(false)}
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition duration-200"
              >
                No thanks
              </button>
              <button
                onClick={confirmDiscard}
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-200"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfileModal;
