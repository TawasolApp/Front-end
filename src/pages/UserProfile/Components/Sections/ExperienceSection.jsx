import React from "react";
import GenericSection from "../GenericComponent/Useless/GenericSection";
import mockExperience from "../MockData/mockExperience";

function ExperienceSection({ isOwner, sectionRef, user }) {
  return (
    <div ref={sectionRef}>
      <GenericSection
        title="Experience"
        type="experience"
        items={user.experience || {}}
        isOwner={isOwner}
      />
    </div>
  );
}

export default ExperienceSection;
