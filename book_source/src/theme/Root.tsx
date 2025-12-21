import React, { ReactNode } from 'react';
import { ThemeProvider } from '../contexts/ThemeProvider';
import { FocusModeProvider } from '../contexts/FocusModeContext';
import ChatComponent from '../components/chat-popup';

// Wrap the app with global context providers
export default function Root({children}: {children: ReactNode}) {
  return (
    <ThemeProvider>
      <FocusModeProvider>
        {children}
        <ChatComponent />
      </FocusModeProvider>
    </ThemeProvider>
  );
}
