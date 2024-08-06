import React from 'react';
import MessageList from '../MessageList';

const PendingMessages = () => {
  return <MessageList status={ null || "pending"}/>;
};

export default PendingMessages;
