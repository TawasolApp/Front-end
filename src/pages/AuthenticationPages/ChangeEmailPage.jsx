import React from "react";
import ChangeEmailForm from "./components/ChangeEmailForm";
import { useDispatch } from "react-redux";
import { setEmail } from "../../store/authenticationSlice";

const ChangeEmailPage = () => {
    const dispatch = useDispatch();

  const handleSubmit = (newEmail) => {
    console.log("New Email:", newEmail);

    dispatch(setEmail(newEmail));
  };

  return (
    <div className="min-h-screen flex items-start pt-20 justify-center bg-white">
      <div className="bg-white p-10 rounded-lg w-full max-w-xl">
        <ChangeEmailForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ChangeEmailPage;
