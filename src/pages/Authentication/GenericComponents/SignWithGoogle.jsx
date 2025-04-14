import { useEffect, useRef, useState } from "react";
import { getIconComponent } from "../../../utils";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setToken,
  setRefreshToken,
  setFirstName,
  setLastName,
  setLocation,
  setBio,
  setType,
  setProfilePicture,
  setIsNewGoogleUser,
  setUserId,
  setCoverPhoto,
  setEmail,
  setIsSocialLogin,
} from "../../../store/authenticationSlice";
import { axiosInstance } from "../../../apis/axios";

const SignWithGoogle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const GoogleGIcon = getIconComponent("google-g");
  const googleClient = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (window.google) {
      googleClient.current = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope:
          "email profile openid https://www.googleapis.com/auth/userinfo.profile",
        callback: async (tokenResponse) => {
          if (tokenResponse?.access_token) {
            try {
              setIsLoading(true);
              const response = await axiosInstance.post(
                "/auth/social-login/google",
                {
                  idToken: tokenResponse.access_token,
                  isAndroid: false,
                }
              );

              if (response.status === 201) {
                const { token, refreshToken, email, isNewUser, isSocialLogin } =
                  response.data;

                dispatch(setToken(token));
                dispatch(setRefreshToken(refreshToken));
                dispatch(setEmail(email));
                dispatch(setIsNewGoogleUser(isNewUser));
                dispatch(setIsSocialLogin(isSocialLogin));

                // New user, set-up account instead of logging in
                if (isNewUser) {
                  setIsLoading(false);
                  navigate("/auth/signup/location");
                  return;
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

                    navigate("/feed");
                  }
                } catch (error) {
                  if (error.response && error.response.status === 404) {
                    setIsLoading(false);
                    dispatch(setIsNewGoogleUser(true));
                    navigate("/auth/signup/location");
                    return;
                  } else {
                    throw error;
                  }
                }
              }
            } catch (error) {
              setIsLoading(false);
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
      disabled={isLoading}
      className={`
        w-full flex items-center justify-center gap-3
        py-3 sm:py-4 px-4 rounded-full border-2 border-itemBorder
        text-lg sm:text-xl font-medium
        bg-cardBackground text-textContent hover:bg-cardBackgroundHover
        focus:outline-none focus:border-itemBorderFocus
        transition-all duration-200 ease-in-out
        ${isLoading && "opacity-70 cursor-not-allowed" }
      `}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-1">
          <span className="font-semibold text-textContent">Signing you in</span>
          <span className="animate-bounce mx-0.5 font-bold text-textContent">.</span>
          <span
            className="animate-bounce mx-0.5 font-bold text-textContent"
            style={{ animationDelay: "0.2s" }}
          >
            .
          </span>
          <span
            className="animate-bounce mx-0.5 font-bold text-textContent"
            style={{ animationDelay: "0.4s" }}
          >
            .
          </span>
        </span>
      ) : (
        <>
          <GoogleGIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          <span>Sign in with Google</span>
        </>
      )}
    </button>
  );
};

export default SignWithGoogle;
