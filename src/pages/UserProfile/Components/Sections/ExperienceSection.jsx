import React from "react";
import GenericSection from "../GenericDisplay/GenericSection";

function ExperienceSection({ isOwner, sectionRef, user }) {
  return (
    <div ref={sectionRef}>
      <GenericSection
        title="Experience"
        type="experience"
        items={user.experience || {}}
        isOwner={isOwner}
        user={user} // needed for PATCH
      />
    </div>
  );
}

export default ExperienceSection;
