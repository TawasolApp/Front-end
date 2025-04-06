import React, { useState, useEffect } from "react";
import GenericCard from "./GenericCard";
import GenericModal from "./GenericModal";
import { useNavigate } from "react-router-dom";
import { axiosInstance as axios } from "../../../../apis/axios.js";

// Singular map for dynamic text like: "Add your first skill not skills "
const singularMap = {
  skills: "skill",
  certifications: "certification",
  education: "education",
  experience: "experience",
};

function GenericSection({ title, type, items, isOwner, user }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(items || []);
  }, [items]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Track saving status

  // Skip rendering for viewers if section is empty
  if (!isOwner && (!items || items.length === 0)) return null;

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
        const newKey =
          type === "skills" ? response.data.skill : response.data.id;
        const exists = data.some((item) =>
          type === "skills" ? item.skill === newKey : item.id === newKey
        );
        if (!exists) {
          setData((prev) => [...prev, response.data]);
        }
      }
    } catch (err) {
      console.error("Failed to save item:", err);
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
    <div className="bg-boxbackground p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-2">
      {/* Header row */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-text">{title}</h2>
        {/* show these icons if the owner is the one viewing the page  */}
        {isOwner && (
          <div className="flex gap-0">
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition text-text"
              onClick={handleAdd}
            >
              +
            </button>
            {/* show edit if only there is existing data */}
            {data.length > 0 && (
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition text-text"
                onClick={handleEdit}
              >
                ✎
              </button>
            )}
          </div>
        )}
      </div>

      {/* Empty message for owner */}

      {data.length === 0 && isOwner && (
        <div className="text-text2 italic mb-4 text-center">
          No {title.toLowerCase()} added yet. Click + to add your first{" "}
          {singularMap[type] || type}.{" "}
        </div>
      )}

      {/* Cards */}
      <div className="flex flex-col gap-4">
        {data.slice(0, 2).map((item, index) => (
          <div key={type === "skills" ? item.skill : (item.id ?? index)}>
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
