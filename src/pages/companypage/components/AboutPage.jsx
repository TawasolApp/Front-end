import React, { useState } from "react";
import company from "../testdata";
import Aboutoverview from "./AboutOverview";
import Aboutlocations from "./Aboutlocations";
function Aboutpage() {
  return (
    <div>
      <Aboutoverview />
      <Aboutlocations />
    </div>
  );
}
export default Aboutpage;
