import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import FeedContainer from "../pages/Feed/FeedContainer";

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FeedContainer />} />
        <Route path="/feed/" element={<FeedContainer />} />
        <Route path="/in/:usedId/" element={<h1>HelloWorld</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
