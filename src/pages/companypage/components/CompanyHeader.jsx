import React, { useState, useEffect } from "react";
import LoadingPage from "../../LoadingPage/LoadingPage.jsx";
import Homepage from "./HomePage.jsx";
import Aboutpage from "./AboutPage.jsx";
import { FiEdit } from "react-icons/fi";
import Unfollowmodal from "./Unfollowmodal.jsx";
import axios from "axios";
import EditAboutModal from "./EditAboutModal.jsx";
import { FiMoreHorizontal } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";
import ImageEnlarge from "./ImageEnlarge.jsx";
import PostsPage from "./PostsPage.jsx";
import MoreOptionsModal from "./MoreOptionsModal.jsx";
import { formatNumbers } from "../../../utils/formatNumbers.js";
function CompanyHeader({ companyId }) {
  const navigate = useNavigate();
  const location = useLocation(); // Get current URL
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = true;
  const [isFollowing, setIsFollowing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isPhotoClicked, setIsOpen] = useState(false);
  useEffect(() => {
    if (companyId) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/companies/${companyId}`)
        .then((response) => {
          setCompany(response.data);
        })
        .catch((error) => console.error("Error fetching company:", error))
        .finally(() => setLoading(false));
    }
  }, [companyId]);

  if (loading) {
    return <LoadingPage />;
  }

  const handleNavigation = (route) => {
    navigate(`/company/${companyId}/${route.toLowerCase()}`, {
      state: { company },
    });
  };

  const pathParts = location.pathname.split("/");
  const activeButton = pathParts.length >= 3 ? pathParts[3] || "home" : "home";

  //on click call togglefollow
  const toggleFollow = () => {
    if (isFollowing) {
      setShowModal(true); // Show unfollow modal when already following
    } else {
      setIsFollowing(true);
    }
  };

  const confirmUnfollow = () => {
    setIsFollowing(false);
    setShowModal(false);
  };

  return (
    <div>
      <div className="bg-white p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-8">
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
            <h1 className="text-2xl font-semibold uppercase ">
              {company.name}
            </h1>
            {isAdmin && (
              <button
                className="absolute right-0 bg-white p-2 rounded-full shadow-md border border-gray-300 hover:bg-gray-100 transition"
                aria-label="Edit Company"
                onClick={() => setShowEditModal(true)}
              >
                <FiEdit className="text-gray-600 w-7 h-7" />
              </button>
            )}
          </div>

          <p className="text-gray-900">{company.description}</p>
          <p className="text-gray-500 mt-1">
            {company.address} · {formatNumbers(company.followers)} followers ·{" "}
            {company.companySize}
          </p>
          <div className="mt-4 flex flex-nowrap gap-2 sm:gap-3 pb-4 items-center justify-start">
            {/* Follow Button */}
            <button
              className="px-4 h-9 min-w-max rounded-full transition duration-300 border-2 border-blue-700 bg-white text-blue-700 font-medium text-sm flex items-center justify-center"
              onClick={toggleFollow}
            >
              {isFollowing ? "✓ Following" : "+ Follow"}
            </button>

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
          </div>

          <div>
            {/* Navigation Bar */}
            <div className="flex flex-nowrap gap-3 sm:gap-4 items-center justify-start pb-0">
              {["Home", "About", "Posts", "Jobs", "Life", "People"].map(
                (buttonName) => (
                  <button
                    key={buttonName}
                    className={`text-gray-700 pb-2 ${
                      activeButton === buttonName.toLowerCase()
                        ? "font-bold text-green-600 border-b-2 border-green-600"
                        : ""
                    }`}
                    onClick={() => handleNavigation(buttonName)}
                  >
                    {buttonName}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <Unfollowmodal
        show={showModal}
        cancel={() => setShowModal(false)} //cancel
        confirm={confirmUnfollow} //unfollow
      />
      <EditAboutModal
        show={showEditModal}
        companyData={company}
        onClose={() => setShowEditModal(false)}
      />

      <ImageEnlarge
        profilePicture={company.banner}
        isOpen={isPhotoClicked}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}

export default CompanyHeader;
