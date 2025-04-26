import { Route, Routes } from "react-router-dom";

import ChangePasswordPage from "../pages/Authentication/ChangePasswordPage";
import ChangeEmailPage from "../pages/Authentication/ChangeEmailPage";

import ProfilePage from "../pages/UserProfile/Components/ProfilePage";
import ProfileLayout from "../pages/UserProfile/profileLayout";
import EducationPage from "../pages/UserProfile/Components/Pages/EducationPage";
import ExperiencePage from "../pages/UserProfile/Components/Pages/ExperiencePage";
import CertificationsPage from "../pages/UserProfile/Components/Pages/CertificationsPage";
import SkillsPage from "../pages/UserProfile/Components/Pages/SkillsPage";
import UserPostsPage from "../pages/UserProfile/Components/UserPostsSlider/UserPostsPage.jsx";

import CompanyLayout from "../pages/Company/CompanyLayout";
import PostsPage from "../pages/Company/Components/Pages/PostsPage";
import AboutPage from "../pages/Company/Components/Pages/AboutPage";
import HomePage from "../pages/Company/Components/Pages/HomePage";
import JobsPage from "../pages/Company/Components/Pages/JobsPage";
import CreateCompanyPage from "../pages/Company/Components/CreateCompanyPage/CreateCompanyPage";

import ConnectionPage from "../pages/MyNetwork/Connections/ConnectionPage";
import BlockedPage from "../pages/MyNetwork/BlockedPage";
import FollowPage from "../pages/MyNetwork/FollowPage";
import ManageConnections from "../pages/MyNetwork/ManageConnections";
import NetworkBox from "../pages/MyNetwork/NetworkBox.jsx";

import FeedContainer from "../pages/Feed/FeedContainer";
import SinglePost from "../pages/Feed/SinglePost";
import SavedPostsContainer from "../pages/SavedPosts/SavedPostsContainer";
import RepostsContainer from "../pages/Feed/RepostsContainer";

import SearchContainer from "../pages/Search/SearchContainer";
import TawasolNavbar from "../layouts/TawasolNavbar";
import ThemeSettings from "../pages/Settings/ThemeSettings.jsx";
import DeleteAccount from "../pages/Settings/DeleteAccount.jsx";

import NotificationsPage from "../pages/Notifications/NotificationsPage.jsx";

import PremiumPlan from "../pages/PremiumPlan/PremiumPlan.jsx";
import CheckoutPage from "../pages/PremiumPlan/checkout.jsx";
import CurrentPlanPage from "../pages/PremiumPlan/CurrentPlanPage.jsx";




const RenderWithNavbar = (component) => {
  return (
    <>
      <TawasolNavbar />
      {component}
    </>
  );
};

const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route path="/auth/update-password" element={<ChangePasswordPage />} />
      <Route path="/auth/update-email" element={<ChangeEmailPage />} />
      <Route path="/auth/delete-account" element={<DeleteAccount />} />

      <Route
        path="/search/:searchText"
        element={RenderWithNavbar(<SearchContainer />)}
      />

      <Route path="/settings" element={RenderWithNavbar(<ThemeSettings />)} />

      <Route path="/users" element={RenderWithNavbar(<ProfileLayout />)} />
      <Route
        path="/users/:profileSlug"
        element={RenderWithNavbar(<ProfileLayout />)}
      >
        <Route index element={<ProfilePage />} />
        <Route path="education" element={<EducationPage />} />
        <Route path="workExperience" element={<ExperiencePage />} />
        <Route path="certification" element={<CertificationsPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="posts" element={<UserPostsPage />} />


      </Route>

      <Route
        path="/connections/:userId"
        element={RenderWithNavbar(<ConnectionPage />)}
      />
      <Route path="/blocked" element={RenderWithNavbar(<BlockedPage />)} />
      <Route path="/follow" element={RenderWithNavbar(<FollowPage />)} />
      <Route
        path="/manage-connections"
        element={RenderWithNavbar(<ManageConnections />)}
      />
      <Route path="/network-box" element={RenderWithNavbar(<NetworkBox />)} />
      <Route path="/notifications" element={RenderWithNavbar(<NotificationsPage />)} />

      <Route path="/premium" element={<PremiumPlan />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/current-plan" element={<CurrentPlanPage />} />



      <Route path="/feed/:id" element={RenderWithNavbar(<SinglePost />)} />
      <Route path="/feed" element={RenderWithNavbar(<FeedContainer />)} />
      <Route
        path="/feed/reposts/:id"
        element={RenderWithNavbar(<RepostsContainer />)}
      />
      <Route
        path="/my-items/saved-posts"
        element={RenderWithNavbar(<SavedPostsContainer />)}
      />

      <Route path="/company" element={RenderWithNavbar(<CompanyLayout />)} />
      <Route
        path="/company/:companyId/*"
        element={RenderWithNavbar(<CompanyLayout />)}
      >
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="jobs" element={<JobsPage />} />
      </Route>
      <Route
        path="/company/setup/new"
        element={RenderWithNavbar(<CreateCompanyPage />)}
      />
    </Routes>
  );
};

export default ProtectedRoutes;
