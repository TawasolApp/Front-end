import React from "react";
import GenericSection from "../GenericComponent/Useless/GenericSection";
import mockskills from "../MockData/mockskills";

function SkillsSection({ isOwner }) {
  return (
    <GenericSection
      title="Skills"
      type="skills"
      items={mockskills}
      isOwner={isOwner}
    />
  );
}

export default SkillsSection;
