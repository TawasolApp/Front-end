import { useState } from "react";
import ConversationList from "./ConversationList";
import ConversationView from "./ConversationView";
import MessagingFilters from "./MessagingFilters";
import MessagingHeader from "./MessagingHeader";

const MessagingContainer = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Function to handle going back to conversation list on mobile
  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  return (
    <div className="max-w-4xl bg-cardBackground mx-auto rounded-lg border border-cardBorder flex flex-col h-[85vh] overflow-hidden">
      {/* Header */}
      <MessagingHeader />

      {/* Filters */}
      <MessagingFilters
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop layout - always show list and view side by side */}
        <div className="hidden md:flex w-full h-full">
          {/* Conversation list - scrollable */}
          <div className="w-2/5 border-r border-cardBorder overflow-y-auto">
            <ConversationList 
              activeFilter={activeFilter}
              selectedConversation={selectedConversation}
              onConversationSelect={setSelectedConversation}
            />
          </div>

          {/* Conversation view - scrollable */}
          <div className="flex flex-col w-3/5">
            {selectedConversation ? (
              <ConversationView conversation={selectedConversation} />
            ) : (
              <div className="flex items-center justify-center h-full bg-cardBackground">
                <p className="text-textContent">Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile layout - show either list or conversation view */}
        <div className="md:hidden w-full h-full">
          {selectedConversation ? (
            <div className="h-full flex flex-col">
              {/* Mobile header with back button */}
              <div className="p-2 border-b border-cardBorder flex items-center">
                <button 
                  onClick={handleBackToList}
                  className="p-2 mr-2 text-textContent"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <h2 className="text-textContent font-medium">Back to messages</h2>
              </div>
              {/* Conversation view */}
              <div className="flex-1 overflow-y-auto">
                <ConversationView conversation={selectedConversation} />
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <ConversationList 
                activeFilter={activeFilter}
                selectedConversation={selectedConversation}
                onConversationSelect={setSelectedConversation}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingContainer;