// import React, { useState } from "react";
// import GenericCard from "./GenericCard";
// import { useNavigate } from "react-router-dom";
// import EducationModal from "../EducationModal";
// import ExperienceModal from "../ExperienceModal";
// import CertificationsModal from "../CertificationsModal";

// function GenericPage({ title, type, items, isOwner }) {
//   const navigate = useNavigate();
//   const [data, setData] = useState(items);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);
//   const [editData, setEditData] = useState(null);

//   const handleEdit = (item, index) => {
//     setEditIndex(index);
//     setEditData(item);
//     setIsModalOpen(true);
//   };

//   const handleSave = (updatedItem) => {
//     const updatedData =
//       editIndex !== null
//         ? data.map((item, i) => (i === editIndex ? updatedItem : item))
//         : [...data, updatedItem];

//     setData(updatedData); // Update local state
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="bg-white p-6 shadow-md rounded-md w-full max-w-3xl mx-auto">
//       <button
//         onClick={() => navigate(-1)}
//         className="mb-4 text-black-500 hover:underline font-medium"
//       >
//         ← Back
//       </button>

//       <h2 className="text-2xl font-semibold mb-4">All {title}</h2>

//       <div className="space-y-4">
//         {data.map((item, index) => (
//           <GenericCard
//             key={index}
//             item={item}
//             isOwner={isOwner}
//             type={type}
//             onEdit={() => handleEdit(item, index)}
//           />
//         ))}
//       </div>

//       {isModalOpen && type === "education" && (
//         <EducationModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onSave={handleSave}
//           initialData={editData || {}}
//         />
//       )}

//       {isModalOpen && type === "experience" && (
//         <ExperienceModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onSave={handleSave}
//           initialData={editData}
//         />
//       )}

//       {isModalOpen && type === "certifications" && (
//         <CertificationsModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onSave={handleSave}
//           initialData={editData}
//         />
//       )}
//     </div>
//   );
// }

// export default GenericPage;
