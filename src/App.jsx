import "./App.css";
import "./index.css";
import { axiosInstance as axios } from "./apis/axios";
import CompanyHeader from "./pages/companypage/components/CompanyHeader.jsx";
import Companypage from "./pages/companypage/Companypage.jsx";
import { getIconComponent } from "./utils";

function App() {
  const InIcon = getIconComponent("in-black");
  return (
    <span>
      <div>
        <Companypage />
      </div>
      {/* <h1>hello Frontend Team!</h1>
      <InIcon /> */}
    </span>
  );
}

export default App;
