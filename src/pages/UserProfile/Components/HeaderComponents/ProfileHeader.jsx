import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ViewerView from "../ViewerView";
import ProfilePicture from "./ProfilePicture";
import CoverPhoto from "./CoverPhoto";
import EditProfileModal from "./EditProfileModal";
import ImageEnlarge from "./ImageEnlarge";
import ImageUploadModal from "../ImageUploadModal";
import defaultProfilePicture from "../../../../assets/images/defaultProfilePicture.png";
import defaultCoverPhoto from "../../../../assets/images/defaultCoverPhoto.png";
function ProfileHeader({ user, isOwner, onSave, experienceRef, educationRef }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState(null);
  const { profileSlug } = useParams();
  const experienceIndex = editedUser.selectedExperienceIndex ?? 0;
  const educationIndex = editedUser.selectedEducationIndex ?? 0;
  useEffect(() => {
    setEditedUser(user);
  }, [user]);
  function openEditModal() {
    setIsEditing(true);
  }
  function openUploadModal(type) {
    setUploadType(type);
    setIsUploadOpen(true);
  }
  function openEditModal() {
    // console.log(" Opening edit modal");

    setIsEditing(true);
  }

  function handleUpload(imageUrl) {
    setEditedUser((prevUser) => ({
      ...prevUser,
      [uploadType === "profile" ? "profilePicture" : "backgroundImage"]:
        imageUrl,
    }));
    setIsUploadOpen(false);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }
  function handleImageClick(imageUrl) {
    setEnlargedImage(imageUrl); // Set image to enlarge
  }
  function saveProfileChanges(updatedUser) {
    setIsEditing(false);
    setEditedUser(updatedUser);
    onSave?.(updatedUser); // only if onSave is passed
  }
  // Scroll to section function
  function scrollToSection(ref) {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }
  if (!editedUser) return null;

  return (
    <div className="bg-white py-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-4 pt-0">
      {/* Cover Photo Component */}
      <div className="relative w-full h-64 rounded-md overflow-hidden pb-0">
        {/* Cover Photo */}
        <CoverPhoto
          backgroundImage={editedUser.coverPhoto || defaultCoverPhoto}
          isOwner={isOwner}
          className="w-full h-full object-cover rounded-md"
          onImageClick={handleImageClick}
          onUpload={() => openUploadModal("cover")}
        />

        {/* Profile Picture (Centered & Fully Visible) */}
        <div className="absolute left-20 ml-4 transform -translate-x-1/2 -top-2 sm:top-24 border-4 border-white rounded-full shadow-lg bg-white mb-0">
          <ProfilePicture
            profilePictureSrc={
              editedUser.profilePicture || defaultProfilePicture
            }
            isOwner={isOwner}
            onImageClick={handleImageClick}
            onUpload={() => openUploadModal("profile")}
          />
        </div>
      </div>
      {/* Enlarged Image Modal (Global) */}
      {enlargedImage && (
        <ImageEnlarge
          profilePicture={enlargedImage}
          isOpen={!!enlargedImage}
          onClose={() => setEnlargedImage(null)}
        />
      )}
      {/* Upload Modal (Global) */}
      <ImageUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />
      {/* User Info & Experience  */}
      <div className="flex flex-col sm:flex-row justify-between items-start px-6 mt-0 gap-4">
        <div className="sm:w-3/5 text-left">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {editedUser.firstName} {editedUser.lastName}
          </h1>
          <p className="text-black-600 text-lg">{editedUser.bio}</p>
          <div className="flex items-center text-sm text-gray-500">
            <p className="text-sm text-gray-700">
              {editedUser.country}, {editedUser.city || "N/A"}
            </p>
            <span className="mx-1">·</span>
            <p>Contact Info</p>
          </div>

          {/*  Connections Count */}
          <p
            className="text-blue-600 cursor-pointer hover:underline mb-0"
            onClick={() => navigate(`connections`)}
          >
            {editedUser.connectionCount} connections
          </p>
        </div>

        {/*  Experience & Education Section */}
        <div className="relative sm:w-2/5 text-right pr-6">
          {isOwner && (
            <button
              className="absolute right-0 top-0 bg-white w-8 h-8 flex items-center justify-center rounded-full shadow-md border cursor-pointer hover:bg-gray-100 -top-14"
              onClick={openEditModal}
            >
              ✎
            </button>
          )}
          <p
            className="text-sm text-gray-600 cursor-pointer hover:text-blue-500 hover:underline pt-9"
            onClick={() => scrollToSection(experienceRef)}
          >
            {editedUser.experience?.[experienceIndex]?.title}
          </p>
          <p
            className="text-sm text-gray-600  cursor-pointer  hover:text-blue-500 hover:underline"
            onClick={() => scrollToSection(educationRef)}
          >
            {editedUser.education?.[educationIndex]?.institution}{" "}
          </p>
        </div>
      </div>

      {/* Viewer View */}
      <div className="mt-4 flex gap-3 pb-4">
        {!isOwner ? <ViewerView user={editedUser} /> : null}
      </div>

      {/*  Edit Profile Modal  */}
      <EditProfileModal
        user={editedUser}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={saveProfileChanges}
        // onChange={handleInputChange}
      />
    </div>
  );
}

export default ProfileHeader;
