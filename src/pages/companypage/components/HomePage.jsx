import React, { useState } from "react";
import company from "../testdata.js";
import Overviewbox from "./Overviewbox.jsx";
import Aboutpage from "./AboutPage.jsx";
import PostsSlider from "./PostsSlider.jsx";
function Homepage({ setActiveButton }) {
  return (
    <div>
      <Overviewbox setActiveButton={setActiveButton} />
      <PostsSlider setActiveButton={setActiveButton} />
    </div>
  );
}
export default Homepage;
