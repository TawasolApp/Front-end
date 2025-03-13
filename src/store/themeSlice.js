import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: localStorage.getItem('theme') === 'dark' || 
              (window.matchMedia('(prefers-color-scheme: dark)').matches && 
              localStorage.getItem('theme') === null)
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
    }
  }
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;