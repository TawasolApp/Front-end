import React from "react";
import SignInForm from "./Forms/SignInForm";
import { axiosInstance } from "../../apis/axios";
import { useDispatch } from "react-redux";
import {
  setBio,
  setEmail,
  setFirstName,
  setLastName,
  setLocation,
  setPicture,
  setRefreshToken,
  setToken,
  setType,
  setUserId,
} from "../../store/authenticationSlice";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";

const SignInPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignIn = async (formData, setCredentialsError) => {
    try {
      const userResponse = await axiosInstance.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (userResponse.status === 200) {
        const { userId, token, refreshToken } = userResponse.data;

        dispatch(setEmail(formData.email));
        dispatch(setUserId(userId));
        dispatch(setToken(token));
        dispatch(setRefreshToken(refreshToken));

        const profileResponse = await axiosInstance.get(`/profile/${userId}`);

        if (profileResponse.status === 200) {
          const { firstName, lastName, location, bio, picture } =
            profileResponse.data;

          dispatch(setType("User"));
          if (firstName) {
            dispatch(setFirstName(firstName));
          }
          if (lastName) {
            dispatch(setLastName(lastName));
          }
          if (location) {
            dispatch(setLocation(location));
          }
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
        setCredentialsError("Email not verified.");
      } else if (error.response && error.response.status === 401) {
        setCredentialsError("Invalid email or password.");
      } else if (error.response && error.response.status === 404) {
        setCredentialsError("User not found.");
      } else {
        console.error("Login failed", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-mainBackground px-4 sm:px-6">
      <AuthenticationHeader hideButtons={true} />

      <div className="bg-cardBackground p-6 sm:p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
        <SignInForm onSubmit={handleSignIn} />
      </div>
      <p className="mt-4 sm:mt-6 text-center text-textContent text-base sm:text-lg md:text-xl">
        New to Tawasol?{" "}
        <Link
          to="/auth/signup"
          className="text-buttonSubmitEnable font-medium hover:underline"
        >
          Join now
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;
