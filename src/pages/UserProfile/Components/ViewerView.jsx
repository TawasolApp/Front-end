import React from "react";
function ViewerView({ user }) {
  return (
    <div className="flex gap-2">
      <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm">
        Message
      </button>
      <button className="px-4 py-2 border rounded-full text-sm">More</button>
      <button className="px-4 py-2 border rounded-full text-sm">Follow</button>
    </div>
  );
  ////// add this later
  // <div className="relative bg-gray-100 shadow-md rounded-lg p-4">
  //   {/* Mutual Friends */}
  //   <div className="mt-4 text-center">
  //     <p className="text-sm text-gray-500">
  //       🔗 {user.mutualFriends || 0} mutual connections
  //     </p>
  //   </div>

  /* Viewer Actions */
}
export default ViewerView;
