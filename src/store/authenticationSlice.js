import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: localStorage.getItem('email') || '',
  firstName: localStorage.getItem('firstName') || '',
  lastName: localStorage.getItem('lastName') || '',
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
};

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
      localStorage.setItem('email', action.payload);
    },
    setFirstName: (state, action) => {
      state.firstName = action.payload;
      localStorage.setItem('firstName', action.payload);
    },
    setLastName: (state, action) => {
      state.lastName = action.payload;
      localStorage.setItem('lastName', action.payload);
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
      localStorage.setItem('refreshToken', action.payload);
    },
    logout: (state) => {
      state.email = '';
      state.password = '';
      state.firstName = '';
      state.lastName = '';
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem('email');
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { setEmail, setFirstName, setLastName, setPassword, setToken, setRefreshToken, logout } = authenticationSlice.actions;

export default authenticationSlice.reducer;