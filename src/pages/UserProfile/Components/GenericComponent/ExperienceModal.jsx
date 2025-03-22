// import React, { useState, useEffect } from "react";
// import GenericModal from "./GenericModal";

// const ExperienceModal = ({ isOpen, onClose, onSave, initialData = {} }) => {
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
//       <h2 className="text-lg font-semibold mb-4">Experience Details</h2>

//       <label className="block font-medium mb-1">Job Title*</label>
//       <input
//         type="text"
//         name="title"
//         className="border p-2 w-full rounded-md mb-3"
//         required
//       />

//       <label className="block font-medium mb-1">Company</label>
//       <input
//         type="text"
//         name="company"
//         className="border p-2 w-full rounded-md mb-3"
//       />

//       <label className="block font-medium mb-1">Location</label>
//       <input
//         type="text"
//         name="location"
//         className="border p-2 w-full rounded-md mb-3"
//       />
//     </GenericModal>
//   );
// };
// export default ExperienceModal;
