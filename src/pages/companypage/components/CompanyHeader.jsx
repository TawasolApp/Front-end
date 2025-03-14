import React, { useState } from "react";
import company from "../testdata.js";
import Homepage from "./Homepage.jsx";
import Aboutpage from "./AboutPage.jsx";
import { FiEdit } from "react-icons/fi";
import Unfollowmodal from "./Unfollowmodal.jsx";
import EditAboutModal from "./EditAboutModal.jsx";

function formatNumbers(count) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${Math.floor(count / 1_000)}K`;
  return `${count} employees`;
}

function CompanyHeader() {
  const isAdmin = true;
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeButton, setActiveButton] = useState("Home");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Function to handle button clicks
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };
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
        <div className="relative w-full h-48">
          <img
            src={company.banner}
            alt="Company Banner"
            className="w-full h-full object-cover rounded-t-md"
          />
          {isAdmin && (
            <button
              className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md border border-gray-300 hover:bg-gray-100 transition"
              onClick={() => setShowEditModal(true)}
            >
              <FiEdit className="text-gray-600 w-5 h-5" />
            </button>
          )}
          {/* Logo Section */}
          <div className="absolute -bottom-6 left-6 bg-white p-2 rounded-md">
            <img
              src={company.logo}
              alt="Company Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
        </div>

        {/* Company Details */}
        <div className="mt-8">
          <h1 className="text-2xl font-semibold uppercase">{company.name}</h1>
          <p className="text-gray-900">{company.description}</p>
          <p className="text-gray-500 mt-1">
            {company.address} · {formatNumbers(company.followers)} followers ·{" "}
            {formatNumbers(company.employees)}+ employees
          </p>
          <div className="mt-4 flex flex-nowrap gap-2 sm:gap-3 pb-4 items-center justify-start">
            {/* Follow Button */}
            <button
              className="px-3 sm:px-4 py-1 sm:py-2 min-w-max rounded-full transition duration-300 border-2 border-blue-700 bg-white text-blue-700 font-medium flex-shrink"
              onClick={toggleFollow}
            >
              {isFollowing ? "✓ Following" : "+ Follow"}
            </button>
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="border bg-blue-600 border-gray-300 text-white px-3 sm:px-4 py-1 sm:py-2 min-w-max rounded-full inline-block text-center font-medium hover:bg-blue-800 flex-shrink"
            >
              Visit website 🔗
            </a>
            <button className="w-8 h-8 border-2 border-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              ...
            </button>
          </div>
          <div>
            {/* Navbar with buttons */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex border-t-2 border-gray-200 px-2 md:px-0 gap-4 md:gap-7 pt-3 whitespace-nowrap">
                {["Home", "About", "Posts", "Jobs", "Life", "People"].map(
                  (buttonName) => (
                    <button
                      key={buttonName}
                      className={`text-gray-700 pb-2 ${
                        activeButton === buttonName
                          ? "font-bold text-green-600 border-b-3 border-green-600"
                          : ""
                      }`}
                      onClick={() => handleButtonClick(buttonName)}
                    >
                      {buttonName}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {activeButton === "Home" && (
          <Homepage setActiveButton={setActiveButton} />
        )}
        {activeButton === "About" && <Aboutpage />}
        {activeButton === "Posts" && <div>Posts content here</div>}
        {activeButton === "Jobs" && <div>Jobs content here</div>}
        {activeButton === "Life" && <div>Life content here</div>}
        {activeButton === "People" && <div>People content here</div>}
      </div>
      <Unfollowmodal
        show={showModal}
        cancel={() => setShowModal(false)} //cancel
        confirm={confirmUnfollow} //unfollow
      />
      <EditAboutModal show={showEditModal} companyData={company} />
    </div>
  );
}

export default CompanyHeader;
