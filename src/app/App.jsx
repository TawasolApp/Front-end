import "./App.css";
import { axiosInstance as axios } from "../apis/axios";
import { getIconComponent } from "../utils";
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
  const InIcon = getIconComponent("in-black");
  return (
    <span>
      <div>
        <WelcomePage />
      </div>
    </span>
  );
}

export default App;
