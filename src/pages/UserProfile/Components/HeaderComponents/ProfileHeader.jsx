import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CoverPhoto from "./CoverPhoto";
import ProfilePicture from "./ProfilePicture";
import defaultProfilePicture from "../../../../assets/images/defaultProfilePicture.png";
import defaultCoverPhoto from "../../../../assets/images/defaultCoverPhoto.png";
import EditProfileModal from "./EditProfileModal";
import ImageUploadModal from "./ImageUploadModal";
import ImageEnlarge from "./ImageEnlarge";
import ViewerView from "./ViewerView";
import ContactInfoModal from "./ContactInfoModal";
import VisibilityModal from "./VisibilityModal";
import { axiosInstance as axios } from "../../../../apis/axios.js";

function ProfileHeader({
  user,
  isOwner,
  onSave,
  experienceRef,
  educationRef,
  isVisible,
}) {
  const [editedUser, setEditedUser] = useState(user);
  const [isEditProfileOpen, setIsEditing] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState(null);
  const navigate = useNavigate();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false);
  const { userId } = useSelector((state) => state.authentication);
  const viewerId = userId;
  if (!editedUser) return null;
  console.log("editedUser", editedUser, "viewerId", viewerId);
  const experienceIndex = editedUser.selectedExperienceIndex ?? 0;
  const educationIndex = editedUser.selectedEducationIndex ?? 0;

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  // upload modal to upload profile picture or cover photo
  function openUploadModal(type) {
    setUploadType(type);
    setIsUploadOpen(true);
  }
  async function handleUpload(fileOrNull) {
    const field = uploadType === "profile" ? "profilePicture" : "coverPhoto";
    const deleteEndpoint =
      uploadType === "profile"
        ? "/profile/profile-picture"
        : "/profile/cover-photo";

    if (fileOrNull === null) {
      try {
        await axios.delete(deleteEndpoint);

        // Set local UI to default (empty string)
        setEditedUser((prev) => ({ ...prev, [field]: "" }));
      } catch (err) {
        console.error(` Failed to delete ${field}:`, err);
      }
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", fileOrNull);

      const uploadRes = await axios.post("/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = uploadRes.data.url;

      await axios.patch(`/profile`, { [field]: imageUrl });

      setEditedUser((prev) => ({ ...prev, [field]: imageUrl }));
    } catch (err) {
      console.error(` Failed to upload ${field}:`, err);
    }
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
    <div className="w-full bg-boxbackground rounded-md shadow max-w-3xl mx-auto mb-2 relative">
      <div className="relative">
        <CoverPhoto
          backgroundImage={editedUser.coverPhoto || defaultCoverPhoto}
          isOwner={isOwner}
          onImageClick={handleImageClick}
          onUpload={() => openUploadModal("cover")}
        />
        {isOwner && (
          <button
            className="text-text absolute w-8 h-8 top-35 right-8  p-1 rounded-full hover:bg-sliderbutton"
            onClick={() => setIsEditing(true)}
          >
            ✎
          </button>
        )}
        {/* 3 dots  */}
        {isOwner && (
          <div className=" text-text absolute right-0 top-35 z-10 ">
            <button
              className="w-8 h-8 rounded-full font-bold hover:bg-sliderbutton flex items-center justify-center text-l"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ⋮
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-boxbackgroun border rounded shadow z-50">
                <button
                  className="text-w-full right-8 text-left px-4 py-2 text-sm text-normaltext hover:font-semibold"
                  onClick={() => {
                    setIsVisibilityModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Edit profile visibility
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-start px-6 -mt-14 sm:-mt-16">
        <ProfilePicture
          profilePictureSrc={editedUser.profilePicture || defaultProfilePicture}
          isOwner={isOwner}
          onImageClick={handleImageClick}
          onUpload={() => openUploadModal("profile")}
        />
      </div>

      <div className="px-6 pt-4">
        <h1 className="text-xl font-bold text-text flex items-center gap-2">
          {editedUser.firstName} {editedUser.lastName}
        </h1>
        {isVisible && (
          <>
            <p className="text-sm text-normaltext">{editedUser.headline}</p>
            <p className="text-sm text-normaltext">
              {editedUser.location} ·{" "}
              <span
                className="text-blue-700 font-semibold cursor-pointer hover:underline"
                onClick={() => setIsContactOpen(true)}
              >
                Contact info
              </span>
            </p>
            <p
              className="text-blue-600 text-sm cursor-pointer hover:underline mt-1"
              onClick={() => navigate("/connections")}
            >
              {editedUser.connectionCount} connections
            </p>
          </>
        )}
      </div>
      {/* 3 dots menu */}
      {isVisible && (
        <>
          <div className="px-6 pt-2 pb-4 text-left space-y-1 text-sm">
            <p
              className="text-companyheader cursor-pointer hover:text-blue-500 hover:underline"
              onClick={() => scrollToSection(experienceRef)}
            >
              {editedUser.workExperience?.[experienceIndex]?.title}
            </p>
            <p
              className="text-companyheader cursor-pointer hover:text-blue-500 hover:underline"
              onClick={() => scrollToSection(educationRef)}
            >
              {editedUser.education?.[educationIndex]?.school}
            </p>
          </div>
        </>
      )}

      {!isOwner && (
        <div className="px-6 pb-4 pt-2">
          <ViewerView
            user={editedUser}
            viewerId={viewerId}
            // initialStatus={editedUser.status}
            initialConnectStatus={editedUser.connectStatus}
            initialFollowStatus={editedUser.followStatus}
          />
        </div>
      )}

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
          uploadType === "profile"
            ? editedUser.profilePicture
            : editedUser.coverPhoto
        }
        defaultImage={
          uploadType === "profile" ? defaultProfilePicture : defaultCoverPhoto
        }
        uploadType={uploadType}
        userId={user._id}
      />
      <EditProfileModal
        user={editedUser}
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
      />
      <ContactInfoModal
        user={editedUser}
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        isOwner={isOwner}
        onSave={(updatedFields) => {
          const updatedUser = { ...editedUser, ...updatedFields };
          setEditedUser(updatedUser);
          onSave?.(updatedUser);
          axios.patch(`/profile`, updatedFields);
        }}
      />
      <VisibilityModal
        isOpen={isVisibilityModalOpen}
        onClose={() => setIsVisibilityModalOpen(false)}
        currentVisibility={editedUser.visibility}
        onSave={async (newVisibility) => {
          try {
            await axios.patch("/profile", { visibility: newVisibility });
            const updated = { ...editedUser, visibility: newVisibility };
            setEditedUser(updated);
            onSave?.(updated);
            setIsVisibilityModalOpen(false);
          } catch (err) {
            console.error("Failed to update visibility", err);
          }
        }}
      />
    </div>
  );
}

export default ProfileHeader;
