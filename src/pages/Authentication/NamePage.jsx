import React, { useState } from "react";
import NameForm from "./Forms/NameForm";
import { useDispatch, useSelector } from "react-redux";
import { setFirstName, setLastName } from "../../store/authenticationSlice";
import { axiosInstance } from "../../apis/axios";
import { useNavigate } from "react-router-dom";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";
import { toast } from "react-toastify";

const NamePage = ({ email, password }) => {
  const dispatch = useDispatch();
  const { isNewGoogleUser } = useSelector((state) => state.authentication);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleName = async (formData, captchaToken) => {
    if ((!email || !password) && !isNewGoogleUser) {
      console.error("Error: Missing email or password. Please sign up again.");
      return;
    }

    dispatch(setFirstName(formData.firstName));
    dispatch(setLastName(formData.lastName));

    // New Google user, account already exists, just navigate to next page
    if (isNewGoogleUser) {
      navigate("/auth/signup/location");

      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/auth/register", {
        email,
        password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        captchaToken: "test-token",
      });
      const { verifyToken } = response.data;

      if (String(import.meta.env.VITE_ENVIRONMENT || "").trim() === "test") {
        setIsLoading(false);

        if (!verifyToken) {
          console.log("Invalid verification link.");
          return;
        }

        axiosInstance
          .get(`/auth/verify-email?token=${verifyToken}`)
          .then((res) => {
            console.log("Email verified! Redirecting...");
            setTimeout(() => {
              navigate("/auth/signin");
            }, 1500);
            return;
          })
          .catch((err) => {
            console.error(err);
            if (err.response?.status === 400) {
              console.log("Invalid or expired token.");
            } else {
              console.log("Something went wrong. Please try again later.");
            }
            return;
          });
      }

      setIsLoading(false);
      navigate("/auth/verification-pending", {
        state: { type: "verifyEmail" },
      });
    } catch (error) {
      setIsLoading(false);
      console.error(
        `Registration Failed: ${error.response?.data?.message || error.message}`
      );
      toast.error("Registration failed, please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-mainBackground px-4 sm:px-8 md:px-12 lg:px-24 overflow-x-hidden">
      <AuthenticationHeader hideButtons={true} />

      <h1 className="text-4xl md:text-5xl font-normal mb-8 text-textHeavyTitle text-center max-w-screen-lg">
        Make the most of your professional life
      </h1>
      <div className="bg-cardBackground p-10 rounded-lg shadow-lg w-full max-w-lg min-w-[350px]">
        <NameForm onSubmit={handleName} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default NamePage;
