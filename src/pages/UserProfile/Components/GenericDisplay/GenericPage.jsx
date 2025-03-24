import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import GenericCard from "./GenericCard";
import GenericModal from "./GenericModal";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function GenericPage({ title, type }) {
  const navigate = useNavigate();
  const { user, isOwner } = useOutletContext();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Track saving status

  // Load data on mount
  useEffect(() => {
    if (user && user[type]) {
      setData(user[type]);
    }
  }, [user, type]);

  const handleAdd = () => {
    setEditIndex(null);
    setEditData(null);
    setEditMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (item, index) => {
    setEditIndex(index);
    setEditData(item);
    setEditMode(true);
    setIsModalOpen(true);
  };
  ////saving and deleting on Ui only
  // const handleSave = (updatedItem) => {
  //   if (editIndex !== null) {
  //     const updated = data.map((item, i) =>
  //       i === editIndex ? updatedItem : item
  //     );
  //     setData(updated);
  //   } else {
  //     setData([...data, updatedItem]);
  //   }
  //   closeModal();
  // };
  // const handleDelete = () => {
  //   if (editIndex !== null) {
  //     const updated = data.filter((_, i) => i !== editIndex);
  //     setData(updated);
  //   }
  //   closeModal();
  // };
  const handleSave = async (updatedItem) => {
    if (isSaving || !user?.id) return;
    setIsSaving(true);

    try {
      let response;

      if (editMode && editIndex !== null && data[editIndex]?.id) {
        const itemId = data[editIndex].id;

        // Send PATCH to server
        response = await axios.patch(
          `http://localhost:5000/profile/${user.id}/${type}/${itemId}`,
          updatedItem
        );

        // Update local UI state
        const updated = [...data];
        updated[editIndex] = response.data;
        setData(updated);
      } else {
        const itemWithId = { ...updatedItem, id: uuidv4() };

        // Send POST to server
        await axios.post(
          `http://localhost:5000/profile/${user.id}/${type}`,
          itemWithId
        );

        // Update UI
        setData([...data, itemWithId]);
      }
    } catch (err) {
      console.error("Failed to save item:", err);
    }

    setIsSaving(false);
    closeModal();
  };

  const handleDelete = async () => {
    if (!user?.id || editIndex === null || !data[editIndex]?.id) return;

    const itemId = data[editIndex].id;

    try {
      await axios.delete(
        `http://localhost:5000/profile/${user.id}/${type}/${itemId}`
      );
      const updatedData = data.filter((_, i) => i !== editIndex);
      setData(updatedData);
    } catch (err) {
      console.error("Failed to delete item:", err);
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
        editMode={editIndex !== null} //  add or edit
      />
    );
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-md w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center text-xl rounded-full hover:bg-gray-200 transition"
          >
            ←
          </button>
          <h2 className="text-2xl font-semibold">All {title}</h2>
        </div>

        {isOwner && (
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
            onClick={handleAdd}
          >
            +
          </button>
        )}
      </div>

      {/* Card List */}
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="relative group">
            <GenericCard
              item={item}
              type={type}
              isOwner={isOwner}
              showEditIcons={false}
            />
            {isOwner && (
              <button
                onClick={() => handleEdit(item, index)}
                className="absolute top-2 right-2 text-gray-500 hover:text-blue-700 p-1  group-hover:visible"
              >
                ✎
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {renderModal()}
    </div>
  );
}

export default GenericPage;
