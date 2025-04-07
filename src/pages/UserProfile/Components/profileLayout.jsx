import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { axiosInstance as axios } from "../../../apis/axios.js";
import LoadingPage from "../../LoadingScreen/LoadingPage";

function ProfileLayout() {
  const { profileSlug: userId } = useParams(); // ← This is now the actual user ID
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // const isOwner = true; // Replace with real auth logic
  console.error("my  user id", userId);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) {
          const res = await axios.get("/profile");
          const firstUser = res.data?.[0];
          if (firstUser) {
            navigate(`/users/${firstUser.id}`);
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
  const isOwner = user?.status === "Owner"; // ✅ Dynamic ownership check

  return (
    <div className="bg-mainBackground pt-4 pb-4">
      <div className="max-w-6xl mx-auto mt-4" data-testid="layout-wrapper">
        <Outlet context={{ user, isOwner, onUserUpdate: setUser }} />
      </div>
    </div>
  );
}

export default ProfileLayout;
