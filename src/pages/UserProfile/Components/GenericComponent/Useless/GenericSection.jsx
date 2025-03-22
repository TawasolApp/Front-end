// import React, { useState } from "react";
// import GenericCard from "./Useless/GenericCard";
// import { useNavigate } from "react-router-dom";
// import EducationModal from "./EducationModal";
// import ExperienceModal from "./ExperienceModal";
// import CertificationsModal from "./CertificationsModal";

// function GenericSection({ title, type, items, isOwner, onUpdate }) {
//   const navigate = useNavigate();
//   const [data, setData] = useState(items);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);
//   const [editData, setEditData] = useState(null);

//   const handleAdd = () => {
//     setEditIndex(null);
//     setEditData(null);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (item, index) => {
//     setEditIndex(index);
//     setEditData(item);
//     setIsModalOpen(true);
//   };
//   // ✅ Function to save or update education data
//   const handleSave = (updatedItem) => {
//     let updatedItems;
//     if (editIndex !== null) {
//       // ✅ Edit existing item
//       updatedItems = items.map((item, i) =>
//         i === editIndex ? updatedItem : item
//       );
//     } else {
//       // ✅ Add new item
//       updatedItems = [...items, updatedItem];
//     }

//     onUpdate(updatedItems); // ✅ Pass updated data to parent (EducationSection)
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="bg-white p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-semibold">{title}</h2>

//         {isOwner && (
//           <button
//             className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
//             onClick={handleAdd}
//           >
//             &#43;
//           </button>
//         )}
//       </div>

//       {/* Display Items */}
//       <div className="space-y-4">
//         {data.slice(0, 2).map((item, index) => (
//           <GenericCard
//             key={index}
//             item={item}
//             isOwner={isOwner}
//             type={type}
//             onEdit={() => handleEdit(item, index)}
//           />
//         ))}
//       </div>

//       {/* Show the correct modal based on type */}
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

//       {data.length > 2 && (
//         <button
//           onClick={() => navigate(`/${type.toLowerCase()}`)}
//           className="w-full mt-4 text-black-500 hover:underline text-center block font-medium pb-4"
//         >
//           Show all {items.length} {type.toLowerCase()} records →
//         </button>
//       )}
//     </div>
//   );
// }

// export default GenericSection;
