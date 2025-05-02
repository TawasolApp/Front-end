import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { axiosInstance } from "../../apis/axios";
import { 
  setType,
  setUserId,
  setFirstName,
  setLastName,
  setLocation,
  setBio,
  setProfilePicture,
  setCoverPhoto
} from "../../store/authenticationSlice";

const ChangeState = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, companiesRes] = await Promise.all([
          axiosInstance.get("/profile"),
          axiosInstance.get("/companies/managed/list")
        ]);
        
        setProfile(profileRes.data);
        setCompanies(companiesRes.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSelect = (type, data) => {
    if (type === "User") {
      dispatch(setType("User"));
      dispatch(setUserId(data._id));
      dispatch(setFirstName(data.firstName));
      dispatch(setLastName(data.lastName));
      dispatch(setLocation(data.location));
      dispatch(setBio(data.headline));
      dispatch(setProfilePicture(data.profilePicture));
      dispatch(setCoverPhoto(data.coverPhoto));
    } else {
      dispatch(setType("Company"));
      dispatch(setUserId(data.companyId));
      dispatch(setFirstName(data.name));
      dispatch(setLastName(""));
      dispatch(setLocation(""));
      dispatch(setBio(data.description));
      dispatch(setProfilePicture(data.logo));
      dispatch(setCoverPhoto(data.banner));
    }
    navigate(-1);
  };

  if (loading) return <div className="min-h-screen p-8 bg-mainBackground flex justify-center items-center">
    <CircularProgress />
  </div>;

  if (error) return <div className="min-h-screen p-8 bg-mainBackground text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen p-8 bg-mainBackground">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-textContent hover:underline hover:bg-buttonIconHover rounded-full p-1"
        >
          <ArrowBackIcon sx={{ fontSize: 32 }} />
        </button>

        <h1 className="text-2xl font-bold text-header mb-8">Select Profile Context</h1>

        {/* Personal Profile */}
        <div className="bg-cardBackground rounded-xl shadow-lg border border-cardBorder mb-6">
          <div
            className="p-6 cursor-pointer hover:bg-itemHoverBackground transition-colors"
            onClick={() => handleSelect("User", profile)}
          >
            <div className="flex items-center gap-4">
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-textContent">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-sm text-textPlaceholder">{profile.headline}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Managed Companies */}
        {companies.length > 0 && (
          <div className="bg-cardBackground rounded-xl shadow-lg border border-cardBorder">
            <h2 className="p-4 text-lg font-semibold text-textContent border-b border-cardBorder">
              Managed Companies
            </h2>
            
            {companies.map(company => (
              <div
                key={company.companyId}
                className="p-6 cursor-pointer hover:bg-itemHoverBackground transition-colors border-b border-cardBorder last:border-b-0"
                onClick={() => handleSelect("Company", company)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={company.logo}
                    alt="Company Logo"
                    className="w-12 h-12 rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-textContent">
                      {company.name}
                    </h3>
                    <p className="text-sm text-textPlaceholder">
                      {company.industry} • {company.companySize}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeState;