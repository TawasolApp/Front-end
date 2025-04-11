import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AuthenticationHeader from "./GenericComponents/AuthenticationHeader";
import { axiosInstance } from "../../apis/axios";

const VerifyChangeEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your email...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("Invalid verification link.");
      return;
    }

    axiosInstance
      .get(`/users/confirm-email-change?token=${token}`)
      .then((res) => {
        setStatus("Email updated successfully! Redirecting...");
        setTimeout(() => {
          navigate("/feed"); // Navigating to /feed
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 400) {
          setStatus(
            "Invalid or expired token. Please request a new verification email.",
          );
        } else if (err.response?.status === 404) {
          setStatus("User not found. Please contact support.");
        } else {
          setStatus("Something went wrong. Please try again later.");
        }
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-mainBackground px-4 sm:px-6">
      <AuthenticationHeader hideButtons={true} />

      <div className="bg-cardBackground rounded-xl shadow-md p-8 w-full max-w-lg text-center">
        <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-textHeavyTitle">
          Email Verification
        </h1>

        <p className="text-base md:text-lg text-textHomeTitle">{status}</p>
      </div>
    </div>
  );
};

export default VerifyChangeEmailPage;
