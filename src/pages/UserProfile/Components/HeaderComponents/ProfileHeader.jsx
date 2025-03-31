import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CoverPhoto from "./CoverPhoto";
import ProfilePicture from "./ProfilePicture";
import defaultProfilePicture from "../../../../assets/images/defaultProfilePicture.png";
import defaultCoverPhoto from "../../../../assets/images/defaultCoverPhoto.png";
import EditProfileModal from "./EditProfileModal";
import ImageUploadModal from "../ImageUploadModal";
import ImageEnlarge from "./ImageEnlarge";
import ViewerView from "../ViewerView";

function ProfileHeader({ user, isOwner, onSave, experienceRef, educationRef }) {
  const [editedUser, setEditedUser] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState(null);
  const navigate = useNavigate();
  const { profileSlug } = useParams();
  if (!editedUser) return null;

  const experienceIndex = editedUser.selectedExperienceIndex ?? 0;
  const educationIndex = editedUser.selectedEducationIndex ?? 0;

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  function openUploadModal(type) {
    setUploadType(type);
    setIsUploadOpen(true);
  }

  function handleUpload(imageUrl) {
    setEditedUser((prev) => ({
      ...prev,
      [uploadType === "profile" ? "profilePicture" : "coverPhoto"]: imageUrl,
    }));
    setIsUploadOpen(false);
  }

  function handleImageClick(imageUrl) {
    setEnlargedImage(imageUrl);
  }

  function handleSave(updatedUser) {
    setEditedUser(updatedUser);
    setIsEditing(false);
    onSave?.(updatedUser);
  }

  function scrollToSection(ref) {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="w-full bg-boxbackground rounded-md shadow max-w-3xl mx-auto mb-8 relative">
      {/* Cover Photo */}
      <div className="relative">
        <CoverPhoto
          backgroundImage={editedUser.coverPhoto || defaultCoverPhoto}
          isOwner={isOwner}
          onImageClick={handleImageClick}
          onUpload={() => openUploadModal("cover")}
        />

        {/* Edit Button over cover */}
        {isOwner && (
          <button
            className="absolute w-8 h-8 top-35 right-6 bg-white p-1 rounded-full  hover:bg-gray-200"
            onClick={() => setIsEditing(true)}
          >
            ✎
          </button>
        )}
      </div>

      {/* Profile Picture - overlapping */}
      <div className="flex justify-start px-6 -mt-14 sm:-mt-16">
        <ProfilePicture
          profilePictureSrc={editedUser.profilePicture || defaultProfilePicture}
          isOwner={isOwner}
          onImageClick={handleImageClick}
          onUpload={() => openUploadModal("profile")}
        />
      </div>

      {/* Name and Details */}
      <div className="px-6 pt-4">
        <h1 className="text-xl font-bold text-text flex items-center gap-2">
          {editedUser.firstName} {editedUser.lastName}
        </h1>
        <p className="text-sm text-gray-600">Student at Cairo University</p>
        <p className="text-sm text-gray-600">
          {editedUser.city}, {editedUser.country} ·{" "}
          <span className="text-gray-600 cursor-pointer">Contact info</span>
        </p>
        <p
          className="text-blue-600 text-sm cursor-pointer hover:underline mt-1"
          onClick={() => navigate("connections")}
        >
          {editedUser.connectionCount} connections
        </p>
      </div>

      {/* Experience & Education Tags */}
      <div className="px-6 pt-2 pb-4 text-left space-y-1 text-sm">
        <p
          className="text-companyheader2 cursor-pointer hover:text-blue-500 hover:underline"
          onClick={() => scrollToSection(experienceRef)}
        >
          {editedUser.experience?.[experienceIndex]?.title}
        </p>
        <p
          className="text-companyheader2 cursor-pointer hover:text-blue-500 hover:underline"
          onClick={() => scrollToSection(educationRef)}
        >
          {editedUser.education?.[educationIndex]?.institution}
        </p>
      </div>

      {/* Viewer View */}
      {!isOwner && (
        <div className="px-6 pb-4 pt-2">
          <ViewerView user={editedUser} />
        </div>
      )}

      {/* Modals */}
      {enlargedImage && (
        <ImageEnlarge
          profilePicture={enlargedImage}
          isOpen={!!enlargedImage}
          onClose={() => setEnlargedImage(null)}
        />
      )}
      <ImageUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
        currentImage={
          uploadType === "profile" ? user.profilePicture : user.coverPhoto
        }
        defaultImage={
          uploadType === "profile" ? defaultProfilePicture : defaultCoverPhoto
        }
        uploadType={uploadType}
        userId={user.id}
      />
      <EditProfileModal
        user={editedUser}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default ProfileHeader;
