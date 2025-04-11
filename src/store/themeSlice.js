// store/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Theme initialization helper
const getInitialTheme = () => {
  const stored = localStorage.getItem("theme");
  return stored === "dark" ? "dark" : "light";
};

const initialTheme = getInitialTheme();

// Actually apply the theme on load
document.documentElement.classList.add(initialTheme);

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: initialTheme,
  },
  reducers: {
    setTheme: (state, action) => {
      const newTheme = action.payload;
      state.theme = newTheme;
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
      localStorage.setItem("theme", newTheme);
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      state.theme = newTheme;
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
      localStorage.setItem("theme", newTheme);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
