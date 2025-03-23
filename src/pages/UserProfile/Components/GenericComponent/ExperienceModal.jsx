import React, { useState, useEffect } from "react";
import GenericModal from "./Useless/GenericModal";

const ExperienceModal = ({ isOpen, onClose, onSave, initialData = {} }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {});
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = "Title is required";
    if (!formData.company?.trim()) newErrors.company = "Company is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (data) => {
    if (validate()) {
      onSave({ ...formData, ...data }); // combine modal data + date pickers
    }
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      initialData={formData}
      type="experience"
    >
      <h2 className="text-lg font-semibold mb-4">Add experience</h2>

      <label className="block font-medium mb-1">Title*</label>
      <input
        type="text"
        name="title"
        placeholder="Ex: Retail Sales Manager"
        value={formData.title || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2"
        required
      />
      {errors.title && (
        <p className="text-red-600 text-sm mb-2">{errors.title}</p>
      )}

      <label className="block font-medium mb-1">Employment type</label>
      <select
        name="employmentType"
        value={formData.employmentType || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2"
      >
        <option value="">Please select</option>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Internship">Internship</option>
        <option value="Freelance">Freelance</option>
        <option value="Temporary">Temporary</option>
      </select>

      <label className="block font-medium mb-1">Company or organization*</label>
      <input
        type="text"
        name="company"
        placeholder="Ex: Microsoft"
        value={formData.company || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2"
        required
      />
      {errors.company && (
        <p className="text-red-600 text-sm mb-2">{errors.company}</p>
      )}

      <label className="flex items-center mb-3 gap-2">
        <input
          type="checkbox"
          name="currentlyWorking"
          checked={formData.currentlyWorking || false}
          onChange={handleChange}
        />
        <span>I am currently working in this role</span>
      </label>

      {/* Start and End dates handled by GenericModal */}
      {/* End date will be disabled if currently working */}
      <label className="block font-medium mb-1">Location</label>
      <input
        type="text"
        name="location"
        placeholder="Ex: London, United Kingdom"
        value={formData.location || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2"
      />

      <label className="block font-medium mb-1">Location type</label>
      <select
        name="locationType"
        value={formData.locationType || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2"
      >
        <option value="">Please select</option>
        <option value="On-site">On-site</option>
        <option value="Hybrid">Hybrid</option>
        <option value="Remote">Remote</option>
      </select>
      <p className="text-sm text-gray-500 mb-2">
        Pick a location type (ex: remote)
      </p>

      <label className="block font-medium mb-1">Description</label>
      <textarea
        name="description"
        placeholder="List your major duties and successes, highlighting specific projects"
        value={formData.description || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md resize-none"
        maxLength={1000}
      />
      <p className="text-right text-gray-500 text-sm mb-2">
        {formData.description?.length || 0}/1000
      </p>
    </GenericModal>
  );
};

export default ExperienceModal;
