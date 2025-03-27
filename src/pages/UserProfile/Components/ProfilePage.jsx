import React, { useRef } from "react";
import { useOutletContext } from "react-router-dom";

import ProfileHeader from "./HeaderComponents/ProfileHeader";
import EducationSection from "./Sections/EducationSection";
import ExperienceSection from "./Sections/ExperienceSection";
import SkillsSection from "./Sections/SkillsSection";
import CertificationsSection from "./Sections/CertificationsSection";

function ProfilePage() {
  const { user, isOwner } = useOutletContext();

  const educationRef = useRef(null);
  const experienceRef = useRef(null);

  return (
    <div className="bg-background pt-4 pb-4">
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
        sectionRef={experienceRef}
        user={user}
      />
      <SkillsSection isOwner={isOwner} user={user} />
      <CertificationsSection isOwner={isOwner} user={user} />
    </div>
  );
}

export default ProfilePage;
