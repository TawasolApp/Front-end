import "./App.css";
import { axiosInstance as axios } from "../apis/axios";
import { getIconComponent } from "../utils";
import Companypage from "../pages/CompanyPage/CompanyPage";
import FeedContainer from "../pages/Feed/FeedContainer";

function App() {

  return (
    <div>
      <FeedContainer />
    </div>
  );
}

export default App;
