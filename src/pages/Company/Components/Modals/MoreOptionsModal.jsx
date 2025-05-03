import React from "react";
import { FiLink, FiPlusCircle } from "react-icons/fi";
import { toast } from "react-toastify";
const MoreOptionsModal = ({ show, onClose, navigate }) => {
  if (!show) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-56 bg-boxbackground shadow-lg rounded-lg overflow-hidden z-[999]">
      <ul className="text-sm">
        <li
          className="hover:font-bold cursor-pointer px-4 py-2 flex items-center gap-2 font-semibold text-text"
          data-testid="send-message"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(window.location.href);
              toast.success("Page link copied to clipboard!");
            } catch (err) {
              toast.error("Failed to copy link.");
              console.error("Clipboard error:", err);
            } finally {
              onClose();
            }
          }}
        >
          <FiLink size={16} /> Share Page
        </li>

        <li
          className="hover:underline hover:font-semibold cursor-pointer px-4 py-2 flex items-center gap-2 font-semibold text-text"
          data-testid="create-page"
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
