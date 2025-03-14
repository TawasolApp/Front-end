import "./App.css";
import { axiosInstance as axios } from "../apis/axios";
import { getIconComponent } from "../utils";
import Companypage from "../pages/CompanyPage/CompanyPage";

function App() {
  const InIcon = getIconComponent("in-black");
  return (
    <span>
      <div>
        <Companypage />
      </div>
    </span>
  );
}

export default App;
