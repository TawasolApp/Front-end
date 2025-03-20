import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function FirstPage() {
  return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
          <h1 className="text-3xl mr-1">First Page</h1>
          <Link to="/second" className="text-3xl text-blue-400 underline">Click to go to Second Page</Link>
      </div>
  );
}

function SecondPage() {
  return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
          <h1 className="text-3xl mr-1">Second Page</h1>
          <Link to="/" className="text-3xl text-blue-400 underline">Click to go to First Page</Link>
      </div>
  );
}

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<FirstPage />} />
              <Route path="/second" element={<SecondPage />} />
          </Routes>
      </Router>
  );
}

export default App;
