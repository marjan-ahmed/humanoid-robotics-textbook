import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import clsx from 'clsx';
import './SidebarToggle.css';

const SidebarToggle: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Reset sidebar state when route changes
  useEffect(() => {
    setIsSidebarCollapsed(false);
  }, [location.pathname]);

  // Apply CSS class to body when sidebar is collapsed
  useEffect(() => {
    if (isSidebarCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('sidebar-collapsed');
    };
  }, [isSidebarCollapsed]);

  return (
    <button
      className={clsx('sidebar-toggle', {
        'sidebar-toggle--collapsed': isSidebarCollapsed,
      })}
      onClick={toggleSidebar}
      aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      <span className="sidebar-toggle__icon">
        {isSidebarCollapsed ? (
          <>
            <span></span>
            <span></span>
            <span></span>
          </>
        ) : (
          <>
            <span></span>
            <span></span>
            <span></span>
          </>
        )}
      </span>
    </button>
  );
};

export default SidebarToggle;