import React, { useState, useEffect } from "react";
import GenericCard from "./GenericCard";
import GenericModal from "./GenericModal";
import { useNavigate } from "react-router-dom";
import { axiosInstance as axios } from "../../../../apis/axios.js";
// import LoadingPage from "../../../LoadingScreen/LoadingPage.jsx";
const singularMap = {
  skills: "skill",
  certification: "certification",
  education: "education",
  workExperience: "experience",
};

const endpointMap = {
  skills: "skills",
  certification: "certification",
  education: "education",
  workExperience: "work-experience",
};

function GenericSection({ title, type, items, isOwner, user, onUserUpdate }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setData(items || []);
  }, [items]);

  if (!isOwner && (!items || items.length === 0)) return null;

  const handleAdd = () => {
    setEditIndex(null);
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    navigate(`${type.toLowerCase()}`);
  };

  const handleSave = async (newItem) => {
    if (isSaving || !user?._id) return;
    setIsSaving(true);

    try {
      const endpoint = `/profile/${endpointMap[type]}`;
      const response = await axios.post(endpoint, newItem);

      if (response?.data) {
        const newKey =
          type === "skills" ? response.data.skillName : response.data._id;
        const exists = data.some((item) =>
          type === "skills" ? item.skillName === newKey : item._id === newKey
        );

        if (!exists) {
          setData((prev) => [...prev, response.data]);
        }

        const updatedUser = await axios.get(`/profile/${user._id}`);
        onUserUpdate?.(updatedUser.data);
      }
    } catch (err) {
      console.error("❌ Failed to save item:", err);
      if (err.response) {
        console.log("🧨 Error:", err.response.data.message?.join(", "));
      } else {
        console.log("❌ Network error or no server response.");
      }
    } finally {
      setIsSaving(false);
      closeModal();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditIndex(null);
    setTimeout(() => setEditData(null), 300);
  };

  const renderModal = () => (
    <GenericModal
      isOpen={isModalOpen}
      onClose={closeModal}
      onSave={handleSave}
      onDelete={undefined}
      initialData={editData || {}}
      type={type}
      editMode={editIndex !== null}
    />
  );
  // if (isSaving) return <LoadingPage />;

  return (
    <div className="bg-boxbackground p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-2">
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

      {data.length === 0 && isOwner && (
        <div className="text-text2 italic mb-4 text-center">
          No {title.toLowerCase()} added yet. Click + to add your first{" "}
          {singularMap[type] || type}.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {data.slice(0, 2).map((item, index) => (
          <div key={type === "skills" ? item.skillName : item._id || index}>
            <GenericCard
              item={item}
              type={type}
              isOwner={isOwner}
              showEditIcons={false}
              user={user}
              connectionStatus={user.status}
            />
          </div>
        ))}
      </div>

      {data.length > 2 && (
        <button
          onClick={() => navigate(`${type.toLowerCase()}`)}
          className="w-full mt-4 text-text hover:underline text-center block font-medium pb-4"
        >
          Show all {data.length} {type.toLowerCase()} records →
        </button>
      )}

      {renderModal()}
    </div>
  );
}

export default GenericSection;
