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
import ProfileLayout from "../pages/UserProfile/Components/profileLayout";
import EducationPage from "../pages/UserProfile/Components/Pages/EducationPage";
import ExperiencePage from "../pages/UserProfile/Components/Pages/ExperiencePage";
import CertificationsPage from "../pages/UserProfile/Components/Pages/CertificationsPage";
import SkillsPage from "../pages/UserProfile/Components/Pages/SkillsPage";

function App() {
  const isOwner = true;
  return (
    <Router>
      <Routes>
        {/*  Top-level layout with slug param */}
        <Route path="/users" element={<ProfileLayout />} />

        <Route path="/users/:profileSlug" element={<ProfileLayout />}>
          {/*  The main profile page (inside layout) */}
          <Route index element={<ProfilePage />} />
          {/*  Sub-pages */}
          <Route path="education" element={<EducationPage />} />
          <Route path="experience" element={<ExperiencePage />} />
          <Route path="certifications" element={<CertificationsPage />} />
          <Route path="skills" element={<SkillsPage />} />
          {/* user Connnections */}
          <Route path="connections" element={<Connections />} />
        </Route>

        {/*  Fallback */}
        <Route path="*" element={<Navigate to="/users" />} />
      </Routes>
    </Router>
  );
}

export default App;
