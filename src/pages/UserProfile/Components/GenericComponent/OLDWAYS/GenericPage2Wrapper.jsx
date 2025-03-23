import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import GenericPage2 from "./GenericPage2";

const GenericPage2Wrapper = ({ type, title, isOwner }) => {
  const { profileSlug } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const id = profileSlug?.split("-").pop();

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:5000/profile/${id}`)
      .then((res) => {
        if (!res.data) {
          navigate("/notfound");
        } else {
          setUser(res.data);
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, [id]);

  if (!user) return <p className="text-center p-4">Loading...</p>;

  return (
    <GenericPage2
      title={title}
      type={type}
      items={user[type] || []} // Since type = "experience", it pulls user.experience
      isOwner={isOwner}
    />
  );
};

export default GenericPage2Wrapper;
