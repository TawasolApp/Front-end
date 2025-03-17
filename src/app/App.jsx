import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { axiosInstance as axios } from "../apis/axios";
import { getIconComponent } from "../utils";
//import Companypage from "../pages/CompanyPage/CompanyPage";
import NetworkBox from "../pages/mynetworkpage/mynetworkpage";
import Connections from "../pages/connectionpage/ConnectionPage";
import BlockedPage from "../pages/mynetworkpage/components/BlockedPage"; 

function App() {
  const InIcon = getIconComponent("in-black");
  return (
    <span>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<NetworkBox />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/blocked" element={<BlockedPage />} />
          </Routes>
        </Router>
      </div>
    </span>
  );
}

export default App;
