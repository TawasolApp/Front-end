import "./App.css";
import { getIconComponent } from "../utils";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProfilePage from "../pages/UserProfile/Components/ProfilePage";
import Connections from "../pages/UserProfile/Components/Connections";
import { useEffect, useState } from "react";
import axios from "axios";
import GenericPage from "../pages/UserProfile/Components/GenericComponent/Useless/GenericPage";
import ProfileLayout from "../pages/UserProfile/Components/profileLayout";
// import GenericSection from "../pages/UserProfile/Components/GenericComponent/Useless/GenericSection";
function App() {
  const isOwner = true;
  return (
    <Router>
      <Routes>
        {/*  Top-level layout with slug param */}
        <Route path="/users/:profileSlug" element={<ProfileLayout />}>
          {/* 👇 This is your main profile page (inside layout) */}
          <Route index element={<ProfilePage />} />
          {/*  Sub-pages */}

          <Route
            path="education"
            element={
              <GenericPage
                title="education"
                type="education"
                // isOwner={isOwner}
              />
            }
          />
          <Route
            path="experience"
            element={
              <GenericPage
                title="experience"
                type="experience"
                // isOwner={isOwner}
              />
            }
          />
          <Route
            path="skills"
            element={<GenericPage title="skills" type="skills" />}
          />
          <Route
            path="certifications"
            element={
              <GenericPage
                title="Certifications"
                type="certifications"
                // isOwner={isOwner}
              />
            }
          />
          {/* <Route
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
          /> */}
          <Route path="connections" element={<Connections />} />
        </Route>

        {/* 🔁 Fallback */}
        <Route path="*" element={<Navigate to="/users/fatma-gamal-1" />} />
      </Routes>
    </Router>
  );
}

export default App;
