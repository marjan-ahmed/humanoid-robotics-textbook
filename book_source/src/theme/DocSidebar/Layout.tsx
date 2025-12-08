import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '@docusaurus/router';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useDocsSidebar } from '@docusaurus/theme-common/internal';
import DocSidebarItems from '@theme/DocSidebarItems';
import './styles.css';

interface DocSidebarLayoutProps {
  sidebar: any;
  className?: string;
}

const DocSidebarLayout: React.FC<DocSidebarLayoutProps> = ({ sidebar, className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Reset sidebar state when route changes
  useEffect(() => {
    setIsCollapsed(false);
    setIsHovered(false);
  }, [location.pathname]);

  // Handle click outside to collapse sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        if (window.innerWidth < 997) {
          setIsCollapsed(true);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      ref={sidebarRef}
      className={clsx(
        ThemeClassNames.docs.docSidebarContainer,
        'doc-sidebar-container',
        className,
        {
          'doc-sidebar-container--collapsed': isCollapsed,
          'doc-sidebar-container--hovered': isHovered,
        }
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="doc-sidebar-toggle" onClick={toggleSidebar}>
        <span className={clsx('toggle-icon', { 'collapsed': isCollapsed })}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>

      <div className="doc-sidebar-content">
        <nav
          className={clsx(
            'menu',
            'doc-sidebar-menu',
            {
              'doc-sidebar-menu--collapsed': isCollapsed && !isHovered,
            }
          )}
        >
          <div className="menu__content">
            <DocSidebarItems
              items={sidebar}
              className="doc-sidebar-items"
            />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default DocSidebarLayout;