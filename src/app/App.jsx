import "./App.css";
import { axiosInstance as axios } from "../apis/axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getIconComponent } from "../utils";
import CompanyLayout from "../pages/CompanyPage/Components/CompanyLayout";
import PostsPage from "../pages/companypage/components/PostsPage";
import Aboutpage from "../pages/CompanyPage/Components/AboutPage";
import Homepage from "../pages/CompanyPage/Components/HomePage";
import CreateCompanyPage from "../pages/CompanyPage/Components/CreateCompanyPage";

function App() {
  return (
    <Router>
      <Routes>
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
