import React from "react";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../apis/axios";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const { firstName } = useSelector((state) => state.authentication);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.delete("/users/delete-account");

      navigate("/auth/signin");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-mainBackground px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-cardBackground rounded-xl shadow-md border border-cardBorder p-6 sm:p-8"
      >
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="mb-3 sm:mb-4 flex items-center text-textPlaceholder text-base sm:text-lg font-medium"
        >
          <ArrowBack className="mr-2 w-5 h-5" />
          Back
        </button>

        {/* Content */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-textContent mb-1">
            Close account
          </h2>
          <p className="text-lg sm:text-xl text-textContent mb-6">
            {firstName}, we’re sorry to see you go
          </p>
          <p className="text-base sm:text-lg text-textPlaceholder mb-10">
            Are you sure you want to close your account? You’ll lose your
            connections, messages, endorsements, and recommendations.
          </p>
        </div>

        <button
          type="submit"
          className={`
    py-3 sm:py-4 px-6 rounded-full text-lg sm:text-xl font-medium
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-buttonSubmitEnable
    transition-all duration-200 ease-in-out bg-buttonSubmitEnable hover:bg-buttonSubmitEnableHover
    text-buttonSubmitText shadow-sm hover:shadow-md
  `}
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default DeleteAccount;
