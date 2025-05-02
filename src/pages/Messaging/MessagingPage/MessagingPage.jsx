import React from 'react';
import MessagingContainer from './MessagingContainer';

const MessagingPage = () => {
  return (
    <div className="min-h-[85vh] bg-mainBackground flex flex-col items-center py-8 overflow-hidden">
      <div className="w-full max-w-4xl px-4">
        <MessagingContainer />
      </div>
    </div>
  );
};

export default MessagingPage;