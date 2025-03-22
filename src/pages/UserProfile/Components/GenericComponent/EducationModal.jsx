// import React, { useState, useEffect } from "react";
// import GenericModal from "./GenericModal";

// const EducationModal = ({ isOpen, onClose, onSave, initialData = {} }) => {
//   const [formData, setFormData] = useState(initialData || {});
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
//       <h2 className="text-lg font-semibold mb-4">Education Details</h2>

//       <label className="block font-medium mb-1">School Name*</label>
//       <input
//         type="text"
//         name="institution"
//         value={formData.institution || ""}
//         onChange={handleChange}
//         className="border p-2 w-full rounded-md mb-3"
//         required
//       />

//       <label className="block font-medium mb-1">Degree</label>
//       <input
//         type="text"
//         name="degree"
//         value={formData.degree || ""}
//         onChange={handleChange}
//         className="border p-2 w-full rounded-md mb-3"
//       />

//       <label className="block font-medium mb-1">Field of Study</label>
//       <input
//         type="text"
//         name="fieldOfStudy"
//         value={formData.fieldOfStudy || ""}
//         onChange={handleChange}
//         className="border p-2 w-full rounded-md mb-3"
//       />
//     </GenericModal>
//   );
// };

// export default EducationModal;
