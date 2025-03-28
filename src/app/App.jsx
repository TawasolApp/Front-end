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

import CompanyLayout from "../pages/CompanyPage/Components/CompanyLayout";
import PostsPage from "../pages/CompanyPage/Components/PostsPage";
import Aboutpage from "../pages/CompanyPage/Components/AboutPage";
import Homepage from "../pages/CompanyPage/Components/HomePage";
import CreateCompanyPage from "../pages/CompanyPage/Components/CreateCompanyPage";

import NetworkBox from "../pages/mynetworkpage/mynetworkpage";
import Connections from "../pages/connectionpage/ConnectionPage";
import BlockedPage from "../pages/mynetworkpage/components/BlockedPage"; 
import FollowPage from '../pages/mynetworkpage/components/FollowPage'; 

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
        <Route path="/auth/signup/experience" element={<ExperienceAuthPage />} />
        <Route path="/auth/update-password" element={<ChangePasswordPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/email-verification" element={<EmailVerificationPage />} />
        <Route path="/auth/email-token-verification" element={<EmailTokenVerificationPage />} />
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

        <Route path="/connections" element={<Connections />} />
        <Route path="/blocked" element={<BlockedPage />} />
        <Route path="/follow" element={<FollowPage />} />
        
        <Route path="/feed" element={<FeedContainer />} />
        <Route path="/my-items/saved-posts" element={<SavedPostsContainer />} />

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
