import React, { useState } from "react";
import Analytics from "./Analytics";
import AddJobModal from "./AddJobModal";

function OwnerView({ logo, name }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
      <div className="bg-background w-full max-w-3xl mx-auto flex justify-end">
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4"
        >
          Post a Job Opening
        </button>

        {isModalOpen && (
          <AddJobModal onClose={handleCloseModal} logo={logo} name={name} />
        )}
      </div>
      <Analytics />
    </div>
  );
}

export default OwnerView;
