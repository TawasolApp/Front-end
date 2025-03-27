import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Footer.jsx";
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
          // No slug provided — fetch the first user and redirect
          const res = await axios.get("/profile");
          const firstUser = res.data?.[0];

          if (firstUser) {
            const slug = `${firstUser.firstName?.toLowerCase()}-${firstUser.lastName?.toLowerCase()}-${
              firstUser.id
            }`;
            navigate(`/users/${slug}`, { replace: true });
          } else {
            navigate("/notfound");
          }
        } else if (id) {
          // Slug exists — fetch that user
          const res = await axios.get(`/profile/${id}`);
          // console.log("Fetched user:", res.data); // ✅ Add this!

          if (!res.data) {
            navigate("/notfound");
          } else {
            setUser(res.data);
          }
        }
      } catch (err) {
        console.error("❌ Error loading profile:", err);
        navigate("/notfound");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [profileSlug, id, navigate]);

  if (loading) return <p data-testid="loading">Loading...</p>; // Simple fallback

  return (
    <div className="bg-background pt-4 pb-4">
      <div className="max-w-6xl mx-auto mt-4" data-testid="layout-wrapper">
        <Outlet context={{ user, isOwner }} />
      </div>
      <Footer />
    </div>
  );
}

export default ProfileLayout;
