import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignUpPage from "../pages/Authentication/SignUpPage";
import SignInPage from "../pages/Authentication/SignInPage";
import NamePage from "../pages/Authentication/NamePage";
import LocationPage from "../pages/Authentication/LocationPage";
import ExperienceAuthPage from "../pages/Authentication/ExperiencePage";
import ChangePasswordPage from "../pages/Authentication/ChangePasswordPage";
import ForgotPasswordPage from "../pages/Authentication/ForgotPasswordPage";
import EmailVerificationPage from "../pages/Authentication/EmailVerificationPage";
import NewPasswordPage from "../pages/Authentication/NewPasswordPage";
import WelcomePage from "../pages/Authentication/WelcomePage";
import ChangeEmailPage from "../pages/Authentication/ChangeEmailPage";
import EmailTokenVerificationPage from "../pages/Authentication/EmailTokenVerifocationPage";

import ProfilePage from "../pages/UserProfile/Components/ProfilePage";
import ProfileConnections from "../pages/UserProfile/Components/Connections";
import ProfileLayout from "../pages/UserProfile/Components/profileLayout";
import EducationPage from "../pages/UserProfile/Components/Pages/EducationPage";
import ExperiencePage from "../pages/UserProfile/Components/Pages/ExperiencePage";
import CertificationsPage from "../pages/UserProfile/Components/Pages/CertificationsPage";
import SkillsPage from "../pages/UserProfile/Components/Pages/SkillsPage";

import CompanyLayout from "../pages/Company/CompanyLayout.jsx";
import PostsPage from "../pages/Company/Components/Pages/PostsPage.jsx";
import AboutPage from "../pages/Company/Components/Pages/AboutPage.jsx";
import HomePage from "../pages/Company/Components/Pages/HomePage.jsx";
import CreateCompanyPage from "../pages/Company/Components/CreateCompanyPage/CreateCompanyPage.jsx";

import NetworkBox from "../pages/mynetworkpage/NetworkBox";
import ConnectionPage from "../pages/mynetworkpage/Connections/ConnectionPage";
import BlockedPage from "../pages/mynetworkpage/BlockedPage";
import FollowPage from "../pages/mynetworkpage/FollowPage";

import FeedContainer from "../pages/Feed/FeedContainer";
import SavedPostsContainer from "../pages/SavedPosts/SavedPostsContainer";

const App = () => {
  const isOwner = true;
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/auth/signin" element={<SignInPage />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/auth/signup/name" element={<NamePage />} />
        <Route path="/auth/signup/location" element={<LocationPage />} />
        <Route
          path="/auth/signup/experience"
          element={<ExperienceAuthPage />}
        />
        <Route path="/auth/update-password" element={<ChangePasswordPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/auth/email-verification"
          element={<EmailVerificationPage />}
        />
        <Route
          path="/auth/email-token-verification"
          element={<EmailTokenVerificationPage />}
        />
        <Route path="/auth/new-password" element={<NewPasswordPage />} />
        <Route path="/auth/update-email" element={<ChangeEmailPage />} />

        <Route path="/users" element={<ProfileLayout />} />
        <Route path="/users/:profileSlug" element={<ProfileLayout />}>
          <Route index element={<ProfilePage />} />
          <Route path="education" element={<EducationPage />} />
          <Route path="experience" element={<ExperiencePage />} />
          <Route path="certifications" element={<CertificationsPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="connections" element={<ProfileConnections />} />
        </Route>

        <Route path="/connections" element={<ConnectionPage />} />
        <Route path="/blocked" element={<BlockedPage />} />
        <Route path="/follow" element={<FollowPage />} />

        <Route path="/feed" element={<FeedContainer />} />
        <Route path="/my-items/saved-posts" element={<SavedPostsContainer />} />

        <Route path="/company/:companyId/*" element={<CompanyLayout />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="posts" element={<PostsPage />} />
        </Route>
        <Route path="/company/setup/new" element={<CreateCompanyPage />} />
      </Routes>
    </Router>
  );
};

export default App;
