// ✅ GenericSection.jsx
import React, { useState } from "react";
import GenericCard from "./GenericCard";
import EducationModal from "../EducationModal";
import ExperienceModal from "../ExperienceModal";
import CertificationsModal from "../CertificationsModal";
import SkillsModal from "../SkillsModal";
import { useNavigate, useParams } from "react-router-dom";

function GenericSection({ title, type, items, isOwner }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dataList, setDataList] = useState(items);
  const [editIndex, setEditIndex] = useState(null);
  const { profileSlug } = useParams();
  console.log("generiicccc", profileSlug);
  //handler for add and edit modals
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
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        {isOwner && (
          <button onClick={() => openModal()} className="text-blue-600">
            + Add
          </button>
        )}
      </div>
      <div className="space-y-4">
        {dataList.slice(0, 2).map((item, index) => (
          <GenericCard
            key={index}
            data={item}
            type={type}
            isOwner={isOwner}
            onEdit={() => openModal(item, index)}
          />
        ))}
        {dataList.length > 2 && (
          <button
            onClick={() => {
              console.log("edit clicked");

              navigate(`${type.toLowerCase()}`, {
                state: { items: dataList },
              });
            }}
            className="text-blue-500 hover:underline text-sm"
          >
            See more
          </button>
        )}
      </div>
      {renderModal()}
    </div>
  );
}

export default GenericSection;
