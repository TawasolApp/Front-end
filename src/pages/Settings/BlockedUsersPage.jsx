import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import { ArrowBack, Block } from "@mui/icons-material";
import { axiosInstance as axios } from "../../apis/axios";
// This component is a simple page that displays the list of blocked users
const BlockedUsersPage = () => {
  const navigate = useNavigate();

  // const [blockedUsers, setBlockedUsers] = useState([]);
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   const fetchBlockedUsers = async () => {
  //     try {
  //       const response = await axios.get("/privacy/blocked-users");
  //       setBlockedUsers(response.data.blockedUsers);
  //     } catch (error) {
  //       console.error("Failed to fetch blocked users:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBlockedUsers();
  // }, []);

  const blockedUsers = [{ name: "Aisha Tawfik", timeBlocked: "just now" }];

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

        {blockedUsers.length === 0 ? (
          <div className="bg-cardBackground p-6 rounded-xl shadow-lg border border-cardBorder">
            <p className="text-textContent mb-4">
              You’re currently not blocking anyone.
            </p>
            <p className="text-sm text-textPlaceholder">
              Need to block or report someone? Go to the profile of the person
              you want to block and select
              <strong> “Block/Report” </strong>from the drop-down menu at the
              top of the profile summary.
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
              {blockedUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-3">
                    <Block className="text-red-500" />
                    <div>
                      <p className="text-textContent font-medium">
                        {user.name}
                      </p>
                      <p className="text-sm text-textPlaceholder">
                        {user.timeBlocked}
                      </p>
                    </div>
                  </div>
                  <button
                    className="text-blue-600 font-semibold hover:underline"
                    onClick={() => {
                      /* Trigger password modal or unblock logic here */
                    }}
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockedUsersPage;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { IconButton, Avatar, CircularProgress } from "@mui/material";
// import { ArrowBack } from "@mui/icons-material";
// import { axiosInstance as axios } from "../../apis/axios";

// const BlockedUsersPage = () => {
//   const navigate = useNavigate();

//   const [blockedUsers, setBlockedUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBlockedUsers = async () => {
//       try {
//         const response = await axios.get("/privacy/blocked-users");
//         setBlockedUsers(response.data.blockedUsers);
//       } catch (error) {
//         console.error("Failed to fetch blocked users:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlockedUsers();
//   }, []);

//   return (
//     <div className="min-h-screen p-6 bg-mainBackground">
//       <div className="max-w-2xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center gap-2 mb-6">
//           <IconButton onClick={() => navigate(-1)}>
//             <ArrowBack className="text-textContent" />
//           </IconButton>
//           <h1 className="text-2xl font-bold text-header">Blocking</h1>
//         </div>

//         {/* Loading State */}
//         {loading ? (
//           <div className="flex justify-center mt-10">
//             <CircularProgress />
//           </div>
//         ) : blockedUsers.length === 0 ? (
//           <div className="bg-cardBackground p-6 rounded-xl shadow-lg border border-cardBorder">
//             <p className="text-textContent mb-4">
//               You’re currently not blocking anyone.
//             </p>
//             <p className="text-sm text-textPlaceholder">
//               Need to block or report someone? Go to the profile of the person
//               you want to block and select
//               <strong> “Block/Report” </strong>from the drop-down menu at the
//               top of the profile summary.
//             </p>
//             <p className="text-sm text-textPlaceholder mt-2">
//               After you’ve blocked the person, any previous profile views of
//               yours and of the other person will disappear from each of your
//               “Who’s Viewed My Profile” sections.
//             </p>
//           </div>
//         ) : (
//           <div className="bg-cardBackground p-6 rounded-xl shadow-lg border border-cardBorder">
//             <p className="text-textContent mb-4">
//               You’re currently blocking {blockedUsers.length}{" "}
//               {blockedUsers.length === 1 ? "person" : "people"}.
//             </p>
//             <div className="divide-y divide-itemBorder">
//               {blockedUsers.map((user) => (
//                 <div
//                   key={user.userId}
//                   className="flex items-center justify-between py-4"
//                 >
//                   <div className="flex items-center gap-3">
//                     <Avatar
//                       src={user.profilePicture}
//                       alt={user.name}
//                       sx={{ width: 40, height: 40 }}
//                     />
//                     <div>
//                       <p className="text-textContent font-medium">{user.name}</p>
//                       <p className="text-sm text-textPlaceholder">Blocked user</p>
//                     </div>
//                   </div>
//                   <button
//                     className="text-blue-600 font-semibold hover:underline"
//                     onClick={() => {
//                       // TODO: Open unblock modal or call unblock API
//                     }}
//                   >
//                     Unblock
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BlockedUsersPage;
