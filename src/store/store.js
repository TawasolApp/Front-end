import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./authenticationSlice";
import themeReducer from "./themeSlice";

export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    theme: themeReducer,
  },
});

export default store;
