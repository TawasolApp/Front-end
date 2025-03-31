import React, { useEffect } from "react";
import { mockFollowers } from "../../mockFollowers";

function FollowersModal({ show, onClose }) {
  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-modalbackground backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-boxbackground rounded-xl w-full max-w-md sm:max-w-lg lg:max-w-xl max-h-[85vh] overflow-y-auto shadow-lg p-4 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-text">
            Followers
          </h2>
          <button onClick={onClose} className="text-text text-xl">
            ✖
          </button>
        </div>

        {/* Followers List */}
        {mockFollowers.length === 0 ? (
          <p className="text-companysubheader text-sm">No followers yet.</p>
        ) : (
          <ul className="space-y-3">
            {mockFollowers.map((follower) => (
              <li
                key={follower.userId}
                className="flex items-center gap-4 border border-companysubheader p-3 rounded-md"
              >
                <img
                  src={follower.profilePicture}
                  alt={follower.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-text font-medium text-sm sm:text-base">
                    {follower.username}
                  </span>
                  <span className="text-sm text-companysubheader">
                    {follower.headline}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FollowersModal;
