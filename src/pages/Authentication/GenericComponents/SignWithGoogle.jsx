import { useEffect, useRef } from "react";
import { getIconComponent } from "../../../utils";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setToken,
  setRefreshToken,
  setUserId,
  setEmail,
  setFirstName,
  setLastName,
  setLocation,
  setBio,
  setType,
  setPicture,
  setIsNewGoogleUser,
} from "../../../store/authenticationSlice";
import { axiosInstance } from "../../../apis/axios";

const SignWithGoogle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const GoogleGIcon = getIconComponent("google-g");
  const googleClient = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (window.google) {
      googleClient.current = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: "email profile openid",
        callback: async (tokenResponse) => {
          if (tokenResponse?.access_token) {
            try {
              const response = await axiosInstance.post(
                "/auth/social-login/google",
                {
                  idToken: tokenResponse.access_token,
                }
              );

              if (response.status === 200) {
                const { userId, token, refreshToken, isNewUser } =
                  response.data;

                dispatch(setUserId(userId));
                dispatch(setToken(token));
                dispatch(setRefreshToken(refreshToken));
                dispatch(setIsNewGoogleUser(isNewUser));

                // New user, set-up account instead of logging in
                if (isNewUser) {
                  navigate("/auth/signup/name");
                  return;
                }

                const profileResponse = await axiosInstance.get(
                  `/profile/${userId}`
                );

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
              console.error("Google login failed:", error);
            }
          }
        },
      });
    }
  }, []);

  const handleGoogleLogin = () => {
    if (googleClient.current) {
      googleClient.current.requestAccessToken();
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      type="button"
      className="
        w-full flex items-center justify-center gap-3
        py-3 sm:py-4 px-4 rounded-full border-2 border-itemBorder
        text-lg sm:text-xl font-medium
        bg-cardBackground text-textContent hover:bg-cardBackgroundHover
        focus:outline-none focus:border-itemBorderFocus
        transition-all duration-200 ease-in-out
      "
    >
      <GoogleGIcon className="w-6 h-6 sm:w-7 sm:h-7" />
      <span>Sign in with Google</span>
    </button>
  );
};

export default SignWithGoogle;
