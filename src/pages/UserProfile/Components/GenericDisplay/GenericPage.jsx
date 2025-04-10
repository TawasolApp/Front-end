import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import GenericCard from "./GenericCard";
import GenericModal from "./GenericModal";
// import LoadingPage from "../../../LoadingScreen/LoadingPage.jsx";
import { axiosInstance as axios } from "../../../../apis/axios.js";

// Map for endpoint base path
const endpointMap = {
  skills: "skills",
  education: "education",
  certification: "certification",
  workExperience: "work-experience",
};
function GenericPage({ title, type }) {
  const navigate = useNavigate();
  const { user, isOwner, onUserUpdate } = useOutletContext();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Track saving status
  console.log("user in generic page", user);
  useEffect(() => {
    if (user && user[type]) {
      setData(user[type]);
    }
  }, [user?.[type]]);
  // if (isSaving) {
  //   return (
  //     <div className="flex justify-center items-center p-8">
  //       <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
  //       <span className="ml-3 text-sm text-text">Saving...</span>
  //     </div>
  //   );
  // }

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
    if (isSaving || !user?._id) return;
    setIsSaving(true);

    try {
      let response;

      //  PATCH — Edit existing item (uses id)
      if (editMode && editIndex !== null && data[editIndex]) {
        let originalKey =
          type === "skills" ? data[editIndex].skillName : data[editIndex]._id;

        if (type === "skills") {
          updatedItem.skillName = originalKey; // prevent renaming
        }

        response = await axios.patch(
          `/profile/${endpointMap[type]}/${originalKey}`,
          updatedItem
        );
        //  faster
        // const updated = [...data];
        // updated[editIndex] = response.data;
        // setData(updated);

        // safer as replace only the updated item
        setData((prev) =>
          prev.map((item) => {
            const itemKey = type === "skills" ? item.skillName : item._id;
            return itemKey === originalKey ? response.data : item;
          })
        );
      }

      // POST (Add)
      else {
        response = await axios.post(
          `/profile/${endpointMap[type]}`,
          updatedItem
        );
        console.log("🧾 response.data after POST:", response.data);

        if (!response?.data) throw new Error("No data from backend");

        const newKey =
          type === "skills" ? response.data.skillName : response.data._id;
        const exists = data.some((item) =>
          type === "skills" ? item.skillName === newKey : item._id === newKey
        );

        if (!exists) {
          setData((prev) => [...prev, response.data]);
        }
      }
      closeModal();

      //  Refresh the global user
      const refreshed = await axios.get(`/profile/${user._id}`);
      onUserUpdate?.(refreshed.data);
    } catch (err) {
      console.error("Failed to save item:", err);
    } finally {
      //finally happen no matter what: even if: The API fails PATCH/POST throws an error or return early
      setIsSaving(false);
    }
  };
  const handleDelete = async () => {
    if (editIndex === null || !data[editIndex]) return;
    setIsSaving(true); //  Start the loading spinner

    const itemId =
      type === "skills" ? data[editIndex].skillName : data[editIndex]._id;

    try {
      await axios.delete(`/profile/${endpointMap[type]}/${itemId}`);
      setData((prev) => prev.filter((_, i) => i !== editIndex));

      closeModal();

      //  Refresh the global user
      const refreshed = await axios.get(`/profile/${user._id}`);
      onUserUpdate?.(refreshed.data);
    } catch (err) {
      console.error("Failed to delete item:", err);
    } finally {
      setIsSaving(false); // Stop the spinner
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditIndex(null);
    setEditMode(false);
    // Delay clearing editData so modal doesn't flicker empty
    setTimeout(() => {
      setEditData(null);
    }, 50); // delay matches the modal transition (adjust if needed)
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
    <>
      {isSaving && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-60 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="ml-3 text-text text-lg font-medium">Saving...</span>
        </div>
      )}
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
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-transition text-text"
              onClick={handleAdd}
            >
              +
            </button>
          )}
        </div>

        {/* Card List */}
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={
                type === "skills"
                  ? (item.skillName ?? `skillName-${index}`)
                  : (item._id ?? index)
              }
              className="relative group"
            >
              <GenericCard
                item={item}
                type={type}
                isOwner={isOwner}
                showEditIcons={false}
                user={user}
                connectionStatus={user.status}
              />
              {isOwner && (
                <button
                  onClick={() => handleEdit(item, index)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-blue-700 p-1 group-hover:visible"
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
    </>
  );
}

export default GenericPage;
