import React from "react";

function SkillsFields({ formData, handleChange, errors }) {
  return (
    <>
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
    </>
  );
}

export default SkillsFields;
