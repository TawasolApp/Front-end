import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { axiosInstance as axios } from "../../../apis/axios.js";

function ProfileLayout() {
  const { profileSlug } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isOwner = true; // Replace with real auth logic

  // Extract the ID from the URL slug: "fatma-gamal-1" → "1"
  const id = profileSlug?.split("-").pop();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!profileSlug) {
          const res = await axios.get("/profile");
          const firstUser = res.data?.[0];
          if (firstUser) {
            const slug = `${firstUser.firstName?.toLowerCase()}-${firstUser.lastName?.toLowerCase()}-${firstUser.id}`;
            navigate(`/users/${slug}`);
          } else {
            navigate("/notfound");
          }
        } else if (id) {
          const res = await axios.get(`/profile/${id}`);
          const fetchedUser = res.data;

          if (!fetchedUser) {
            // navigate("/notfound");
            window.location.replace("/error-404");
          } else {
            setUser(fetchedUser);

            //  Compare slug name with current name
            const expectedSlug = `${fetchedUser.firstName?.toLowerCase()}-${fetchedUser.lastName?.toLowerCase()}-${fetchedUser.id}`;
            if (profileSlug !== expectedSlug) {
              navigate(`/users/${expectedSlug}`);
            }
          }
        }
      } catch (err) {
        console.error(" Error loading profile:", err);
        // navigate("/notfound");
        window.location.replace("/error-404");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [profileSlug, id, navigate]);

  if (loading) return <p data-testid="loading">Loading...</p>; // Simple fallback
  if (!user) return null;

  return (
    <div className="bg-mainBackground pt-4 pb-4">
      <div className="max-w-6xl mx-auto mt-4" data-testid="layout-wrapper">
        <Outlet context={{ user, isOwner }} />
      </div>
    </div>
  );
}

export default ProfileLayout;
