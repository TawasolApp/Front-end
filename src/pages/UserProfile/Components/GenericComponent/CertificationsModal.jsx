// import React, { useState, useEffect } from "react";
// import GenericModal from "./GenericModal";

// const CertificationsModal = ({ isOpen, onClose, onSave, initialData = {} }) => {
//   const [formData, setFormData] = useState(initialData);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (isOpen) setFormData(initialData || {});
//   }, [isOpen, initialData]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   return (
//     <GenericModal
//       isOpen={isOpen}
//       onClose={onClose}
//       onSave={onSave}
//       initialData={initialData}
//     >
//       <h2 className="text-lg font-semibold mb-4">Certification Details</h2>

//       <label className="block font-medium mb-1">Certification Name*</label>
//       <input
//         type="text"
//         name="name"
//         className="border p-2 w-full rounded-md mb-3"
//         required
//       />

//       <label className="block font-medium mb-1">Issuing Organization</label>
//       <input
//         type="text"
//         name="issuingOrganization"
//         className="border p-2 w-full rounded-md mb-3"
//       />
//     </GenericModal>
//   );
// };

// export default CertificationsModal;
