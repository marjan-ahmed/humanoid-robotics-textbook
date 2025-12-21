import React, { useState } from 'react';
import ChatPopup from './ChatPopup';
import FAB from './FAB';

const ChatComponent: React.FC = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <>
      {!isChatVisible && (
        <FAB onClick={toggleChatVisibility} />
      )}
      <ChatPopup
        isVisible={isChatVisible}
        onClose={() => setIsChatVisible(false)}
      />
    </>
  );
};

export default ChatComponent;