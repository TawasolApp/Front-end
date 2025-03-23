import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: localStorage.getItem('email') || '',
  password: '',
  firstName: localStorage.getItem('firstName') || '',
  lastName: localStorage.getItem('lasttName') || '',
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
    logout: (state) => {
      state.email = '';
      state.password = '';
      state.firstName = '';
      state.lastName = '';
      localStorage.removeItem('email');
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
    },
  },
});

export const { setEmail, setPassword, setFirstName, setLastName, logout } = authenticationSlice.actions;

export default authenticationSlice.reducer;