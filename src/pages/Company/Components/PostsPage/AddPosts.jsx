import React, { useState } from "react";
import TextModal from "../../../Feed/MainFeed/SharePost/TextModal";

function AddPosts({ logo, name, companyId, onPostSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handlePostSubmit = (content) => {
    // You can hardcode visibility or pass it dynamically if you want
    onPostSuccess(content, "Public");
    setIsModalOpen(false);
  };

  return (
    <div className="bg-boxbackground p-4 shadow-md rounded-md w-full max-w-3xl mx-auto mb-6">
      {/* Top section with input only */}
      <div className="flex items-center space-x-4 mt-2 mb-2">
        {/* Profile icon placeholder */}
        <div className="w-12 h-12 bg-gray-500 rounded-full">
          <img
            src={logo}
            alt="Profile"
            className="w-full h-full rounded-full"
          />
        </div>

        {/* Start a post input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Start a post"
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-transparent border border-gray-500 text-text rounded-full px-4 py-2 focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {isModalOpen && (
        <TextModal
          currentAuthorName={name}
          currentAuthorPicture={logo}
          setIsModalOpen={setIsModalOpen}
          handleSubmitFunction={handlePostSubmit}
        />
      )}
    </div>
  );
}

export default AddPosts;
