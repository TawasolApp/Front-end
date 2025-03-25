import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUpPage from "../pages/AuthenticationPages/SignUpPage";
import SignInPage from "../pages/AuthenticationPages/SignInPage";
import NamePage from "../pages/AuthenticationPages/NamePage";
import LocationPage from "../pages/AuthenticationPages/LocationPage";
import ExperiencePage from "../pages/AuthenticationPages/ExperiencePage";
import ChangePasswordPage from "../pages/AuthenticationPages/ChangePasswordPage";
import ForgotPasswordPage from "../pages/AuthenticationPages/ForgotPasswordPage";
import EmailVerificationPage from "../pages/AuthenticationPages/EmailVerificationPage";
import NewPasswordPage from "../pages/AuthenticationPages/NewPasswordPage";
import WelcomePage from "../pages/AuthenticationPages/WelcomePage";
import ChangeEmailPage from "../pages/AuthenticationPages/ChangeEmailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/auth/signin" element={<SignInPage />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/auth/signup/name" element={<NamePage />} />
        <Route path="/auth/signup/location" element={<LocationPage />} />
        <Route path="/auth/signup/experience" element={<ExperiencePage />} />
        <Route path="/auth/update-password" element={<ChangePasswordPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/email-verification" element={<EmailVerificationPage />} />
        <Route path="/auth/new-password" element={<NewPasswordPage />} />
        <Route path="/auth/update-email" element={<ChangeEmailPage />} />
      </Routes>
    </Router>
  );
}

export default App;