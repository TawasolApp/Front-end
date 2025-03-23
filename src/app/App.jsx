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
function App() {
  const InIcon = getIconComponent("in-black");
  const isOwner = true;

  return (
    <Router>
      <Routes>
        {/* 👇 Parent route */}
        <Route
          path="/users/:profileSlug/*"
          element={<ProfilePage isOwner={isOwner} />}
        >
          {/* 👇 Nested routes inside ProfilePage (these show in <Outlet />) */}
          <Route
            path="education"
            element={
              <GenericPage2
                title="Education"
                type="education"
                items={mockEducation}
                isOwner={isOwner}
              />
            }
          />
          <Route
            path="experience"
            element={
              <GenericPage2
                title="Experience"
                type="experience"
                items={mockExperience}
                isOwner={isOwner}
              />
            }
          />
          <Route
            path="skills"
            element={
              <GenericPage2
                title="Skills"
                type="skills"
                items={mockskills}
                isOwner={isOwner}
              />
            }
          />
          <Route
            path="certifications"
            element={
              <GenericPage2
                title="Certifications"
                type="certifications"
                items={mockCertifications}
                isOwner={isOwner}
              />
            }
          />
          <Route path="connections" element={<Connections />} />
        </Route>

        {/* 🔁 Redirect or fallback handled inside ProfilePage if needed */}
        <Route path="*" element={<ProfilePage isOwner={isOwner} />} />
      </Routes>
    </Router>
  );
}

export default App;
