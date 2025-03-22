// import React, { useState } from "react";
// import GenericModal from "../GenericModal";

// function GenericCard({ item, isOwner, type, onUpdate, onEdit }) {
//   const [isEndorsed, setIsEndorsed] = useState(false);
//   const [endorsementCount, setEndorsementCount] = useState(
//     item.endorsements || 0
//   );
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const handleEdit = () => {
//     setIsModalOpen(true);
//   };
//   const handleEndorse = () => {
//     setEndorsementCount((prev) => (isEndorsed ? prev - 1 : prev + 1));
//     setIsEndorsed(!isEndorsed);
//   };
//   const handleSave = (updatedData) => {
//     if (onUpdate) {
//       onUpdate(updatedData); // Send the updated data to the parent
//     }
//     setIsModalOpen(false);
//   };

//   const handleDelete = () => {
//     alert(
//       `Delete ${type}: ${
//         item.title || item.institution || item.skill || item.name
//       }`
//     );
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-sm w-full flex flex-col relative">
//       {/* Edit/Delete Buttons */}
//       {isOwner && (
//         <div className="absolute top-2 right-2 flex gap-2 items-center">
//           <button
//             onClick={onEdit}
//             className="text-gray-500 hover:text-blue-700 p-1"
//           >
//             ✎
//           </button>
//           <button
//             onClick={handleDelete}
//             className="text-gray-500 hover:text-blue-700 p-1"
//           >
//             🗑
//           </button>
//         </div>
//       )}

//       {/* Common Fields */}
//       {item.title && <h3 className="text-lg font-semibold">{item.title}</h3>}
//       {item.institution && (
//         <h3 className="text-lg font-semibold">{item.institution}</h3>
//       )}
//       {item.name && <h3 className="text-lg font-semibold">{item.name}</h3>}

//       <p className="text-gray-600">
//         {item.company ||
//           item.degree ||
//           item.position ||
//           item.issuingOrganization ||
//           ""}
//       </p>
//       <p className="text-gray-500">{item.location || item.field || ""}</p>

//       {/* Certification-Specific Fields */}
//       {type === "certifications" && (
//         <p className="text-gray-500">
//           {item.issueDate
//             ? `Issued: ${new Date(item.issueDate).toLocaleDateString()}`
//             : ""}
//           {item.expirationDate
//             ? ` | Expires: ${new Date(
//                 item.expirationDate
//               ).toLocaleDateString()}`
//             : ""}
//         </p>
//       )}
//       {/* check for time if it is not included  */}
//       <p className="text-gray-500">
//         {item.startDate && item.endDate
//           ? `${new Date(item.startDate).getFullYear()} - ${new Date(
//               item.endDate
//             ).getFullYear()}`
//           : ""}
//       </p>
//       <p className="text-gray-700 text-sm">{item.description}</p>
//       {item.grade && (
//         <p className="text-gray-500 text-sm">Grade: {item.grade}</p>
//       )}

//       {/* Skills-Specific Section */}
//       {type === "skills" && (
//         <>
//           {item.recentEndorsement && (
//             <p className="text-gray-500 text-sm flex items-center mt-1">
//               {item.recentEndorsement}
//             </p>
//           )}
//           <p className="text-gray-600 flex items-center mt-1">
//             <span className="mr-2">👥</span> {endorsementCount} endorsement
//             {endorsementCount !== 1 ? "s" : ""}
//           </p>

//           {/* Show Endorsement Button Only for Viewers (Not Owners) */}
//           {!isOwner && (
//             <button
//               onClick={handleEndorse}
//               className={`mt-2 px-4 py-2 border rounded-full flex items-center justify-center gap-2 w-fit ${
//                 isEndorsed
//                   ? "bg-gray-200 text-gray-800 border-gray-400"
//                   : "bg-white text-gray-700 border-gray-500"
//               } hover:bg-gray-300 transition`}
//             >
//               {isEndorsed ? "✔ Endorsed" : "Endorse"}
//             </button>
//           )}
//           {isModalOpen && (
//             <GenericModal
//               isOpen={isModalOpen}
//               onClose={() => setIsModalOpen(false)}
//               onSave={handleSave}
//               type={type}
//               initialData={item}
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default GenericCard;
