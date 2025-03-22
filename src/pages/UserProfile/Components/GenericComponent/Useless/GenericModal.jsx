// import React, { useState, useEffect } from "react";

// // Get all months dynamically
// const getAllMonthsDynamically = () => {
//   return [...Array(12)].map((_, i) =>
//     new Date(2000, i).toLocaleString("default", { month: "long" })
//   );
// };

// // Generate years dynamically (Last 50 years)
// const getStartYears = () =>
//   Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

// // Generate end years dynamically (From start year to 2035, correctly ordered)
// const getEndYears = () => {
//   const currentYear = new Date().getFullYear();
//   return Array.from(
//     { length: 2035 - currentYear + 1 },
//     (_, i) => currentYear + i
//   );
// };

// const months = getAllMonthsDynamically();
// const currentYear = new Date().getFullYear();
// const currentMonthIndex = new Date().getMonth(); // 0-based (Jan = 0, Feb = 1)
// const startYears = getStartYears();
// const endYears = getEndYears();

// function GenericModal({
//   isOpen,
//   onClose,
//   onSave,
//   type,
//   initialData = {},
//   children,
// }) {
//   if (!isOpen) return null;

//   const [formData, setFormData] = useState(initialData);
//   const [errors, setErrors] = useState({});
//   useEffect(() => {
//     setFormData(initialData);
//   }, [initialData]);
//   useEffect(() => {
//     setFormData(initialData || {}); // Ensure initialData is not undefined
//   }, [initialData]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const validateForm = () => {
//     let newErrors = {};

//     // Year validation - Ensure a valid year is selected
//     if (!formData.startYear || formData.startYear === "Year") {
//       newErrors.startYear = "Please select a valid year";
//     }

//     // Month validation - Ensure a valid month is selected
//     if (!formData.startMonth || formData.startMonth === "Month") {
//       newErrors.startMonth = "Please select a valid month";
//     }

//     // Future date validation
//     if (formData.startYear && parseInt(formData.startYear) > currentYear) {
//       newErrors.startYear = "Start date can't be in the future";
//     }

//     // Prevent selecting future months in the current year
//     if (
//       formData.startYear == currentYear &&
//       months.indexOf(formData.startMonth) > currentMonthIndex
//     ) {
//       newErrors.startMonth = "Start month can't be in the future";
//     }

//     // End year validation - Can't be before start year
//     if (
//       formData.endYear &&
//       formData.startYear &&
//       parseInt(formData.endYear) < parseInt(formData.startYear)
//     ) {
//       newErrors.endYear = "End year can't be before the start year";
//     }

//     // End month validation - Can't be before start month if in the same year
//     if (
//       formData.endYear &&
//       formData.startYear &&
//       formData.endYear === formData.startYear &&
//       months.indexOf(formData.endMonth) < months.indexOf(formData.startMonth)
//     ) {
//       newErrors.endMonth = "End month can't be before the start month";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = () => {
//     if (validateForm()) {
//       onSave({ ...formData });
//       onClose();
//     }
//   };
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
//       <div className="bg-white w-[90%] sm:w-[500px] p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
//         {children}
//         {/* Start Date Selection */}
//         <label className="block font-medium mb-1">Start date</label>
//         <div className="flex gap-2 mb-3">
//           <select
//             name="startMonth"
//             value={formData.startMonth}
//             onChange={handleChange}
//             className="border p-2 w-1/2 rounded-md"
//           >
//             <option value="">Month</option>
//             {months.map((month, index) =>
//               formData.startYear == currentYear &&
//               index > currentMonthIndex ? null : (
//                 <option key={month} value={month}>
//                   {month}
//                 </option>
//               )
//             )}
//           </select>

//           <select
//             name="startYear"
//             value={formData.startYear}
//             onChange={handleChange}
//             className="border p-2 w-1/2 rounded-md"
//           >
//             <option value="">Year</option>
//             {startYears.map((year) => (
//               <option key={year} value={year}>
//                 {year}
//               </option>
//             ))}
//           </select>
//         </div>
//         {errors.startMonth && (
//           <p className="text-red-600 text-sm mb-3">{errors.startMonth}</p>
//         )}
//         {errors.startYear && (
//           <p className="text-red-600 text-sm mb-3">{errors.startYear}</p>
//         )}

//         {/* End Date Selection */}
//         <label className="block font-medium mb-1">End date (or expected)</label>

//         <div className="flex gap-2 mb-3">
//           <select
//             name="endMonth"
//             value={formData.endMonth}
//             onChange={handleChange}
//             className="border p-2 w-1/2 rounded-md"
//           >
//             <option value="">Month</option>
//             {months.map((month) => (
//               <option key={month} value={month}>
//                 {month}
//               </option>
//             ))}
//           </select>

//           <select
//             name="endYear"
//             value={formData.endYear}
//             onChange={handleChange}
//             className="border p-2 w-1/2 rounded-md"
//           >
//             <option value="">Year</option>
//             {endYears.map((year) => (
//               <option key={year} value={year}>
//                 {year}
//               </option>
//             ))}
//           </select>
//         </div>
//         {errors.endMonth && (
//           <p className="text-red-600 text-sm mb-3">{errors.endMonth}</p>
//         )}
//         {errors.endYear && (
//           <p className="text-red-600 text-sm mb-3">{errors.endYear}</p>
//         )}
//         {/* Buttons */}

//         <div className="flex justify-end gap-2 mt-4">
//           <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 bg-blue-500 text-white rounded"
//             onClick={handleSubmit}
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default GenericModal;
