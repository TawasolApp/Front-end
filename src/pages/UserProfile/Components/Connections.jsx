// will be redirected to this page when click on conntections
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Connections() {
  const navigate = useNavigate();

  return (
    <div className="bg-boxbackground p-6 shadow-md rounded-md w-full max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-black-500 hover:underline font-medium"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold">here we'll add the connections </h1>
    </div>
  );
}

export default Connections;
