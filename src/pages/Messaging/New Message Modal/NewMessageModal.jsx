import { useState } from "react";
import NewMessageModalHeader from "./NewMessageModalHeader";
import ProfileCard from "./ProfileCard";
import NewMessageModalInputs from "./NewMessageModalInputs";
import { toast } from "react-toastify";
import { useSocket } from "../../../hooks/SocketContext";

const NewMessageModal = ({ recipient, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const socket = useSocket();

  const handleSendMessage = (messageData) => {
    if (!socket || !socket.connected) {
      toast.error("Not connected to server", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const messagePayload = {
      receiverId: recipient._id,
      text: messageData.text,
      media: messageData.media || [],
      // TODO: handle attachments
    };

    socket.emit("send_message", messagePayload, (acknowledgement) => {
      if (!acknowledgement?.success) {
        toast.error("Failed to send message", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    });
  };

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
        <NewMessageModalInputs
          isMinimized={isMinimized}
          onSend={handleSendMessage}
          receiverId={recipient._id}
        />
      </div>
    </div>
  );
};

export default NewMessageModal;
