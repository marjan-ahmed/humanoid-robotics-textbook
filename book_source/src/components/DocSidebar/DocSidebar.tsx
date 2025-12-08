import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useLocation } from '@docusaurus/router';
import './DocSidebar.css';

interface DocSidebarProps {
  children: React.ReactNode;
}

const DocSidebar: React.FC<DocSidebarProps> = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  // Reset hover state when route changes
  useEffect(() => {
    setIsHovered(false);
  }, [location.pathname]);

  return (
    <aside
      className={clsx('menu', 'doc-sidebar', {
        'doc-sidebar--collapsed': !isHovered,
      })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="doc-sidebar__toggle-hint">
        {isHovered ? 'Hover to collapse' : 'Hover to expand'}
      </div>
      <div className="menu__content">
        {children}
      </div>
    </aside>
  );
};

export default DocSidebar;