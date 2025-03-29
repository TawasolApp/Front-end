import React from "react";
import OwnerView from "../JobsPage/OwnerView";
import ViewerView from "../JobsPage/ViewerView";
function JobsPage() {
  const isAdmin = false;
  return (
    <div className="bg-boxbackground p-4 shadow-md rounded-md w-full max-w-3xl mx-auto mb-6">
      {isAdmin && <OwnerView />}
      {!isAdmin && <ViewerView />}
    </div>
  );
}
export default JobsPage;
