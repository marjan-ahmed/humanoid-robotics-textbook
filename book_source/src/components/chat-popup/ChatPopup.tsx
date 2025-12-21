import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { useState, useEffect } from 'react';

interface ChatPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

function ChatPopup({ isVisible, onClose }: ChatPopupProps) {
  const [initialThread, setInitialThread] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Load saved thread ID on mount
  useEffect(() => {
    const savedThread = localStorage.getItem('chatkit-thread-id');
    setInitialThread(savedThread);
    setIsReady(true);
  }, []);

  const { control } = useChatKit({
    api: {
      url: 'http://127.0.0.1:8001/chatkit',
      domainKey: 'localhost',
    },
    initialThread: initialThread || undefined,
    onThreadChange: ({ threadId }) => {
      console.log('Thread changed:', threadId);
      if (threadId) {
        localStorage.setItem('chatkit-thread-id', threadId);
      }
    },
    onError: ({ error }) => {
      console.error('ChatKit error:', error);
    },
    onReady: () => {
      console.log('ChatKit is ready!');
    },
  });

  if (!isReady || !initialThread) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '110px',  // Positioned slightly lower (from original 90px to 110px)
        right: '20px',
        width: '320px',   // Slightly smaller width (from 350px to 320px)
        height: '500px',  // Slightly smaller height (from 550px to 500px)
        zIndex: 1001,
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.1)'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <div style={{ fontWeight: 'bold', color: '#333' }}>AI Assistant</div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            color: '#666'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* ChatKit Component */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ChatKit
          control={control}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    </div>
  );
}

export default ChatPopup;
