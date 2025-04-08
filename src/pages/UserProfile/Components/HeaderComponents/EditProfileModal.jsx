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
          className="absolute top-4 right-4 text-l text-gray-600 hover:text-gray-900"
          aria-label="Close modal"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4 text-text">Edit Profile</h2>
        <label
          htmlFor="firstName"
          className="block text-sm font-medium text-text2"
        >
          First name *
        </label>
        <input
          id="firstName"
          type="text"
          name="firstName"
          value={editedUser.firstName || ""}
          onChange={handleChange}
          className={`border p-2 w-full mb-2 bg-boxbackground text-companyheader2 ${
            errors.firstName ? "border-red-500" : ""
          }`}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm">{errors.firstName}</p>
        )}
        <label
          htmlFor="lastName"
          className="block text-sm font-medium text-text2"
        >
          Last name *
        </label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          value={editedUser.lastName || ""}
          onChange={handleChange}
          className={`border p-2 w-full mb-2 bg-boxbackground text-companyheader2 ${
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
          className="block text-sm font-medium text-text2"
        >
          Location *
        </label>
        <input
          id="location"
          type="text"
          name="location"
          value={editedUser.location || ""}
          onChange={handleChange}
          className={`border p-2 w-full mb-2 bg-boxbackground text-companyheader2 ${
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
          className="block text-sm font-medium text-text2"
        >
          Industry *
        </label>
        <input
          id="industry"
          type="text"
          name="industry"
          value={editedUser.industry || ""}
          onChange={handleChange}
          className={`border p-2 w-full mb-2  bg-boxbackground text-companyheader2 ${
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
          className="block text-sm font-medium text-text2"
        >
          Work Experience
        </label>
        <select
          id="workExperience"
          name="experience"
          className="border p-2 w-full mb-2 bg-boxbackground text-companyheader2"
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
          className="block text-sm font-medium text-text2"
        >
          Education
        </label>
        <select
          id="education"
          name="education"
          className="border p-2 w-full mb-2 bg-boxbackground text-companyheader2"
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
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Save
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
    </div>
  );
}

export default EditProfileModal;
