// import { Outlet, useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Footer from "./Footer.jsx";

// function ProfileLayout() {
//   const { profileSlug } = useParams();
//   const navigate = useNavigate();

//   return (
//     <div className="bg-gray-200 pt-4 pb-4">
//       <div className="max-w-6xl mx-auto mt-4">
//         <Outlet />
//       </div>

//       <Footer />
//     </div>
//   );
// }

// export default ProfileLayout;
import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Footer.jsx";
import axios from "axios";

function ProfileLayout() {
  const { profileSlug } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const id = profileSlug?.split("-").pop();
  const isOwner = true; // You can replace this with real auth logic if needed

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:5000/profile/${id}`)
      .then((response) => {
        if (!response.data) {
          navigate("/notfound");
        } else {
          setUser(response.data);
        }
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="bg-gray-200 pt-4 pb-4">
      <div className="max-w-6xl mx-auto mt-4">
        <Outlet context={{ user, isOwner }} />
      </div>
      <Footer />
    </div>
  );
}

export default ProfileLayout;
