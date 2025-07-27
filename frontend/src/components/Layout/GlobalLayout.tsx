import React from 'react';
import Header from './Header';

interface GlobalLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

/**
 * GlobalLayout - Wrapper layout component for ALL pages
 * Provides consistent header across authenticated and unauthenticated pages
 * Only shows sidebar for authenticated dashboard pages
 */
const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Always show header */}
      <Header />
      
      {/* Content with proper spacing for fixed header */}
      <div className={`pt-16 ${showSidebar ? 'ml-64' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default GlobalLayout;
