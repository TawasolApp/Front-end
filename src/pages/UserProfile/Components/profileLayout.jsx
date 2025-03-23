import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Footer.jsx";

function ProfileLayout() {
  const { profileSlug } = useParams();
  const navigate = useNavigate();

  return (
    <div className="bg-gray-200 pt-4 pb-4">
      <div className="max-w-6xl mx-auto mt-4">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default ProfileLayout;
