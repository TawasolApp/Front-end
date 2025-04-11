import React from "react";
import { useEffect } from "react";
const UnfollowModal = ({ show, cancel, confirm }) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-modalbackground z-[999]">
      <div className="bg-boxbackground p-5 rounded-lg shadow-xl w-80 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 text-xl font-bold hover:text-gray-900 transition"
          onClick={cancel}
        >
          ✖
        </button>

        <h2 className="text-lg font-semibold text-text">
          Are you sure you want to unfollow?
        </h2>
        <p className="text-sm text-normaltext mt-2 pt-2 border-t-1 border-gray-200 border-b-1 pb-2">
          You’ll no longer receive notifications from this Page, and you won’t
          see its updates in your feed.
        </p>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="px-4 border border-blue-700 text-blue-700 rounded-full hover:border-2 bg-postsbuttoncolor py-2"
            aria-label="Close Unfollow"
            onClick={cancel} //call function to close modal
          >
            Cancel
          </button>
          <button
            className="px-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 py-2"
            aria-label="Confirm Unfollow"
            onClick={confirm} //call function to unfollow and close modal
          >
            Unfollow
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnfollowModal;
