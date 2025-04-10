import React, { useState, useEffect } from "react";
import { axiosInstance as axios } from "../../../../apis/axios.js";
import ConfirmModal from "../GenericDisplay/ConfirmModal.jsx";
function EditProfileModal({ user, isOpen, onClose, onSave }) {
  const [editedUser, setEditedUser] = useState({ ...user });
  const [errors, setErrors] = useState({});
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(0);
  const [selectedEducationIndex, setSelectedEducationIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditedUser({ ...user });
      setErrors({});
    }
  }, [isOpen, user]);

  //  Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const saveProfile = async () => {
      if (isSaving) {
        console.log("Saving profile data...");

        let validationErrors = {};
        if (!editedUser.firstName?.trim())
          validationErrors.firstName = "First Name is required.";
        if (!editedUser.lastName?.trim())
          validationErrors.lastName = "Last Name is required.";
        if (!editedUser.location?.trim())
          validationErrors.location = "Country/Region is required.";
        if (!editedUser.industry?.trim())
          validationErrors.industry = "Industry is required.";

        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          setIsSaving(false);
          return;
        }

        const updates = {};
        for (let key in editedUser) {
          if (editedUser[key] !== user[key]) {
            updates[key] = editedUser[key];
          }
        }

        try {
          const response = await axios.patch(`/profile`, {
            id: user._id,
            ...updates,
            selectedExperienceIndex,
            selectedEducationIndex,
          });

          onSave({
            ...response.data,
            selectedExperienceIndex,
            selectedEducationIndex,
          });
          onClose();
        } catch (err) {
          console.error(
            "Failed to update profile:",
            err.response?.data || err.message
          );
        }

        setIsSaving(false); // Reset saving state
      }
    };

    saveProfile();
  }, [
    isSaving,
    editedUser,
    selectedExperienceIndex,
    selectedEducationIndex,
    user,
    onClose,
    onSave,
  ]);

  function handleSave() {
    let validationErrors = {};
    if (!editedUser.firstName?.trim())
      validationErrors.firstName = "First Name is required.";
    if (!editedUser.lastName?.trim())
      validationErrors.lastName = "Last Name is required.";
    if (!editedUser.location?.trim())
      validationErrors.location = "Country/Region is required.";
    if (!editedUser.industry?.trim())
      validationErrors.industry = "Industry is required.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; //  Prevent saving if errors exist
    }

    setIsSaving(true); //  Trigger save only if form is valid
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }

  function handleCancel() {
    const isChanged = JSON.stringify(editedUser) !== JSON.stringify(user);
    if (isChanged) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  }

  function confirmDiscard() {
    setShowDiscardModal(false);
    onClose();
  }
  const hasUnsavedChanges = JSON.stringify(editedUser) !== JSON.stringify(user);

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isOpen ? "flex" : "hidden"
      } items-center justify-center bg-black bg-opacity-50`}
    >
      {/*  the previous div to prevent bg scrolling */}
      <div
        className="bg-boxbackground w-[95%] sm:w-[600px] p-6 rounded-lg shadow-lg 
                max-h-screen sm:max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={handleCancel}
          className="absolute top-2 right-2  text-normaltext hover:text-companyheader p-2 text-3xl"
          aria-label="Close modal"
        >
          &times;{" "}
        </button>

        <h2 className="text-xl font-bold mb-4 text-text">Edit Profile</h2>
        <label
          htmlFor="firstName"
          className="block text-sm font-medium text-normaltext"
        >
          First name *
        </label>
        <input
          id="firstName"
          type="text"
          name="firstName"
          autoComplete="off"
          value={editedUser.firstName || ""}
          onChange={handleChange}
          className={`border p-2 w-full mb-2 bg-boxbackground text-companysubheader ${
            errors.firstName ? "border-red-500" : ""
          }`}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm">{errors.firstName}</p>
        )}
        <label
          htmlFor="lastName"
          className="block text-sm font-medium text-normaltext"
        >
          Last name *
        </label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          autoComplete="off"
          value={editedUser.lastName || ""}
          onChange={handleChange}
          className={`border p-2 w-full mb-2 bg-boxbackground text-companysubheader ${
            errors.lastName ? "border-red-500" : ""
          }`}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm" data-testid="lastName-error">
            {errors.lastName}
          </p>
        )}
        <label
          htmlFor="location"
          className="block text-sm font-medium text-normaltext"
        >
          Location *
        </label>
        <input
          id="location"
          type="text"
          name="location"
          autoComplete="off"
          value={editedUser.location || ""}
          onChange={handleChange}
          className={`border p-2 w-full mb-2 bg-boxbackground text-companysubheader ${
            errors.location ? "border-red-500" : ""
          }`}
        />
        {errors.location && (
          <p className="text-red-500 text-sm" data-testid="location-error">
            {errors.location}
          </p>
        )}

        <label
          htmlFor="industry"
          className="block text-sm font-medium text-normaltext"
        >
          Industry *
        </label>
        <input
          id="industry"
          type="text"
          name="industry"
          autoComplete="off"
          value={editedUser.industry || ""}
          onChange={handleChange}
          className={`border p-2 w-full mb-2  bg-boxbackground text-companysubheader ${
            errors.industry ? "border-red-500" : ""
          }`}
        />
        {errors.industry && (
          <p className="text-red-500 text-sm" data-testid="industry-error">
            {errors.industry}
          </p>
        )}
        <label
          htmlFor="workExperience"
          className="block text-sm font-medium text-normaltext"
        >
          Work Experience
        </label>
        <select
          id="workExperience"
          name="experience"
          className="border p-2 w-full mb-2 bg-boxbackground text-companysubheader"
          value={selectedExperienceIndex}
          onChange={(e) => setSelectedExperienceIndex(Number(e.target.value))}
        >
          {editedUser.workExperience?.map((exp, index) => (
            <option key={index} value={index}>
              {exp.title} at {exp.company}
            </option>
          ))}
        </select>
        <label
          htmlFor="education"
          className="block text-sm font-medium text-normaltext"
        >
          Education
        </label>
        <select
          id="education"
          name="education"
          className="border p-2 w-full mb-2 bg-boxbackground text-companysubheader"
          value={selectedEducationIndex}
          onChange={(e) => setSelectedEducationIndex(Number(e.target.value))}
        >
          {editedUser.education?.map((edu, index) => (
            <option key={index} value={index}>
              {edu.institution} - {edu.degree}
            </option>
          ))}
        </select>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className={`px-4 py-2 rounded-full transition duration-200 text-white ${
              !hasUnsavedChanges || isSaving
                ? "bg-blue-400 cursor-not-allowed opacity-50"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      {showDiscardModal && (
        <ConfirmModal
          title="Discard changes"
          message="Are you sure you want to discard the changes you made?"
          onConfirm={confirmDiscard}
          onCancel={() => setShowDiscardModal(false)}
          confirmLabel="Discard"
          cancelLabel="No thanks"
        />
      )}
      {isSaving && (
        <div className="fixed inset-0 z-50 bg-boxheading bg-opacity-60 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="ml-3 text-text text-lg font-medium">Saving...</span>
        </div>
      )}
    </div>
  );
}

export default EditProfileModal;
