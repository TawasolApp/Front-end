import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CompanyLayout from "../pages/Company/CompanyLayout.jsx";
import PostsPage from "../pages/Company/Components/Pages/PostsPage.jsx";
import AboutPage from "../pages/Company/Components/Pages/AboutPage.jsx";
import HomePage from "../pages/Company/Components/Pages/HomePage.jsx";
import CreateCompanyPage from "../pages/Company/Components/CreateCompanyPage/CreateCompanyPage.jsx";
import FeedContainer from "../pages/Feed/FeedContainer";
import SavedPostsContainer from "../pages/SavedPosts/SavedPostsContainer";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FeedContainer />} />
        <Route path="/feed/" element={<FeedContainer />} />
        <Route path="/my-items/saved-posts" element={<SavedPostsContainer />} />
        <Route path="/in/:usedId/" element={<h1>HelloWorld</h1>} />
        {/* Ensure companyId is part of the URL */}
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
