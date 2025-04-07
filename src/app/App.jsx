import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignUpPage from "../pages/Authentication/SignUpPage";
import SignInPage from "../pages/Authentication/SignInPage";
import NamePage from "../pages/Authentication/NamePage";
import LocationPage from "../pages/Authentication/LocationPage";
import ExperienceAuthPage from "../pages/Authentication/ExperiencePage";
import WelcomePage from "../pages/Authentication/WelcomePage";
import ForgotPasswordPage from "../pages/Authentication/ForgotPasswordPage.jsx";
import VerifyChangeEmailPage from "../pages/Authentication/VerifyChangeEmailPage.jsx";
import VerifySignUpPage from "../pages/Authentication/VerifySignUpPage.jsx";
import VerifyResetPasswordPage from "../pages/Authentication/VerifyresetPasswordPage.jsx";
import ProtectedRoute from "../apis/ProtectedRoute.jsx";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import VerificationPendingPage from "../pages/Authentication/VerificationPendingPage.jsx";
import NewPasswordPage from "../pages/Authentication/NewPasswordPage.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/auth/signin" element={<SignInPage />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/auth/signup/name" element={<NamePage />} />
        <Route path="/auth/signup/location" element={<LocationPage />} />
        <Route
          path="/auth/signup/experience"
          element={<ExperienceAuthPage />}
        />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/users/confirm-email-change"
          element={<VerifyChangeEmailPage />}
        />
        <Route path="/auth/verify-email" element={<VerifySignUpPage />} />
        <Route
          path="/auth/reset-password"
          element={<VerifyResetPasswordPage />}
        />
        <Route
          path="/auth/verification-pending"
          element={<VerificationPendingPage />}
        />
        <Route path="/auth/new-password" element={<NewPasswordPage />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <ProtectedRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
