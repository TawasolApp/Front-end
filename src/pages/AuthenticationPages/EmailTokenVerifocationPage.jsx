import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../apis/axios";

const EmailTokenVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmailToken = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      try {
        await axiosInstance.get(`/users/confirm-email-change?token=${token}`);
        setStatus("success");
        setMessage(
          "Email updated successfully! You can now log in with your new email.",
        );

        // Redirect after 3 seconds
        setTimeout(() => navigate("/auth/signin"), 3000);
      } catch (error) {
        setStatus("error");
        if (error.response?.status === 400) {
          setMessage(
            "Invalid or expired token. Please request a new verification email.",
          );
        } else if (error.response?.status === 404) {
          setMessage("User not found. Please contact support.");
        } else {
          setMessage("Verification failed. Please try again later.");
        }
      }
    };

    verifyEmailToken();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-start pt-20 justify-center bg-mainBackground">
      <div className="bg-cardBackground p-10 rounded-lg w-full max-w-xl shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4 text-textHomeTitle">
          {status === "verifying"
            ? "Verifying Email"
            : status === "success"
              ? "Success!"
              : "Error"}
        </h2>

        <p className="mb-6">{message}</p>

        {status === "error" && (
          <button
            onClick={() => navigate(-2)}
            className="bg-cardBackground text-buttonSubmitEnable px-4 py-2 rounded hover:underline transition"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailTokenVerificationPage;
