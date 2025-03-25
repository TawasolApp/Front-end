import React from "react";
function CertificationsFields({ formData, handleChange, errors }) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4 text-text ">
        Add license or certification
      </h2>

      <p className="text-sm text-gray-600 mb-2">* Indicates required</p>

      <label htmlFor="name" className="block font-medium mb-1 text-text">
        Name*
      </label>
      <input
        id="name"
        type="text"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2 bg-boxbackground  text-companyheader2"
        placeholder="Ex: Microsoft certified network associate security"
      />
      {errors.name && (
        <p className="text-red-600 text-sm mb-2">{errors.name}</p>
      )}

      <label
        htmlFor="issuingOrganization"
        className="block font-medium mb-1 text-text"
      >
        Issuing organization*
      </label>
      <input
        id="issuingOrganization"
        type="text"
        name="issuingOrganization"
        value={formData.issuingOrganization || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2 bg-boxbackground text-companyheader2"
        placeholder="Ex: Microsoft"
      />
      {errors.issuingOrganization && (
        <p className="text-red-600 text-sm mb-2">
          {errors.issuingOrganization}
        </p>
      )}

      <label
        htmlFor="credentialId"
        className="block font-medium mb-1  text-text"
      >
        Credential ID
      </label>
      <input
        id="credentialId"
        type="text"
        name="credentialId"
        value={formData.credentialId || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2 bg-boxbackground text-companyheader2"
        placeholder="Optional"
      />

      <label
        htmlFor="credentialUrl"
        className="block font-medium mb-1  text-text"
      >
        Credential URL
      </label>
      <input
        id="credentialUrl"
        type="url"
        name="credentialUrl"
        value={formData.credentialUrl || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2 bg-boxbackground text-companyheader2"
        placeholder="Optional"
      />
    </>
  );
}

export default CertificationsFields;
