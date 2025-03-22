import React, { useRef } from "react";
import ProfileHeader from "./ProfileHeader";
import mockProfiles from "./mockProfiles";
import AboutSection from "./Sections/AboutSection";
import ExperienceSection from "./Sections/ExperienceSection";
import EducationSection from "./Sections/EducationSection";
import SkillsSection from "./Sections/SkillsSection";
import CertificationsSection from "./Sections/CertificationsSection";
import { Outlet, useParams } from "react-router-dom";

// function generateSlug(user) {
//   return `${user.firstName.toLowerCase()}-${user.lastName.toLowerCase()}-${
//     user.id
//   }`;
// }

const user = mockProfiles[1];

function ProfilePage({ isOwner }) {
  // Create refs for scrolling
  const educationRef = useRef(null);
  const experienceRef = useRef(null);
  // const { profileSlug } = useParams(); //  fatma-gamal-12

  return (
    <div className="bg-gray-200 pt-4 pb-4">
      <ProfileHeader
        user={user}
        isOwner={isOwner}
        educationRef={educationRef}
        experienceRef={experienceRef}
      />
      <AboutSection user={user} isOwner={isOwner} />
      <EducationSection isOwner={isOwner} sectionRef={educationRef} />
      <ExperienceSection isOwner={isOwner} sectionRef={experienceRef} />
      <SkillsSection isOwner={isOwner} />
      <CertificationsSection isOwner={isOwner} />
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
