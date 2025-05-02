const MessagingHeader = () => {

  return (
    <div className="border-b border-cardBorder shadow-sm py-4">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
        {/* Left Section - Title */}
        <div className="flex items-center gap-2 sm:gap-4">
          <h1 className="text-lg font-semibold text-text whitespace-nowrap">
            Messaging
          </h1>
        </div>
      </div>
    </div>
  );
};

export default MessagingHeader;
