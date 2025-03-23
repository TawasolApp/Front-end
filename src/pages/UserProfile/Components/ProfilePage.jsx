import React, { useRef, useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
// import mockProfiles from "./mockProfiles";
import AboutSection from "./Sections/AboutSection";
import ExperienceSection from "./Sections/ExperienceSection";
import EducationSection from "./Sections/EducationSection";
import SkillsSection from "./Sections/SkillsSection";
import CertificationsSection from "./Sections/CertificationsSection";
import { Outlet, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// function generateSlug(user) {
//   return `${user.firstName.toLowerCase()}-${user.lastName.toLowerCase()}-${
//     user.id
//   }`;
// }

// const user = mockProfiles[1];

function ProfilePage({ isOwner }) {
  const { profileSlug } = useParams(); //  fatma-gamal-12
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  // Create refs for scrolling
  const educationRef = useRef(null);
  const experienceRef = useRef(null);
  const id = profileSlug?.split("-").pop(); // Gets "1" from "fatma-gamal-1"
  // console.log(" Extracted ID from slug:", id);

  ///get id from url
  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:5000/profile/${id}`)
      .then((response) => {
        if (!response.data) {
          navigate("/notfound"); // Optional: Redirect to 404 if needed
        } else {
          setUser(response.data);
        }
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, [id]);
  // console.log(user);

  if (!user) return <p>Loading...</p>;
  return (
    <div className="bg-gray-200 pt-4 pb-4">
      <ProfileHeader
        user={user}
        isOwner={isOwner}
        educationRef={educationRef}
        experienceRef={experienceRef}
      />
      {/* <AboutSection user={user} isOwner={isOwner} />
      <EducationSection isOwner={isOwner} sectionRef={educationRef} />
      <ExperienceSection isOwner={isOwner} sectionRef={experienceRef} />
      <SkillsSection isOwner={isOwner} />
      <CertificationsSection isOwner={isOwner} /> */}
      <Outlet />
    </div>
  );
}
export default ProfilePage;
{
  /* <GenericSection
        title="Education"
        type="education"
        items={mockEducation}
        isOwner={isOwner}
      />
      <GenericSection
        title="Experience"
        type="experience"
        items={mockExperience}
        isOwner={isOwner}
      />
      <GenericSection
        title="Skills"
        type="skills"
        items={mockskills}
        isOwner={isOwner}
      />
      <GenericSection
        title="Licenses & certifications"
        type="certifications"
        items={mockCertifications}
        isOwner={isOwner}
      /> 
       */
}
