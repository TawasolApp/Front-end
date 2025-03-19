import "./App.css";
import { axiosInstance as axios } from "../apis/axios";
import { getIconComponent } from "../utils";
import SignUpPage from "../pages/AuthenticationPage/SignUpPage";
import SignInPage from "../pages/AuthenticationPage/SignInPage";
import NamePage from "../pages/AuthenticationPage/NamePage";

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
