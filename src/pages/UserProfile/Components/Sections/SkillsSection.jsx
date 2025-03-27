import React from "react";
import GenericSection from "../GenericDisplay/GenericSection";
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
