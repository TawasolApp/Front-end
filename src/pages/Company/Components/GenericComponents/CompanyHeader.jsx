import React, { useState, useEffect } from "react";
import LoadingPage from "../../../LoadingScreen/LoadingPage.jsx";
import { FiEdit } from "react-icons/fi";
import UnfollowModal from "../Modals/UnfollowModal.jsx";
import EditAboutModal from "../Modals/EditAboutModal.jsx";
import { FiMoreHorizontal } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";
import ImageEnlarge from "../HomePage/ImageEnlarge.jsx";
import FollowersModal from "../Modals/FollowersModal.jsx";
import MoreOptionsModal from "../Modals/MoreOptionsModal.jsx";
import { formatNumbers } from "../../../../utils/formatNumbers.js";
import { axiosInstance } from "../../../../apis/axios.js";
import AddManagerModal from "../Modals/AddManagerModal.jsx";
function CompanyHeader({
  company,
  setCompanyData,
  showAdminIcons,
  setShowAdminIcons,
  isAdmin,
}) {
  const navigate = useNavigate();
  const location = useLocation(); // Get current URL
  const [isFollowing, setIsFollowing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isPhotoClicked, setIsOpen] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showAddManagerModal, setShowAddManagerModal] = useState(false);

  if (!company) {
    return <LoadingPage />;
  }

  const handleNavigation = (route) => {
    navigate(`/company/${company.companyId}/${route.toLowerCase()}`, {
      state: { company },
    });
  };

  const pathParts = location.pathname.split("/");
  const activeButton = pathParts.length >= 3 ? pathParts[3] || "home" : "home";

  //on click call togglefollow
  const handleFollowToggling = () => {
    if (isFollowing) {
      setShowModal(true);
    } else {
      axiosInstance
        .post(`/companies/${company.companyId}/follow`)
        .then(() => {
          setIsFollowing(true);
        })
        .catch((error) => console.error("Error following company:", error));
    }
  };

  const confirmUnfollow = () => {
    axiosInstance
      .delete(`/companies/${company.companyId}/unfollow`)
      .then(() => {
        setIsFollowing(false);
        setShowModal(false);
      })
      .catch((error) => console.error("Error unfollowing company:", error));
  };

  return (
    <div>
      <div className="bg-boxbackground p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-8">
        {/* Banner Section */}
        <div className="relative w-full h-48" onClick={() => setIsOpen(true)}>
          <img
            src={
              company?.banner ||
              "https://thingscareerrelated.com/wp-content/uploads/2021/10/default-background-image.png?w=862"
            }
            alt="Company Banner"
            className="w-full h-full object-cover rounded-t-md"
          />

          {/* Logo Section */}
          <div className="absolute -bottom-6 left-6 bg-white p-2 rounded-md">
            <img
              src={
                company?.logo ||
                "https://media.licdn.com/dms/image/D4E12AQFuCmxN72C2yQ/article-cover_image-shrink_720_1280/0/1702503196049?e=2147483647&v=beta&t=9HHff4rJDnxuWrqfzPqX9j2dncDBKQeShXf2Wt5nrUc"
              }
              alt="Company Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
        </div>

        {/* Company Details */}
        <div className="mt-8">
          <div className="flex items-center relative">
            <h1 className="text-2xl font-semibold uppercase text-text">
              {company.name}
            </h1>
            {showAdminIcons && (
              <button
                className="absolute right-0 bg-boxbackground p-2 rounded-full shadow-md border border-gray-300 transition"
                aria-label="Edit Company"
                onClick={() => setShowEditModal(true)}
              >
                <FiEdit className="text-gray-600 w-7 h-7" />
              </button>
            )}
          </div>

          <p className="text-companyheader1 font-semibold">
            {company.description}
          </p>
          <p className="text-companysubheader mt-1">
            {company.address} ·{" "}
            <button
              onClick={() => setShowFollowersModal(true)}
              className="underline hover:text-blue-600 transition font-medium"
            >
              {formatNumbers(company.followers)} followers
            </button>{" "}
            · {company.companySize}
          </p>
          <div className="mt-4 flex flex-nowrap gap-2 sm:gap-3 pb-4 items-center justify-start relative">
            {/* Follow Button Users */}
            {!showAdminIcons && !isAdmin && (
              <button
                className="px-4 h-9 min-w-max rounded-full transition duration-300 border-2 border-blue-700 bg-boxbackground text-blue-700 font-medium text-sm flex items-center justify-center"
                onClick={handleFollowToggling}
              >
                {isFollowing ? "✓ Following" : "+ Follow"}
              </button>
            )}
            {/* Follow Button Admin */}
            {!showAdminIcons && isAdmin && (
              <button className="px-4 h-9 min-w-max rounded-full transition duration-300 border-2 border-blue-700 bg-boxbackground text-blue-700 font-medium text-sm flex items-center justify-center">
                + Follow
              </button>
            )}
            {/* Add manager button */}
            {showAdminIcons && isAdmin && (
              <button
                className="px-4 h-9 min-w-max rounded-full transition duration-300 border-2 border-blue-700 bg-boxbackground text-blue-700 font-medium text-sm flex items-center justify-center"
                onClick={() => setShowAddManagerModal(true)}
              >
                Add Manager
              </button>
            )}

            {/* Visit Website Button */}
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 h-9 min-w-max rounded-full transition duration-300 border-2 border-transparent bg-blue-600 text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-800"
            >
              <span>Visit website</span>
              <FiExternalLink className="w-4 h-4" />
            </a>

            {/* More Options Button */}
            <div className="relative">
              <button
                className="w-9 h-9 border-2 border-gray-600 rounded-full flex items-center justify-center"
                aria-label="More options"
                onClick={() => setShowMoreModal((prev) => !prev)}
              >
                <FiMoreHorizontal className="text-gray-600 w-5 h-5" />
              </button>

              {showMoreModal && (
                <MoreOptionsModal
                  show={showMoreModal}
                  onClick={() => setShowMoreModal((prev) => !prev)}
                  navigate={navigate}
                />
              )}
            </div>
            {/* Admin/User View Toggle Button */}
            {showAdminIcons && isAdmin && (
              <button
                className="px-4 h-9 min-w-max rounded-full transition duration-300 border-2 border-blue-700 bg-blue-700 text-white font-medium text-sm flex items-center justify-center absolute right-0"
                onClick={() => setShowAdminIcons(false)} // Toggle to user view
              >
                Show User View
              </button>
            )}
            {!showAdminIcons && isAdmin && (
              <button
                className="px-4 h-9 min-w-max rounded-full transition duration-300 border-2 border-blue-700 bg-blue-700 text-white font-medium text-sm flex items-center justify-center absolute right-0"
                onClick={() => setShowAdminIcons(true)} // Toggle to admin view
              >
                Show Admin View
              </button>
            )}
          </div>

          <div>
            {/* Navigation Bar */}
            <div className="flex flex-nowrap gap-3 sm:gap-4 items-center justify-start pb-0">
              {["Home", "About", "Posts", "Jobs"].map((buttonName) => (
                <button
                  key={buttonName}
                  className={` pb-2 ${
                    activeButton === buttonName.toLowerCase()
                      ? "font-bold text-green-600 border-b-2 border-green-600"
                      : "text-navbuttons"
                  }`}
                  onClick={() => handleNavigation(buttonName)}
                >
                  {buttonName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <UnfollowModal
        show={showModal}
        cancel={() => setShowModal(false)} //cancel
        confirm={confirmUnfollow} //unfollow
      />
      <EditAboutModal
        show={showEditModal}
        companyData={company}
        onClose={() => setShowEditModal(false)}
        name={company.name}
      />

      <ImageEnlarge
        profilePicture={company.banner}
        isOpen={isPhotoClicked}
        onClose={() => setIsOpen(false)}
      />
      <FollowersModal
        show={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        companyId={company.companyId}
      />
      <AddManagerModal
        show={showAddManagerModal}
        onClose={() => setShowAddManagerModal(false)}
        companyId={company.companyId}
        Managers={company.Managers}
        onManagerAdded={(newManagerId) => {
          setCompanyData((prev) => ({
            ...prev,
            Managers: [...prev.Managers, newManagerId],
          }));
        }}
      />
    </div>
  );
}

export default CompanyHeader;
