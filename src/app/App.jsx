import "./App.css";
import { axiosInstance as axios } from "../apis/axios";
import { getIconComponent } from "../utils";
import SignUpPage from "../pages/AuthenticationPages/SignUpPage";
import SignInPage from "../pages/AuthenticationPages/SignInPage";
import NamePage from "../pages/AuthenticationPages/NamePage";

function App() {
  const InIcon = getIconComponent("in-black");
  return (
    <span>
      <div>
        <NamePage />
      </div>
    </span>
  );
}

export default App;
