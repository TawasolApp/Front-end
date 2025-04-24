import { Link } from "react-router-dom";
import { getIconComponent } from "../../utils";
import ErrorImage from "../../assets/images/error-404.png";

const Error404 = () => {
  const Icon = getIconComponent("tawasol-icon");

  return (
    <div className="bg-mainBackground min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-cardBackground w-full px-6 py-4 flex items-center">
        <div className="w-1/4 flex items-center space-x-3">
          <Link to="/feed" className="flex items-center space-x-3">
            <Icon className="w-8 h-8" />
            <span className="text-xl font-semibold text-blue-700">
              Tawasol
            </span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        <img className="w-64" src={ErrorImage} />
        <div className="text-center space-y-6 max-w-md">
          <h2 className="text-textHeavyTitle text-2xl font-semibold pt-2">
            This page doesn't exist
          </h2>
          <p className="text-textActivity text-base font-normal">
            Please check your URL or return to LinkedIn home.
          </p>

          <div className="flex flex-col space-y-4 items-center">
            <Link to="/feed">
              <button
                className="bg-mainBackground text-[#0a66c2] border-2 border-[#0a66c2] rounded-full 
                  px-6 py-2 font-medium hover:border-[#004182] hover:bg-cardBackground
                  transition-colors duration-200"
              >
                Go to your feed
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404;
