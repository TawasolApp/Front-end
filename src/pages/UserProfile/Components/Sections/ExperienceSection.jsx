import React from "react";
import GenericSection from "../GenericDisplay/GenericSection";

function ExperienceSection({ isOwner, sectionRef, user, onUserUpdate }) {
  return (
    <div ref={sectionRef}>
      <GenericSection
        title="Experience"
        type="workExperience"
        items={user.workExperience || {}}
        isOwner={isOwner}
        user={user}
        onUserUpdate={onUserUpdate}
      />
    </div>
  );
}

export default ExperienceSection;
