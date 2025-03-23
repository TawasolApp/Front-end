import React, { useRef, useEffect, useState } from "react";
import { Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import ProfileHeader from "./ProfileHeader";
import EducationSection from "./Sections/EducationSection";
import ExperienceSection from "./Sections/ExperienceSection";
import SkillsSection from "./Sections/SkillsSection";
import CertificationsSection from "./Sections/CertificationsSection";
function ProfilePage({ isOwner }) {
  const { profileSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const educationRef = useRef(null);
  const experienceRef = useRef(null);

  const id = profileSlug?.split("-").pop();
  const isBaseProfile = location.pathname === `/users/${profileSlug}`;

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:5000/profile/${id}`)
      .then((response) => {
        if (!response.data) {
          navigate("/notfound");
        } else {
          setUser(response.data);
        }
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="bg-gray-200 pt-4 pb-4">
      <ProfileHeader
        user={user}
        isOwner={isOwner}
        educationRef={educationRef}
        experienceRef={experienceRef}
      />
      <EducationSection
        isOwner={isOwner}
        sectionRef={educationRef}
        user={user}
      />
      <ExperienceSection
        isOwner={isOwner}
        sectionRef={educationRef}
        user={user}
      />
      <SkillsSection isOwner={isOwner} sectionRef={educationRef} user={user} />
      <CertificationsSection
        isOwner={isOwner}
        sectionRef={educationRef}
        user={user}
      />
      {/* other sections here */}
      <Outlet context={{ user }} />
    </div>
  );
}

export default ProfilePage;
