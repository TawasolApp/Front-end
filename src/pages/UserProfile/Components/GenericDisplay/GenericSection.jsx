import React, { useState } from "react";
import GenericCard from "./GenericCard";
import GenericModal from "./GenericModal";
import { useNavigate } from "react-router-dom";
import { axiosInstance as axios } from "../../../../apis/axios.js";
//to generate unique id
function GenericSection({ title, type, items, isOwner, user }) {
  const navigate = useNavigate();
  const [data, setData] = useState(items || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Track saving status

  //  Add new
  const handleAdd = () => {
    setEditIndex(null);
    setEditData(null);
    setEditMode(false);
    setIsModalOpen(true);
  };

  //  Edit : maps to page where we can edit
  const handleEdit = () => {
    navigate(`${type.toLowerCase()}`);
  };

  const handleSave = async (newItem) => {
    if (isSaving || !user?.id) return; // Prevent multiple saves
    setIsSaving(true);

    try {
      const response = await axios.post(`/profile/${user.id}/${type}`, newItem);

      if (response?.data) {
        setData((prev) => [...prev, response.data]);
      }
    } catch (err) {
      console.error("Failed to save item:", err); // ✅ Add this line
    } finally {
      setIsSaving(false);

      closeModal();
    }
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
        onDelete={undefined}
        initialData={editData || {}}
        type={type}
        editMode={editIndex !== null} //  Add or edit
      />
    );
  };

  return (
    <div className="bg-boxbackground p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-8">
      {/* Header row */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-text">{title}</h2>
        {isOwner && (
          <div className="flex gap-0">
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition text-text"
              onClick={handleAdd}
            >
              +
            </button>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition text-text"
              onClick={handleEdit}
            >
              ✎
            </button>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4">
        {data.slice(0, 2).map((item, index) => (
          <div key={item.id ?? index}>
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
          className="w-full mt-4 text-text hover:underline text-center block font-medium pb-4"
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
