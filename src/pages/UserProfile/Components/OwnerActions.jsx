import React from "react";

function OwnerActions({ onAdd, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      {onAdd && (
        <button
          className="w-8 h-8 bg-gray-100 rounded-full hover:text-blue-700 p-1"
          onClick={onAdd}
        >
          +
        </button>
      )}
      {onEdit && (
        <button
          className="w-8 h-8 text-gray-500 bg-transparent hover:text-blue-700 p-1"
          onClick={onEdit}
        >
          ✎
        </button>
      )}
      {onDelete && (
        <button
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
