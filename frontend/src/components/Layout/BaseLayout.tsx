import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import LoadingSpinner from '../UI/LoadingSpinner';

interface BaseLayoutProps {
  children?: React.ReactNode;
}

/**
 * BaseLayout - Layout component for authenticated dashboard pages
 * Provides sidebar and content area structure (Header is handled globally)
 * Works with GlobalLayout to provide complete page structure
 */
const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Let the routing handle redirects
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Collapsible Sidebar */}
      <Sidebar userRole={user.role} />
      
      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-6 pt-20 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Render children or use Outlet for nested routes */}
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default BaseLayout;
