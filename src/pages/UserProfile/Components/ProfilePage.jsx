import React, { useRef } from "react";
import { useOutletContext } from "react-router-dom";
import ProfileHeader from "./HeaderComponents/ProfileHeader";
import EducationSection from "./Sections/EducationSection";
import ExperienceSection from "./Sections/ExperienceSection";
import SkillsSection from "./Sections/SkillsSection";
import CertificationsSection from "./Sections/CertificationsSection";
import AboutSection from "./Sections/AboutSection";
import RestrictedProfilevisibility from "./Profilevisibility/RestrictedProfilevisibility.jsx";
import PostsSlider from "./UserPostsSlider/UserPostsSlider.jsx";

function ProfilePage() {
  const { user, isOwner, onUserUpdate } = useOutletContext();
  const educationRef = useRef(null);
  const experienceRef = useRef(null);
  const isVisible =
    isOwner ||
    user.visibility === "public" ||
    (user.visibility === "connections_only" &&
      user.connectStatus === "Connection");
  return (
    <div className="bg-mainBackground pt-0 pb-4 ">
      <ProfileHeader
        user={user}
        isOwner={isOwner}
        educationRef={educationRef}
        experienceRef={experienceRef}
        isVisible={isVisible}
      />
      {isVisible ? (
        <>
          <AboutSection user={user} isOwner={isOwner} />
          <EducationSection
            isOwner={isOwner}
            sectionRef={educationRef}
            user={user}
            onUserUpdate={onUserUpdate}
          />
          <ExperienceSection
            isOwner={isOwner}
            sectionRef={experienceRef}
            user={user}
            onUserUpdate={onUserUpdate}
          />
          <SkillsSection
            isOwner={isOwner}
            user={user}
            onUserUpdate={onUserUpdate}
          />
          <CertificationsSection
            isOwner={isOwner}
            user={user}
            onUserUpdate={onUserUpdate}
          />
          <PostsSlider />
        </>
      ) : (
        <RestrictedProfilevisibility visibility={user.visibility} />
      )}
    </div>
  );
}

export default ProfilePage;
