import React from "react";

function CertificationsFields({ formData, handleChange, errors }) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">
        Add license or certification
      </h2>

      <p className="text-sm text-gray-600 mb-2">* Indicates required</p>

      <label className="block font-medium mb-1">Name*</label>
      <input
        type="text"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2"
        placeholder="Ex: Microsoft certified network associate security"
      />
      {errors.name && (
        <p className="text-red-600 text-sm mb-2">{errors.name}</p>
      )}

      <label className="block font-medium mb-1">Issuing organization*</label>
      <input
        type="text"
        name="issuingOrganization"
        value={formData.issuingOrganization || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2"
        placeholder="Ex: Microsoft"
      />
      {errors.issuingOrganization && (
        <p className="text-red-600 text-sm mb-2">
          {errors.issuingOrganization}
        </p>
      )}

      <label className="block font-medium mb-1">Credential ID</label>
      <input
        type="text"
        name="credentialId"
        value={formData.credentialId || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2"
        placeholder="Optional"
      />

      <label className="block font-medium mb-1">Credential URL</label>
      <input
        type="url"
        name="credentialUrl"
        value={formData.credentialUrl || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2"
        placeholder="Optional"
      />
    </>
  );
}

export default CertificationsFields;
