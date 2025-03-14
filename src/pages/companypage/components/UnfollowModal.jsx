import React from "react";

const Unfollowmodal = ({ show, cancel, confirm }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200/60">
      <div className="bg-white p-5 rounded-lg shadow-xl w-80 relative">
        <button
          onClick={cancel}
          className="absolute top-4 right-6 text-gray-500 hover:text-gray-700 font-semibold text-lg"
        >
          X
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
