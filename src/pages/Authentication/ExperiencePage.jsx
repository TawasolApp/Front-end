import React from "react";
import ExperienceForm from "./Forms/ExperienceForm";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../apis/axios";
import {
  setBio,
  setPicture,
  setRefreshToken,
  setToken,
  setType,
  setUserId,
} from "../../store/authenticationSlice";
import { useNavigate } from "react-router-dom";

const ExperienceAuthPage = () => {
  const { email, password, firstName, lastName, location, isNewGoogleUser } =
    useSelector((state) => state.authentication);
  const navigate = useNavigate();

  const handleSubmit = async (experienceData) => {
    let profileData = {
      firstName,
      lastName,
      location,
    };

    if (experienceData.isStudent) {
      profileData.education = [
        {
          school: experienceData.school,
          startDate: experienceData.startDate,
          endDate: experienceData.endDate,
        },
      ];
    } else {
      profileData.workExperience = [
        {
          title: experienceData.title,
          employmentType: experienceData.employmentType,
          company: experienceData.company,
          startDate: experienceData.startDate,
        },
      ];
    }

    try {
      await axiosInstance.post("/profile", profileData);
    } catch (error) {
      console.error("Error submitting data:", error);
      return;
    }

    dispatch(setType("User"));

    // New Google user, already logged in, no profile to get
    if (isNewGoogleUser) {
      navigate("/feed");

      return;
    }

    try {
      const userResponse = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (userResponse.status === 200) {
        const { userId, token, refreshToken } = userResponse.data;

        dispatch(setUserId(userId));
        dispatch(setToken(token));
        dispatch(setRefreshToken(refreshToken));

        const profileResponse = await axiosInstance.get(`/profile/${userId}`);

        if (profileResponse.status === 200) {
          const { bio, picture } = profileResponse.data;

          if (bio) {
            dispatch(setBio(bio));
          }
          if (picture) {
            dispatch(setPicture(picture));
          }

          navigate("/feed");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Email not verified.");
      } else if (error.response && error.response.status === 401) {
        console.error("Invalid email or password.");
      } else if (error.response && error.response.status === 404) {
        console.error("User not found.");
      } else {
        console.error("Login failed", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 md:pt-32 justify-start bg-mainBackground px-4 sm:px-6 overflow-x-hidden">
      <AuthenticationHeader hideButtons={true} />

      <div className="w-full max-w-3xl text-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-textHeavyTitle">
          Your profile helps you discover new people and opportunities
        </h1>
      </div>
      <div className="bg-cardBackground p-6 sm:p-8 md:p-10 rounded-lg w-full max-w-md sm:max-w-xl">
        <ExperienceForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ExperienceAuthPage;
