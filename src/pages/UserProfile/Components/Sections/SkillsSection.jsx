import React from "react";
import GenericSection2 from "../GenericComponent/OLDWAYS/GenericSection2";
import mockskills from "../MockData/mockskills";

function SkillsSection({ isOwner }) {
  return (
    <GenericSection2
      title="Skills"
      type="skills"
      items={mockskills}
      isOwner={isOwner}
    />
  );
}

export default SkillsSection;
