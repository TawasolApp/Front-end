import React from "react";
import GenericSection from "../GenericComponent/Useless/GenericSection";
import mockskills from "../MockData/mockskills";

function SkillsSection({ isOwner, user }) {
  return (
    <GenericSection
      title="Skills"
      type="skills"
      items={user.skills || []}
      isOwner={isOwner}
      user={user} // needed for PATCH
    />
  );
}

export default SkillsSection;
