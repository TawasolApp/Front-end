import React, { useState } from "react";
import GenericCard2 from "./GenericCard2";
import { useNavigate } from "react-router-dom";
import GenericModal2 from "./GenericModal2";

function GenericPage2({ title, type, items, isOwner }) {
  const navigate = useNavigate();
  const [data, setData] = useState(items); // Store and update data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);

  // Open Add Modal
  const handleAdd = () => {
    setEditIndex(null);
    setEditData(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleEdit = (item, index) => {
    setEditIndex(index);
    setEditData(item);
    setIsModalOpen(true);
  };

  // Save or update
  const handleSave = (updatedItem) => {
    setData(
      (prevData) =>
        editIndex !== null
          ? prevData.map((item, i) => (i === editIndex ? updatedItem : item)) // Update item
          : [...prevData, updatedItem] // Add new item
    );
    setIsModalOpen(false);
  };
  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-md w-full max-w-3xl mx-auto">
      {/* Back button  */}
      <div className="flex items-center justify-between mb-4">
        {/* Back Button & Title */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center text-xl rounded-full hover:bg-gray-200 transition"
          >
            ←
          </button>
          <h2 className="text-2xl font-semibold">All {title}</h2>
        </div>

        {/*Add Button */}
        <div className="flex items-center gap-4">
          {isOwner && (
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
              onClick={handleAdd}
            >
              +
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1">
        {data.map((item, index) => (
          <GenericCard2
            key={index}
            item={item}
            isOwner={isOwner}
            type={type}
            onEdit={() => handleEdit(item, index)} // Pass the edit function
            showEditIcons={true} // Hide edit and delete icons in GenericSection2
          />
        ))}
      </div>

      {/*  Render Modal only once, outside the map() */}
      {isModalOpen && (
        <GenericModal2
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onDelete={handleDelete} // Pass onDelete here
          type={type}
          initialData={editData || {}} // ✅ Pass the correct initial data
        />
      )}
    </div>
  );
}

export default GenericPage2;
