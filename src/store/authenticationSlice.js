import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: localStorage.getItem("userId") || "",
  email: localStorage.getItem("email") || "",
  firstName: localStorage.getItem("firstName") || "",
  lastName: localStorage.getItem("lastName") || "",
  location: localStorage.getItem("location") || "",
  token: localStorage.getItem("token") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  bio: localStorage.getItem("bio") || "",
  type: localStorage.getItem("type") || "",
  profilePicture: localStorage.getItem("profilePicture") || null,
  coverPhoto: localStorage.getItem("cover") || null,
  headline: localStorage.getItem("headline") || "",
  isSocialLogin: localStorage.getItem("isSocialLogin") || false,
};

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
      localStorage.setItem("userId", action.payload);
    },
    setEmail: (state, action) => {
      state.email = action.payload;
      localStorage.setItem("email", action.payload);
    },
    setFirstName: (state, action) => {
      state.firstName = action.payload;
      localStorage.setItem("firstName", action.payload);
    },
    setLastName: (state, action) => {
      state.lastName = action.payload;
      localStorage.setItem("lastName", action.payload);
    },
    setLocation: (state, action) => {
      state.location = action.payload;
      localStorage.setItem("location", action.payload);
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
      localStorage.setItem("refreshToken", action.payload);
    },
    setBio: (state, action) => {
      state.bio = action.payload;
      localStorage.setItem("bio", action.payload);
    },
    setType: (state, action) => {
      state.type = action.payload;
      localStorage.setItem("type", action.payload);
    },
    setProfilePicture: (state, action) => {
      state.profilePicture = action.payload;
      localStorage.setItem("profilePicture", action.payload);
    },
    setCoverPhoto: (state, action) => {
      state.coverPhoto = action.payload;
      localStorage.setItem("cover", action.payload);
    },
    setHeadline: (state, action) => {
      state.headline = action.payload;
      localStorage.setItem("headline", action.payload);
    },

    setIsNewGoogleUser: (state, action) => {
      state.isNewGoogleUser = action.payload;
    },
    setIsSocialLogin: (state, action) => {
      state.isSocialLogin = action.payload;
      localStorage.setItem("isSocialLogin", action.payload);
    },
    logout: (state) => {
      state.userId = "";
      state.email = "";
      state.firstName = "";
      state.lastName = "";
      state.location = "";
      state.token = null;
      state.refreshToken = null;
      state.bio = "";
      state.type = "";
      state.profilePicture = "";
      state.coverPhoto = "";
      state.isNewGoogleUser = false;
      state.isSocialLogin = false;
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("location");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("bio");
      localStorage.removeItem("type");
      localStorage.removeItem("profilePicture");
      localStorage.removeItem("coverPhoto");
      localStorage.removeItem("isSocialLogin");
    },
  },
});

export const {
  setUserId,
  setEmail,
  setFirstName,
  setLastName,
  setLocation,
  setToken,
  setRefreshToken,
  setBio,
  setType,
  setProfilePicture,
  setCoverPhoto,
  setHeadline,
  setIsNewGoogleUser,
  setIsSocialLogin,
  logout,
} = authenticationSlice.actions;

export default authenticationSlice.reducer;
