import React, { useState } from "react";
import GenericCard2 from "./GenericCard2";
import { useNavigate } from "react-router-dom";
import GenericModal2 from "./GenericModal2";

function GenericSection2({ title, type, items, isOwner }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(items);
  const [editIndex, setEditIndex] = useState(null); // Track the index of the item being edited
  const [editData, setEditData] = useState(null); // Track data to edit
  const [editMode, setEditMode] = useState(false); // Track whether it's add or edit

  // Add new item
  const handleAdd = () => {
    setEditIndex(null);
    setEditData(null);
    setIsModalOpen(true);
    setEditMode(false); // Set to false for add mode
  };

  // Edit existing item
  const handleEdit = (item, index) => {
    setEditIndex(index);
    setEditData(item);
    setIsModalOpen(true);
    setEditMode(true); // Set to true for edit mode
  };

  // // Save or update item
  const handleSave = (updatedItem) => {
    if (editIndex !== null) {
      // If editing, update existing item
      setData((prevData) =>
        prevData.map((item, i) => (i === editIndex ? updatedItem : item))
      );
    } else {
      // If adding new item, push to list
      setData((prevData) => [...prevData, updatedItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id)); // Remove from UI
    // onDelete(id); // Call API in future
  };
  return (
    <div className="bg-white p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>

        {isOwner && (
          <div className="flex gap-0">
            {/* Add Button (Opens Add Modal) */}
            <button
              className="w-8 h-8 bg-whilte-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
              onClick={handleAdd}
            >
              +
            </button>

            {/* Edit Button (Redirects to GenericPage2 for Editing) */}
            <button
              className="w-8 h-8 bg-white-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
              onClick={() => navigate(`/${type.toLowerCase()}`)}
            >
              ✎
            </button>
          </div>
        )}
      </div>

      {/* Display First 2 Items */}
      <div className="flex flex-col gap-4">
        {data.slice(0, 2).map((item, index) => (
          <GenericCard2
            key={index}
            item={item}
            isOwner={isOwner}
            type={type}
            onEdit={() => handleEdit(item, index)} // ✅ Ensure this works correctly
            showEditIcons={false} // Hide edit and delete icons in GenericSection2
          />
        ))}
      </div>

      {/* Show "Show all" button if more than 2 items exist */}
      {data.length > 2 && (
        <button
          onClick={() => navigate(`/${type.toLowerCase()}`)}
          className="w-full mt-4 text-black-500 hover:underline text-center block font-medium pb-4"
        >
          Show all {items.length} {type.toLowerCase()} records →
        </button>
      )}

      {/*  Render Add Modal ,, dont change ,, keep data in edit modal*/}
      {isModalOpen && (
        <GenericModal2
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onDelete={handleDelete} // ✅ New delete handler
          type={type}
          initialData={editData || {}} // Pass correct initial data
          editMode={editMode} // Pass editMode to the modal
        />
      )}
    </div>
  );
}

export default GenericSection2;
