import "./App.css";
import { axiosInstance as axios } from "../apis/axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getIconComponent } from "../utils";
import CompanyLayout from "../pages/CompanyPage/Components/CompanyLayout";
import PostsPage from "../pages/CompanyPage/Components/PostsPage";
import Aboutpage from "../pages/companypage/components/AboutPage";
import Homepage from "../pages/CompanyPage/Components/HomePage";
import CreateCompanyPage from "../pages/CompanyPage/Components/CreateCompanyPage";
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
          <Route index element={<Homepage />} />
          <Route path="home" element={<Homepage />} />
          <Route path="about" element={<Aboutpage />} />
          <Route path="posts" element={<PostsPage />} />
        </Route>
        <Route path="/company/setup/new" element={<CreateCompanyPage />} />
        {/* Redirect unknown routes to Homepage */}
        <Route path="*" element={<CompanyLayout />}>
          <Route index element={<Homepage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
