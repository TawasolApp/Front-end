import React from "react";
import ExperienceForm from "./Forms/ExperienceForm";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../../apis/axios";
import {
  setFirstName,
  setLastName,
  setRefreshToken,
  setToken,
  setType,
  setUserId,
} from "../../store/authenticationSlice";
import { useNavigate } from "react-router-dom";

const ExperienceAuthPage = () => {
  const { userId, email, password, location, isNewGoogleUser } = useSelector(
    (state) => state.authentication
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (experienceData) => {
    let profileData = {
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

    dispatch(setType("User"));

    // New Google user, already logged in, but needs to get name
    if (isNewGoogleUser) {
      try {
        await axiosInstance.post("/profile", profileData);
      } catch (error) {
        console.error("Error submitting data:", error);
        return;
      }

      try {
        const profileResponse = await axiosInstance.get(`/profile/${userId}`);

        if (profileResponse.status === 200) {
          const { firstName, lastName } = profileResponse.data;

          dispatch(setFirstName(firstName));
          dispatch(setLastName(lastName));

          navigate("/feed");
        }

        return;
      } catch {
        console.error("Error retreiving profile:", error);
        return;
      }
    }

    try {
      const userResponse = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (userResponse.status === 201) {
        const { userId, token, refreshToken } = userResponse.data;

        dispatch(setUserId(userId));
        dispatch(setToken(token));
        dispatch(setRefreshToken(refreshToken));

        try {
          console.log(profileData);
          await axiosInstance.post("/profile", profileData);
        } catch (error) {
          console.error("Error submitting data:", error);
          console.log(profileData);
          return;
        }

        navigate("/feed");
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
