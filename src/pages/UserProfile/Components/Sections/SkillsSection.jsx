import React from "react";
import GenericSection from "../GenericDisplay/GenericSection";
function SkillsSection({ isOwner, user, onUserUpdate }) {
  return (
    <GenericSection
      title="Skills"
      type="skills"
      items={user.skills || []}
      isOwner={isOwner}
      user={user}
      onUserUpdate={onUserUpdate}
    />
  );
}

export default SkillsSection;
