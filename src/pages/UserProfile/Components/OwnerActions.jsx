import React from "react";
/// will be used for about/profile pic and cover photo
function OwnerActions({ onAdd, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      {onAdd && (
        <button
          aria-label="add"
          className="w-8 h-8 bg-gray-100 rounded-full hover:text-blue-700 p-1"
          onClick={onAdd}
        >
          +
        </button>
      )}
      {onEdit && (
        <button
          aria-label="edit"
          className="w-8 h-8 text-gray-500 bg-transparent hover:text-blue-700 p-1"
          onClick={onEdit}
        >
          ✎
        </button>
      )}
      {onDelete && (
        <button
          aria-label="delete"
          className="w-8 h-8 bg-transparent hover:text-blue-700 p-1"
          onClick={onDelete}
        >
          🗑
        </button>
      )}
    </div>
  );
}

export default OwnerActions;
