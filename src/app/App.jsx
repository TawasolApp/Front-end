import "./App.css";
import { getIconComponent } from "../utils";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProfilePage from "../pages/UserProfile/Components/ProfilePage";
import mockskills from "../pages/UserProfile/Components/MockData/mockskills";
import mockEducation from "../pages/UserProfile/Components/MockData/mockEducation";
import mockExperience from "../pages/UserProfile/Components/MockData/mockExperience";
import mockCertifications from "../pages/UserProfile/Components/MockData/mockCertifications";
import GenericPage2 from "../pages/UserProfile/Components/GenericComponent/OLDWAYS/GenericPage2";
import Connections from "../pages/UserProfile/Components/Connections";
import { useEffect, useState } from "react";
import axios from "axios";
import GenericPage from "../pages/UserProfile/Components/GenericComponent/Useless/GenericPage";
import ProfileLayout from "../pages/UserProfile/Components/profileLayout";
import GenericPage2Wrapper from "../pages/UserProfile/Components/GenericComponent/OLDWAYS/GenericPage2Wrapper";
function App() {
  const isOwner = true;
  return (
    <Router>
      <Routes>
        {/*  Top-level layout with slug param */}
        <Route path="/users/:profileSlug" element={<ProfileLayout />}>
          {/* 👇 This is your main profile page (inside layout) */}
          <Route index element={<ProfilePage isOwner={isOwner} />} />
          {/*  Sub-pages */}

          <Route
            path="education"
            element={
              <GenericPage2Wrapper
                title="education"
                type="education"
                isOwner={isOwner}
              />
            }
          />
          <Route
            path="experience"
            element={
              <GenericPage2Wrapper
                title="Experience"
                type="experience"
                isOwner={isOwner}
              />
            }
          />
          <Route
            path="skills"
            element={
              <GenericPage2Wrapper
                title="Skills"
                type="skills"
                isOwner={isOwner}
              />
            }
          />
          <Route
            path="certifications"
            element={
              <GenericPage2Wrapper
                title="Certifications"
                type="certifications"
                isOwner={isOwner}
              />
            }
          />
          <Route path="connections" element={<Connections />} />
        </Route>

        {/* 🔁 Fallback */}
        <Route path="*" element={<Navigate to="/users/fatma-gamal-1" />} />
      </Routes>
    </Router>
  );
}

export default App;
{
  /* <Route
            path="experience"
            element={
              <GenericPage2
                title="Experience"
                type="experience"
                items={mockExperience}
                isOwner={isOwner}
              />
            }
          />  */
}
{
  /* <Route
            path="skills"
            element={
              <GenericPage2
                title="Skills"
                type="skills"
                items={mockskills}
                isOwner={isOwner}
              />
            }
          />  */
}
{
  /* <Route
            path="certifications"
            element={
              <GenericPage2
                title="Certifications"
                type="certifications"
                items={mockCertifications}
                isOwner={isOwner}
              />
            }
          /> */
}
