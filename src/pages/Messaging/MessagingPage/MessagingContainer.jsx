import ConversationList from "./ConversationList";
import ConversationView from "./ConversationView";
import MessagingFilters from "./MessagingFilters";
import MessagingHeader from "./MessagingHeader";

const MessagingContainer = () => {
  return (
    <div className="max-w-3xl bg-cardBackground mx-auto my-8 rounded-lg border border-cardBorder flex flex-col max-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Header */}
      <MessagingHeader />

      {/* Filters */}
      <MessagingFilters />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversation list - scrollable */}
        <div className="w-full md:w-2/5 border-r border-cardBorder overflow-y-auto">
          <ConversationList />
        </div>

        {/* Conversation view - scrollable */}
        <div className="hidden md:flex flex-col w-3/5">
          <ConversationView />
        </div>

        {/* Mobile view - show only conversation list */}
        <div className="md:hidden w-full">
          <ConversationList />
        </div>
      </div>
    </div>
  );
};

export default MessagingContainer;