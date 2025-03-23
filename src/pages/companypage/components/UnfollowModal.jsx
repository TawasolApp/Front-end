import React from "react";
import { useEffect } from "react";
const Unfollowmodal = ({ show, cancel, confirm }) => {
  useEffect(() => {
    if (show) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [show]);
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200/60 z-[999]">
      <div className="bg-white p-5 rounded-lg shadow-xl w-80 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 text-xl font-bold hover:text-gray-900 transition"
          onClick={cancel}
        >
          ✖
        </button>

        <h2 className="text-lg font-semibold">Unfollow Page</h2>
        <p className="text-sm text-gray-600 mt-2 pt-2 border-t-1 border-gray-200 border-b-1 pb-2">
          You’ll no longer receive notifications from this Page, and you won’t
          see its updates in your feed.
        </p>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="px-4 border border-gray-400 text-gray-700 rounded-full hover:bg-gray-100"
            onClick={cancel} //call function to close modal
          >
            Cancel
          </button>
          <button
            className="px-4 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            onClick={confirm} //call function to unfollow and close modal
          >
            Unfollow
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unfollowmodal;
