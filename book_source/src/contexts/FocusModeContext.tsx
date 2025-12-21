import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define TypeScript interface for focus mode context
interface FocusModeContextType {
  isFocusMode: boolean;
  isSidebarCollapsed: boolean;
  toggleFocusMode: () => void;
  toggleSidebar: () => void;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
}

// Create Focus Mode Context
const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined);

// Focus Mode Provider Component
export const FocusModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Toggle focus mode
  const toggleFocusMode = () => {
    setIsFocusMode(prev => !prev);
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  // Apply CSS classes to body based on focus mode and sidebar state
  useEffect(() => {
    const body = document.body;

    if (isFocusMode) {
      body.classList.add('focus-mode');
    } else {
      body.classList.remove('focus-mode');
    }

    if (isSidebarCollapsed) {
      body.classList.add('sidebar-collapsed');
    } else {
      body.classList.remove('sidebar-collapsed');
    }

    // Cleanup on unmount
    return () => {
      body.classList.remove('focus-mode', 'sidebar-collapsed');
    };
  }, [isFocusMode, isSidebarCollapsed]);

  // Save focus mode state to localStorage
  useEffect(() => {
    localStorage.setItem('focusMode', JSON.stringify(isFocusMode));
  }, [isFocusMode]);

  // Save sidebar collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Load focus mode state from localStorage on mount
  useEffect(() => {
    const savedFocusMode = localStorage.getItem('focusMode');
    if (savedFocusMode) {
      setIsFocusMode(JSON.parse(savedFocusMode));
    }
  }, []);

  // Load sidebar collapsed state from localStorage on mount
  useEffect(() => {
    const savedSidebarCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarCollapsed) {
      setIsSidebarCollapsed(JSON.parse(savedSidebarCollapsed));
    }
  }, []);

  const value: FocusModeContextType = {
    isFocusMode,
    isSidebarCollapsed,
    toggleFocusMode,
    toggleSidebar,
    setIsSidebarCollapsed
  };

  return (
    <FocusModeContext.Provider value={value}>
      {children}
    </FocusModeContext.Provider>
  );
};

// Custom hook to use Focus Mode Context
export const useFocusMode = () => {
  const context = useContext(FocusModeContext);
  if (!context) {
    throw new Error('useFocusMode must be used within a FocusModeProvider');
  }
  return context;
};