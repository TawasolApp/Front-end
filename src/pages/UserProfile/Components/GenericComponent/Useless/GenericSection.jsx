import React, { useState } from "react";
import GenericCard from "./GenericCard";
import GenericModal from "../Useless/GenericModal";
import { useNavigate } from "react-router-dom";

function GenericSection({ title, type, items, isOwner }) {
  const navigate = useNavigate();
  const [data, setData] = useState(items);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // ➕ Add new
  const handleAdd = () => {
    setEditIndex(null);
    setEditData(null);
    setEditMode(false);
    setIsModalOpen(true);
  };

  // ✏ Edit existing
  const handleEdit = (item, index) => {
    setEditIndex(index);
    setEditData(item);
    setEditMode(true);
    setIsModalOpen(true);
  };

  // 💾 Save
  const handleSave = (updatedItem) => {
    if (editIndex !== null) {
      const updated = data.map((item, i) =>
        i === editIndex ? updatedItem : item
      );
      setData(updated);
    } else {
      setData([...data, updatedItem]);
    }
    closeModal();
  };

  // ❌ Delete
  const handleDelete = () => {
    if (editIndex !== null) {
      const updated = data.filter((_, i) => i !== editIndex);
      setData(updated);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
    setEditIndex(null);
    setEditMode(false);
  };

  const renderModal = () => {
    return (
      <GenericModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
        initialData={editData || {}}
        type={type}
        editMode={editIndex !== null} //  Add or edit
      />
    );
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-8">
      {/* Header row */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {isOwner && (
          <div className="flex gap-0">
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
              onClick={handleAdd}
            >
              +
            </button>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
              onClick={() => navigate(`${type.toLowerCase()}`)}
            >
              ✎
            </button>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4">
        {data.slice(0, 2).map((item, index) => (
          <div
            key={index}
            onClick={() => isOwner && handleEdit(item, index)}
            className={`cursor-${isOwner ? "pointer" : "default"}`}
          >
            <GenericCard
              item={item}
              type={type}
              isOwner={isOwner}
              showEditIcons={false}
            />
          </div>
        ))}
      </div>

      {/* Show more */}
      {data.length > 2 && (
        <button
          onClick={() => navigate(`${type.toLowerCase()}`)}
          className="w-full mt-4 text-black-500 hover:underline text-center block font-medium pb-4"
        >
          Show all {data.length} {type.toLowerCase()} records →
        </button>
      )}

      {/* Modal */}
      {renderModal()}
    </div>
  );
}

export default GenericSection;
