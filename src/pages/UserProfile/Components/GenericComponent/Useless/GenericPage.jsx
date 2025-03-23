import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import GenericCard from "./GenericCard";
import EducationModal from "../EducationModal";
import ExperienceModal from "../ExperienceModal";
import CertificationsModal from "../CertificationsModal";
import SkillsModal from "../SkillsModal";

function GenericPage({ type, title }) {
  const { user, isOwner } = useOutletContext(); // ✅ get user & isOwner from ProfilePage
  const [dataList, setDataList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  // Set dataList from user[type] once user is loaded
  useEffect(() => {
    if (user && user[type]) {
      setDataList(user[type]);
    }
  }, [user, type]);

  const openModal = (item = {}, index = null) => {
    setSelectedItem(item);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setEditIndex(null);
  };

  const handleSave = (updatedItem) => {
    let updatedItems;
    if (editIndex !== null) {
      updatedItems = dataList.map((item, i) =>
        i === editIndex ? updatedItem : item
      );
    } else {
      updatedItems = [...dataList, updatedItem];
    }
    setDataList(updatedItems);
    handleClose();
  };

  const renderModal = () => {
    const modalProps = {
      isOpen: isModalOpen,
      onClose: handleClose,
      onSave: handleSave,
      initialData: selectedItem || {},
    };

    switch (type) {
      case "education":
        return <EducationModal {...modalProps} />;
      case "experience":
        return <ExperienceModal {...modalProps} />;
      case "certifications":
        return <CertificationsModal {...modalProps} />;
      case "skills":
        return <SkillsModal {...modalProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded-md shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-xl hover:text-blue-600"
          >
            ←
          </button>
          <h1 className="text-2xl font-semibold capitalize">All {title}</h1>
        </div>
        {isOwner && (
          <button
            onClick={() => openModal()}
            className="text-blue-600 font-medium"
          >
            + Add
          </button>
        )}
      </div>

      <div className="space-y-4">
        {dataList.map((item, index) => (
          <GenericCard
            key={index}
            data={item}
            type={type}
            isOwner={isOwner}
            onEdit={() => openModal(item, index)}
          />
        ))}
      </div>

      {renderModal()}
    </div>
  );
}

export default GenericPage;
