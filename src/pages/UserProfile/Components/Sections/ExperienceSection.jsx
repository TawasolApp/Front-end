import React from "react";
import GenericSection2 from "../GenericComponent/OLDWAYS/GenericSection2";
import mockExperience from "../MockData/mockExperience";

function ExperienceSection({ isOwner, sectionRef, user }) {
  return (
    <div ref={sectionRef}>
      <GenericSection2
        title="Experience"
        type="experience"
        items={user.experience || {}}
        isOwner={isOwner}
      />
    </div>
  );
}

export default ExperienceSection;
