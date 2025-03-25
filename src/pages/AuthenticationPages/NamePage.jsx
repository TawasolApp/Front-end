import React from "react";
import NameForm from "./components/NameForm";
import { useDispatch, useSelector } from "react-redux";
import { setFirstName, setLastName } from "../../store/authenticationSlice";
import { axiosInstance } from "../../apis/axios";
import { useNavigate } from "react-router-dom";

const NamePage = () => {
  const dispatch = useDispatch();
  const { email, password } = useSelector((state) => state.authentication);
  const navigate = useNavigate();

  const handleName = async (formData, captchaToken) => {
    dispatch(setFirstName(formData.firstName));
    dispatch(setLastName(formData.lastName));

    try {
      console.log(email, password)
      const response = await axiosInstance.post("/auth/register", {
        email,
        password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        captchaToken,
      });

      // TODO: Navigate to LocationPage
      navigate("/auth/signup/location");
    } catch (error) {
      alert(
        "Registration Failed:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100">
      <h1 className="text-4xl font-normal mb-8 text-gray-800 text-center">
        Make the most of your professional life
      </h1>
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg">
        <NameForm onSubmit={handleName} />{" "}
      </div>
    </div>
  );
};

export default NamePage;
