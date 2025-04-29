import { useState } from "react";
import ConversationList from "./ConversationList";
import ConversationView from "./ConversationView";
import MessagingFilters from "./MessagingFilters";
import MessagingHeader from "./MessagingHeader";

const MessagingContainer = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedConversation, setSelectedConversation] = useState(null);

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
        {/* Conversation list - scrollable */}
        <div className="w-full md:w-2/5 border-r border-cardBorder overflow-y-auto">
          <ConversationList 
            activeFilter={activeFilter}
            onConversationSelect={(conversation) => {
              setSelectedConversation(conversation);
            }}
          />
        </div>

        {/* Conversation view - scrollable */}
        <div className="hidden md:flex flex-col w-3/5">
          {selectedConversation ? (
            <ConversationView conversation={selectedConversation} />
          ) : (
            <div className="flex items-center justify-center h-full bg-cardBackground">
              <p className="text-textContent">Select a conversation to start chatting</p>
            </div>
          )}
        </div>

        {/* Mobile view - show only conversation list */}
        <div className="md:hidden w-full">
          <ConversationList 
            activeFilter={activeFilter}
            onConversationSelect={(conversation) => {
              setSelectedConversation(conversation);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MessagingContainer;