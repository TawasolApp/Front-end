import React, { useRef } from "react";
import { useOutletContext } from "react-router-dom";

import ProfileHeader from "./HeaderComponents/ProfileHeader";
import EducationSection from "./Sections/EducationSection";
import ExperienceSection from "./Sections/ExperienceSection";
import SkillsSection from "./Sections/SkillsSection";
import CertificationsSection from "./Sections/CertificationsSection";
import AboutSection from "./Sections/AboutSection";
import ResumeSection from "./Sections/ResumeSection";
function ProfilePage() {
  const { user, isOwner } = useOutletContext();

  const educationRef = useRef(null);
  const experienceRef = useRef(null);

  return (
    <div className="bg-mainBackground pt-4 pb-4">
      <ProfileHeader
        user={user}
        isOwner={isOwner}
        educationRef={educationRef}
        experienceRef={experienceRef}
      />
      <AboutSection user={user} isOwner={isOwner} />
      <ResumeSection user={user} isOwner={isOwner} />
      <EducationSection
        isOwner={isOwner}
        sectionRef={educationRef}
        user={user}
      />
      <ExperienceSection
        isOwner={isOwner}
        sectionRef={experienceRef}
        user={user}
      />
      <SkillsSection isOwner={isOwner} user={user} />
      <CertificationsSection isOwner={isOwner} user={user} />
    </div>
  );
}

export default ProfilePage;
