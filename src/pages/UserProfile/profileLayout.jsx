import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { axiosInstance as axios } from "../../apis/axios.js";
import LoadingPage from "../LoadingScreen/LoadingPage.jsx";
import Footer from "../Company/Components/GenericComponents/Footer.jsx";
function ProfileLayout() {
  const { profileSlug: userId } = useParams(); // ← This is now the actual user ID
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null); // used for key to force remount

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true); // show loader during transitions

      try {
        if (!userId) {
          const res = await axios.get("/profile");
          const firstUser = res.data?.[0];
          if (firstUser) {
            navigate(`/users/${firstUser._id}`);
          } else {
            navigate("/notfound");
          }
          return;
        }

        const res = await axios.get(`/profile/${userId}`);
        const fetchedUser = res.data;

        if (!fetchedUser) {
          window.location.replace("/error-404");
        } else {
          setUser(fetchedUser);
          setCurrentUserId(fetchedUser._id); // trigger remount on user change
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, navigate]);

  if (loading) return <LoadingPage />;
  if (!user) return null;
  const isOwner =
    user?.connectStatus === "Owner" && user?.followStatus === "Owner";
  return (
    <div className="bg-mainBackground pt-0 pb-4 min-h-screen ">
      {/* <div className="max-w-6xl mx-auto " data-testid="layout-wrapper">
        <Outlet context={{ user, isOwner, onUserUpdate: setUser }} />
      </div> */}
      <div
        className="max-w-6xl mx-auto"
        data-testid="layout-wrapper"
        key={currentUserId} // 💡 Prevent UI flicker between profiles
      >
        <Outlet context={{ user, isOwner, onUserUpdate: setUser }} />
      </div>
      <Footer />
    </div>
  );
}

export default ProfileLayout;
