import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import GenericCard from "./GenericCard";
import GenericModal from "./GenericModal";
import { axiosInstance as axios } from "../../../../apis/axios.js";

function GenericPage({ title, type }) {
  const navigate = useNavigate();
  const { user, isOwner } = useOutletContext();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Track saving status
  // const [saveError, setSaveError] = useState(null); // if error in saving to show user a msg

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

  const handleSave = async (updatedItem) => {
    if (isSaving || !user?.id) return;
    setIsSaving(true);

    try {
      let response;

      //  PATCH — Edit existing item (uses id)
      if (editMode && editIndex !== null && data[editIndex]) {
        const itemId = data[editIndex].id;

        response = await axios.patch(
          `/profile/${user.id}/${type}/${itemId}`,
          updatedItem
        );
        //  faster
        // const updated = [...data];
        // updated[editIndex] = response.data;
        // setData(updated);

        // safer as replace only the updated item
        setData((prev) =>
          prev.map((item) =>
            item.id === response.data.id ? response.data : item
          )
        );
      }

      // POST — Add new item without sending id
      else {
        response = await axios.post(`/profile/${user.id}/${type}`, updatedItem);

        if (!response?.data) {
          throw new Error("❌ No data returned from backend");
        }

        setData((prev) => [...prev, response.data]);
      }
    } catch (err) {
      console.error("Failed to save item:", err);
    } finally {
      //finally happen no matter what: even if: The API fails PATCH/POST throws an error or return early
      setIsSaving(false);
      closeModal();
    }
  };

  const handleDelete = async () => {
    if (!user?.id || editIndex === null || !data[editIndex]?.id) return;

    const itemId = data[editIndex].id;

    try {
      await axios.delete(`/profile/${user.id}/${type}/${itemId}`);

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
    <div className="bg-boxbackground p-6 shadow-md rounded-md w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center text-xl rounded-full hover:bg-gray-200 transition text-text"
          >
            ←
          </button>
          <h2 className="text-2xl font-semibold text-text">All {title}</h2>
        </div>

        {isOwner && (
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition text-text"
            onClick={handleAdd}
          >
            +
          </button>
        )}
      </div>

      {/* Card List */}
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.id ?? index} className="relative group">
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
