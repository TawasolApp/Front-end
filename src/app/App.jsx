import "./App.css";
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
import CompanyLayout from "../pages/CompanyPage/Components/CompanyLayout";
import PostsPage from "../pages/CompanyPage/Components/PostsPage";
import Aboutpage from "../pages/CompanyPage/Components/AboutPage";
import Homepage from "../pages/CompanyPage/Components/HomePage";
import CreateCompanyPage from "../pages/CompanyPage/Components/CreateCompanyPage";
import FeedContainer from "../pages/Feed/FeedContainer";
import SavedPostsContainer from "../pages/SavedPosts/SavedPostsContainer";

const App = () => {
  return (
    <Router>
      <Routes>
        {/*  Top-level layout with slug param */}
        {/* for Default user */}
        <Route path="/users" element={<ProfileLayout />} />

        <Route path="/users/:profileSlug" element={<ProfileLayout />}>
          {/*  The main profile page (inside layout) */}
          <Route index element={<ProfilePage />} />
          {/*  Sub-pages */}
          <Route path="education" element={<EducationPage />} />
          <Route path="workExperience" element={<ExperiencePage />} />
          <Route path="certifications" element={<CertificationsPage />} />
          <Route path="skills" element={<SkillsPage />} />
          {/* user Connnections */}
          <Route path="connections" element={<Connections />} />
          {/* add here navigation to edit email page  */}
        </Route>
        <Route path="/" element={<FeedContainer />} />
        <Route path="/feed/" element={<FeedContainer />} />
        <Route path="/my-items/saved-posts" element={<SavedPostsContainer />} />
        <Route path="/in/:usedId/" element={<h1>HelloWorld</h1>} />
        {/* Ensure companyId is part of the URL */}
        <Route path="/company/:companyId/*" element={<CompanyLayout />}>
          <Route index element={<Homepage />} />
          <Route path="home" element={<Homepage />} />
          <Route path="about" element={<Aboutpage />} />
          <Route path="posts" element={<PostsPage />} />
        </Route>
        <Route path="/company/setup/new" element={<CreateCompanyPage />} />
      </Routes>
    </Router>
  );
};

export default App;
