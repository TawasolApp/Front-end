import { configureStore } from "@reduxjs/toolkit";
// import { themeReducer } from './themeSlice';
import authenticationReducer from './authenticationSlice';

export const store = configureStore({
    reducer: {
        authentication: authenticationReducer,
    }
})

export default store;