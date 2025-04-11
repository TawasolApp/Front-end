import React, { useEffect, useState } from "react";
import { axiosInstance as axios } from "../../../../apis/axios.js";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../../LoadingScreen/LoadingPage.jsx";

function SkillEndorsersModal({ isOpen, onClose, userId, skillName }) {
  const [endorsers, setEndorsers] = useState([]);
  const [loading, setLoading] = useState(true); // for fetching data
  const [redirectingToUserId, setRedirectingToUserId] = useState(null); // for redirect
  const navigate = useNavigate();

  // Lock background scroll while modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  // Fetch endorsers on modal open
  useEffect(() => {
    if (!isOpen) return;

    const fetchEndorsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/profile/skill-endorsements/${userId}?skill=${skillName}`
        );
        setEndorsers(res.data);
      } catch (err) {
        console.error(
          "Error fetching endorsers:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEndorsers();
  }, [isOpen, userId, skillName]);

  // Show global loader before navigating
  if (redirectingToUserId) return <LoadingPage />;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-modalbackground z-50 flex justify-center items-start pt-16 px-4">
      <div className="bg-boxbackground p-6 rounded-lg w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-normaltext hover:text-companyheader p-2 text-2xl"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Modal Content */}
        {loading ? (
          <p>Loading...</p>
        ) : endorsers.length === 0 ? (
          <p>No one has endorsed this skill yet.</p>
        ) : (
          <ul className="space-y-4">
            {endorsers.map((user) => (
              <li key={user._id} className="flex items-center gap-4">
                <img
                  src={user.profilePicture || "/default-avatar.png"}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <button
                    onClick={() => {
                      onClose(); // Close modal
                      setRedirectingToUserId(user._id); // Show loading page

                      setTimeout(() => {
                        navigate(`/users/${user._id}`);
                        window.scrollTo({ top: 0, behavior: "instant" });
                      }, 0);
                    }}
                    className="text-blue-700 font-semibold hover:underline text-left"
                  >
                    {user.firstName} {user.lastName}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SkillEndorsersModal;
