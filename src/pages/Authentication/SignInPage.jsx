import React, { useEffect, useState } from "react";
import SignInForm from "./Forms/SignInForm";
import { axiosInstance } from "../../apis/axios";
import { useDispatch } from "react-redux";
import {
  logout,
  setBio,
  setEmail,
  setFirstName,
  setLastName,
  setLocation,
  setProfilePicture,
  setRefreshToken,
  setToken,
  setType,
  setUserId,
  setCoverPhoto,
  setIsSocialLogin,
  setRole,
} from "../../store/authenticationSlice";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";
import { toast } from "react-toastify";

const SignInPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleSignIn = async (formData, setCredentialsError) => {
    try {
      setIsLoading(true);
      const userResponse = await axiosInstance.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (userResponse.status === 201) {
        const { token, refreshToken, is_social_login: isSocialLogin, role } = userResponse.data;

        dispatch(setEmail(formData.email));
        dispatch(setToken(token));
        dispatch(setRefreshToken(refreshToken));
        dispatch(setIsSocialLogin(isSocialLogin));
        dispatch(setRole(role));

        if (role === "admin") {
          navigate("AdminPanel");
        }

        try {
          const profileResponse = await axiosInstance.get("/profile");

          if (profileResponse.status === 200) {
            const {
              _id,
              firstName,
              lastName,
              location,
              headline,
              profilePicture,
              coverPhoto,
            } = profileResponse.data;

            dispatch(setType("User"));
            if (_id) {
              dispatch(setUserId(_id));
            }
            if (firstName) {
              dispatch(setFirstName(firstName));
            }
            if (lastName) {
              dispatch(setLastName(lastName));
            }
            if (location) {
              dispatch(setLocation(location));
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
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setIsLoading(false);
            navigate("/auth/signup/location");
            return;
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      if (
        error.response &&
        (error.response.status === 400 ||
          error.response.status === 401 ||
          error.response.status === 404)
      ) {
        setCredentialsError("Invalid email or password.");
      } else if (error.response && error.response.status === 403) {
        setCredentialsError("Email not verified.");
      } else {
        console.error("Login failed", error);
        toast.error("Login failed, please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-mainBackground px-4 sm:px-6">
      <AuthenticationHeader hideButtons={true} />

      <div className="bg-cardBackground p-6 sm:p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
        <SignInForm onSubmit={handleSignIn} isLoading={isLoading} />
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
