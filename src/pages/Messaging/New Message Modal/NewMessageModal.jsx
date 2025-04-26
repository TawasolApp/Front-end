import { useState } from "react";
import NewMessageModalHeader from "./NewMessageModalHeader";
import ProfileCard from "./ProfileCard";
import NewMessageModalInputs from "./NewMessageModalInputs";

const NewMessageModal = ({ recipient, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const onMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isMinimized ? "w-[20vw]" : "w-[30vw]"
      } min-w-[300px]`}
    >
      {/* Modal box */}
      <div
        className={`relative z-10 bg-mainBackground rounded-lg shadow-xl overflow-hidden transition-all duration-300`}
        style={{
          maxHeight: "calc(100vh - 2rem)",
        }}
      >
        <NewMessageModalHeader
          isMinimized={isMinimized}
          onMinimize={onMinimize}
          onClose={onClose}
        />
        <ProfileCard recipient={recipient} />
        <NewMessageModalInputs isMinimized={isMinimized} />
      </div>
    </div>
  );
};

export default NewMessageModal;
