import { Route, Routes } from "react-router-dom";

import ChangePasswordPage from "../pages/Authentication/ChangePasswordPage";
import ChangeEmailPage from "../pages/Authentication/ChangeEmailPage";

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
import SearchPosts from "../pages/Search/SearchPosts";

import TawasolNavbar from "../layouts/TawasolNavbar";
import ThemeSettings from "../pages/Settings/ThemeSettings.jsx";

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

      <Route
        path="/search/:searchText"
        element={RenderWithNavbar(<SearchPosts />)}
      />

      <Route
        path="/settings"
        element={RenderWithNavbar(<ThemeSettings />)}
      />
      
      <Route
        path="/connections"
        element={RenderWithNavbar(<ConnectionPage />)}
      />
      <Route path="/blocked" element={RenderWithNavbar(<BlockedPage />)} />
      <Route path="/follow" element={RenderWithNavbar(<FollowPage />)} />
      <Route path="/manage-connections" element={RenderWithNavbar(<ManageConnections />)} />
      <Route path="/network-box" element={RenderWithNavbar(<NetworkBox />)} />

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

      <Route path="/company" element={<CompanyLayout />} />
      <Route path="/company/:companyId/*" element={<CompanyLayout />}>
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="jobs" element={<JobsPage />} />
      </Route>
      <Route path="/company/setup/new" element={<CreateCompanyPage />} />
    </Routes>
  );
};

export default ProtectedRoutes;
