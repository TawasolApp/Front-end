import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import { ArrowBack, Block as BlockIcon } from "@mui/icons-material";
import { axiosInstance as axios } from "../../apis/axios";
import { toast } from "react-toastify";
import ConfirmModal from "../UserProfile/Components/ReusableModals/ConfirmModal";

// TODO: uncomment the real apis and remove the mock data
// check ziad return time ,, block count
const BlockedUsersPage = () => {
  const navigate = useNavigate();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  ///////UNCOMMENT THIS LATER
  // useEffect(() => {
  //   const fetchBlockedUsers = async () => {
  //     try {
  //       const response = await axios.get("/privacy/blocked-users");
  //       setBlockedUsers(response.data.blockedUsers);
  //     } catch (error) {
  //       console.error("Failed to fetch blocked users:", error);
  //       // toast.error("Failed to load blocked users.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBlockedUsers();
  // }, []);

  // TO BE REMOVED LATER
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      // Mocking a delayed response
      setTimeout(() => {
        setBlockedUsers([
          {
            userId: "1",
            name: "Aisha Tawfik",
            timeBlocked: "6 days ago",
          },
          {
            userId: "2",
            name: "Omar Fathy",
            timeBlocked: "3 days ago",
          },
          {
            userId: "3",
            name: "Sara Mostafa",
            timeBlocked: "yesterday",
          },
        ]);
        setLoading(false);
      }, 1000); // Simulate network delay
    };

    fetchBlockedUsers();
  }, []);

  /////TO BE UNCOMMENTED LATER
  // const handleUnblock = async (userId) => {
  //   try {
  //     await axios.post(`/privacy/unblock/${userId}`);
  //     setBlockedUsers((prev) => prev.filter((user) => user.userId !== userId));
  //     toast.success("User unblocked successfully.");
  //   } catch (err) {
  //     console.error("Failed to unblock user:", err);
  //     toast.error("Failed to unblock user.");
  //   }
  // };

  const selectedUser = blockedUsers.find((u) => u.userId === selectedUserId);

  ///// TO BE REMOVED LATER

  const handleUnblock = async (userId) => {
    // Simulate a short delay
    setTimeout(() => {
      setBlockedUsers((prev) => prev.filter((user) => user.userId !== userId));
      toast.success("User unblocked (mock).");
    }, 500);
  };

  return (
    <div className="min-h-screen p-6 bg-mainBackground">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack className="text-textContent" />
          </IconButton>
          <h1 className="text-2xl font-bold text-header">Blocking</h1>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center mt-10">
            <CircularProgress />
          </div>
        ) : blockedUsers.length === 0 ? (
          <div className="bg-cardBackground p-6 rounded-xl shadow-lg border border-cardBorder">
            <p className="text-textContent mb-4">
              You’re currently not blocking anyone.
            </p>
            <p className="text-sm text-textPlaceholder">
              Need to block or report someone? Go to the profile of the person
              you want to block and select <strong>“Block/Report”</strong> from
              the drop-down menu at the top of the profile summary.
            </p>
            <p className="text-sm text-textPlaceholder mt-2">
              After you’ve blocked the person, any previous profile views of
              yours and of the other person will disappear from each of your
              “Who’s Viewed My Profile” sections.
            </p>
          </div>
        ) : (
          <div className="bg-cardBackground p-6 rounded-xl shadow-lg border border-cardBorder">
            <p className="text-textContent mb-4">
              You’re currently blocking {blockedUsers.length}{" "}
              {blockedUsers.length === 1 ? "person" : "people"}.
            </p>
            <div className="divide-y divide-itemBorder">
              {blockedUsers.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-3">
                    <BlockIcon
                      className="text-companyheader "
                      fontSize="small"
                    />
                    <div>
                      <p className="text-textContent font-medium">
                        {user.name}
                      </p>
                      <p className="text-sm text-textPlaceholder">
                        {user.timeBlocked || "Blocked user"}
                      </p>
                    </div>
                  </div>
                  <button
                    className="text-blue-600 font-semibold hover:bg-blue-100 px-4 py-1 rounded-full transition"
                    onClick={() => {
                      setSelectedUserId(user.userId);
                      setShowConfirm(true);
                    }}
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showConfirm && (
          <ConfirmModal
            title="Unblock member?"
            message={`Are you sure you want to unblock ${selectedUser?.name || "this user"}? They will be able to interact with you again.`}
            confirmLabel="Unblock"
            cancelLabel="Cancel"
            onConfirm={() => {
              handleUnblock(selectedUserId);
              setShowConfirm(false);
              setSelectedUserId(null);
            }}
            onCancel={() => {
              setShowConfirm(false);
              setSelectedUserId(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BlockedUsersPage;
