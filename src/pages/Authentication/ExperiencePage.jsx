import React, { useState } from "react";
import ExperienceForm from "./Forms/ExperienceForm";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../../apis/axios";
import {
  setBio,
  setCoverPhoto,
  setFirstName,
  setIsSocialLogin,
  setLastName,
  setProfilePicture,
  setRefreshToken,
  setToken,
  setType,
  setUserId,
} from "../../store/authenticationSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ExperienceAuthPage = () => {
  const { email, password, location, isNewGoogleUser } = useSelector(
    (state) => state.authentication
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

    if (!isNewGoogleUser) {
      try {
        const userResponse = await axiosInstance.post("/auth/login", {
          email,
          password,
        });

        if (userResponse.status === 201) {
          const { token, refreshToken, isSocialLogin } = userResponse.data;

          dispatch(setToken(token));
          dispatch(setRefreshToken(refreshToken));
          dispatch(setIsSocialLogin(isSocialLogin));
        }
      } catch (error) {
        setIsLoading(false);
        if (error.response && error.response.status === 400) {
          console.error("Email not verified.");
          toast.error("Email is not verified.", {
            position: "top-right",
            autoClose: 3000,
          });
        } else if (error.response && error.response.status === 401) {
          console.error("Invalid email or password.");
          toast.error("Invalid email or password.", {
            position: "top-right",
            autoClose: 3000,
          });
        } else if (error.response && error.response.status === 404) {
          console.error("User not found.");
          toast.error("User not found.", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          console.error("Login failed", error);
          toast.error("An unexpected error occured, please try again.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
        return;
      }
    }

    try {
      await axiosInstance.post("/profile", profileData);
    } catch (error) {
      setIsLoading(false);
      console.error("Error submitting data:", error);
      toast.error("An unexpected error occured while submitting data.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const profileResponse = await axiosInstance.get("/profile");

      if (profileResponse.status === 200) {
        const {
          _id,
          firstName,
          lastName,
          headline,
          profilePicture,
          coverPhoto,
        } = profileResponse.data;

        if (_id) {
          dispatch(setUserId(_id));
        }
        if (firstName) {
          dispatch(setFirstName(firstName));
        }
        if (lastName) {
          dispatch(setLastName(lastName));
        }
        if (headline) {
          dispatch(setBio(headline));
        }
        if (profilePicture) {
          dispatch(setProfilePicture(profilePicture));
        }
        if (coverPhoto) {
          dispatch(setCoverPhoto(coverPhoto));
        }

        setIsLoading(false);
        navigate("/feed");
      }

      return;
    } catch {
      setIsLoading(false);
      console.error("Error retreiving profile:", error);
      toast.error("An unexpected error occured, please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
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
        <ExperienceForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ExperienceAuthPage;
