import "./App.css";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import RegisterPage from "../pages/Authentication/RegisterPage";
import SignInPage from "../pages/Authentication/SignInPage";
import LocationPage from "../pages/Authentication/LocationPage";
import ExperienceAuthPage from "../pages/Authentication/ExperiencePage";
import WelcomePage from "../pages/Authentication/WelcomePage";
import ForgotPasswordPage from "../pages/Authentication/ForgotPasswordPage";
import VerifyChangeEmailPage from "../pages/Authentication/VerifyChangeEmailPage";
import VerifySignUpPage from "../pages/Authentication/VerifySignUpPage";
import VerifyResetPasswordPage from "../pages/Authentication/VerifyResetPasswordPage";
import ProtectedRoute from "../apis/ProtectedRoute";
import ProtectedRoutes from "./ProtectedRoutes";
import VerificationPendingPage from "../pages/Authentication/VerificationPendingPage";
import NewPasswordPage from "../pages/Authentication/NewPasswordPage";

const App = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const theme = useSelector((state) => state.theme.theme);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/auth/signin" element={<SignInPage />} />
        <Route path="/auth/signup/*" element={<RegisterPage />} />
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
      {/* Toast Container for the toasts */}
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        theme={theme}
      />
    </Router>
  );
};

export default App;
