import { Close, CloseFullscreen, OpenInFull } from "@mui/icons-material";

const NewMessageModalHeader = ({ onMinimize, isMinimized, onClose }) => {
  
  return (
    <div className="flex justify-between items-center p-4 border-b border-cardBorder bg-cardBackground">
      <h2 className="text-authorName font-medium text-lg">New message</h2>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onMinimize}
          className="p-1 rounded-full hover:bg-cardBackgroundHover transition-colors"
          aria-label={isMinimized ? "Maximize" : "Minimize"}
        >
          {isMinimized ? (
            <OpenInFull className="text-textActivity" fontSize="small" />
          ) : (
            <CloseFullscreen className="text-textActivity" fontSize="small" />
          )}
        </button>
        
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-cardBackgroundHover transition-colors"
          aria-label="Close"
        >
          <Close className="text-textActivity" fontSize="small" />
        </button>
      </div>
    </div>
  );
};

export default NewMessageModalHeader;