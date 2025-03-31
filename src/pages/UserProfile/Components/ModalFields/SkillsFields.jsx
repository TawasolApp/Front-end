import React from "react";

function SkillsFields({ formData, handleChange, errors, editMode }) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4 text-text">Add skill</h2>
      <p className="text-sm text-gray-600 mb-2">* Indicates required</p>

      <label htmlFor="skill" className="block font-medium mb-1 text-text">
        Skill *
      </label>
      <input
        id="skill"
        type="text"
        name="skill"
        placeholder="Skill (ex: Project Management)"
        value={formData.skill || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2 bg-boxbackground text-companyheader2"
        required
        readOnly={editMode} //  prevent typing
      />
      {errors.skill && (
        <p className="text-red-600 text-sm mb-3">{errors.skill}</p>
      )}

      {editMode && (
        <p className="text-sm italic text-gray-500 mb-2">
          Skill name cannot be edited. To change it, delete and re-add the
          skill.
        </p>
      )}
      <label htmlFor="position" className="block font-medium mb-1 text-text">
        Position (Optional)
      </label>
      <input
        id="position"
        type="text"
        name="position"
        placeholder="e.g. Frontend Developer"
        value={formData.position || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2 bg-boxbackground text-companyheader2"
      />
    </>
  );
}

export default SkillsFields;
