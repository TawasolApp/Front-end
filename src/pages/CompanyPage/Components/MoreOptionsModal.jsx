import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMessageSquare, FiFlag, FiPlusCircle } from "react-icons/fi";
const MoreOptionsModal = ({ show, onClose, navigate }) => {
  if (!show) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden z-[999]">
      <ul className="text-sm">
        <li className="hover:bg-gray-100 cursor-pointer px-4 py-2 flex items-center gap-2">
          <FiMessageSquare size={16} /> Send in a message
        </li>
        <li className="hover:bg-gray-100 cursor-pointer px-4 py-2 flex items-center gap-2">
          <FiFlag size={16} /> Report abuse
        </li>
        <li
          className="hover:bg-gray-100 cursor-pointer px-4 py-2 flex items-center gap-2"
          onClick={() => {
            navigate("/company/setup/new");
            onClose(); // Close modal after navigation
          }}
        >
          <FiPlusCircle size={16} /> Create a Tawasol Page
        </li>
      </ul>
    </div>
  );
};

export default MoreOptionsModal;
