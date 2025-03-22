import React from 'react';

const DeletePostModal = ({
    closeModal,
    deleteFunc,
    commentOrPost
}) => {
    
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Delete Post
          </h3>
          <p className="text-gray-600">
            Are you sure you want to delete this {commentOrPost === "Post" ? "post" : "comment"}?
          </p>
        </div>
        
        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button 
            onClick={closeModal}
            className="px-4 py-2 rounded font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={deleteFunc}
            className="px-4 py-2 rounded font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePostModal;