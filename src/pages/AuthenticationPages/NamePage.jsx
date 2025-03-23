import React from "react";
import NameForm from "./components/NameForm";
import { useDispatch, useSelector } from "react-redux";
import { setFirstName, setLastName } from "../../store/authenticationSlice";

const NamePage = () => {
  const dispatch = useDispatch();
  const { email, password } = useSelector((state) => state.authentication);

  const handleName = (formData, captchaToken) => {
    // Handle form submission (e.g., send data to an API)
    console.log("Form Data Submitted:", formData);

    dispatch(setFirstName(formData.firstName));
    dispatch(setLastName(formData.lastName));

    console.log(
      "Here: ",
      email,
      password,
      formData.firstName,
      formData.lastName
    );
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
