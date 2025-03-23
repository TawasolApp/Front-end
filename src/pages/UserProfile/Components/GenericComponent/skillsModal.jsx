import React, { useState, useEffect } from "react";
import GenericModal from "./Useless/GenericModal";

const SkillsModal = ({ isOpen, onClose, onSave, initialData = {} }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.skill?.trim()) {
      newErrors.skill = "Skill is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (data) => {
    if (validate()) {
      onSave(data);
    }
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      initialData={formData}
      type="skills"
    >
      <h2 className="text-lg font-semibold mb-4">Add skill</h2>

      <p className="text-sm text-gray-600 mb-2">* Indicates required</p>

      <label className="block font-medium mb-1">Skill *</label>
      <input
        type="text"
        name="skill"
        placeholder="Skill (ex: Project Management)"
        value={formData.skill || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2"
        required
      />
      {errors.skill && (
        <p className="text-red-600 text-sm mb-3">{errors.skill}</p>
      )}

      <label className="block font-medium mb-1">Position (Optional)</label>
      <input
        type="text"
        name="position"
        placeholder="e.g. Frontend Developer"
        value={formData.position || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2"
      />
    </GenericModal>
  );
};

export default SkillsModal;
