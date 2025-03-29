import React from "react";
import SignInForm from "./Forms/SignInForm";
import { axiosInstance } from "../../apis/axios";
import { useDispatch } from "react-redux";
import {
  setEmail,
  setRefreshToken,
  setToken,
} from "../../store/authenticationSlice";
import { Link } from "react-router-dom";

const SignInPage = () => {
  const dispatch = useDispatch();

  const handleSignIn = async (formData, setCredentialsError) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        const { token, refreshToken } = response.data;

        dispatch(setEmail(formData.email));
        dispatch(setToken(token));
        dispatch(setRefreshToken(refreshToken));

        // TODO: Redirect user to dashboard or protected page
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setCredentialsError("Email not verified.");
      } else if (error.response && error.response.status === 401) {
        setCredentialsError("Invalid email or password.");
      } else if (error.response && error.response.status === 404) {
        setCredentialsError("User not found.");
      } else {
        console.error("Login failed", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-mainBackground px-4 sm:px-6">
      <div className="bg-cardBackground p-6 sm:p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
        <SignInForm onSubmit={handleSignIn} />
      </div>
      <p className="mt-4 sm:mt-6 text-center text-textPlaceholder text-base sm:text-lg md:text-xl">
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
