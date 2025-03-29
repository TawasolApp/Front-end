import React from "react";
import NameForm from "./Forms/NameForm";
import { useDispatch, useSelector } from "react-redux";
import { setFirstName, setLastName } from "../../store/authenticationSlice";
import { axiosInstance } from "../../apis/axios";
import { useNavigate } from "react-router-dom";

const NamePage = () => {
  const dispatch = useDispatch();
  const { email, password } = useSelector((state) => state.authentication);
  const navigate = useNavigate();

  const handleName = async (formData, captchaToken) => {
    if (!email || !password) {
      alert("Error: Missing email or password. Please sign up again.");
      return;
    }

    dispatch(setFirstName(formData.firstName));
    dispatch(setLastName(formData.lastName));

    try {
      console.log(email, password);
      const response = await axiosInstance.post("/auth/register", {
        email,
        password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        captchaToken,
      });

      navigate("/auth/signup/location");
    } catch (error) {
      alert(
        `Registration Failed: ${error.response?.data?.message || error.message}`,
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-mainBackground px-4 sm:px-8 md:px-12 lg:px-24">
      <h1 className="text-4xl md:text-5xl font-normal mb-8 text-textHeavyTitle text-center max-w-screen-lg">
        Make the most of your professional life
      </h1>
      <div className="bg-cardBackground p-10 rounded-lg shadow-lg w-full max-w-lg min-w-[350px]">
        <NameForm onSubmit={handleName} />
      </div>
    </div>
  );
};

export default NamePage;
