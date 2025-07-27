import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  userRole: 'admin' | 'librarian' | 'student';
}

interface MenuItemType {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
  children?: MenuItemType[];
}

/**
 * Sidebar Component - Role-based navigation menu
 * Implements clean separation of concerns for different user roles
 * Features: Collapsible menu, role-based visibility, active state tracking
 */
const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Role-based menu configuration
  const menuItems: MenuItemType[] = [
    // Common items for all authenticated users
    {
      name: 'OPAC Search',
      path: '/opac',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      roles: ['admin', 'librarian', 'student'],
    },

    // Admin-only items
    {
      name: 'Dashboard',
      path: '/admin',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      ),
      roles: ['admin'],
    },
    {
      name: 'User Management',
      path: '/admin/users',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      roles: ['admin'],
    },
    {
      name: 'System Reports',
      path: '/admin/reports',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      roles: ['admin'],
    },

    // Librarian items
    {
      name: 'Dashboard',
      path: '/librarian',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      ),
      roles: ['librarian'],
    },
    {
      name: 'Book Management',
      path: '/librarian/books',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      roles: ['admin', 'librarian'],
    },
    {
      name: 'Borrowing & Returns',
      path: '/librarian/borrowing',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      roles: ['admin', 'librarian'],
    },
    {
      name: 'Overdue Books',
      path: '/librarian/overdue',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      roles: ['admin', 'librarian'],
    },

    // Student items
    {
      name: 'My Dashboard',
      path: '/student',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      ),
      roles: ['student'],
    },
    {
      name: 'My Borrowed Books',
      path: '/student/borrowed',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      roles: ['student'],
    },
    {
      name: 'Borrowing History',
      path: '/student/history',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      roles: ['student'],
    },
  ];

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className={`fixed top-16 left-0 z-40 h-screen transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } bg-white shadow-lg border-r border-gray-200`}>
      
      {/* Collapse Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-800">
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Menu
          </h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg 
            className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-4 px-4 space-y-2">
        {visibleMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActivePath(item.path)
                ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            title={isCollapsed ? item.name : ''}
          >
            <span className={`flex-shrink-0 ${isCollapsed ? 'mr-0' : 'mr-3'}`}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <span className="truncate">{item.name}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Role Badge (when collapsed) */}
      {isCollapsed && (
        <div className="absolute bottom-4 left-2 right-2">
          <div className="bg-gray-100 rounded-lg p-2 text-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full mx-auto flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {userRole.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats (when expanded) */}
      {!isCollapsed && userRole === 'librarian' && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Quick Stats</h3>
            <div className="space-y-1 text-xs text-blue-700">
              <div className="flex justify-between">
                <span>Books Available:</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span>Currently Borrowed:</span>
                <span className="font-medium">89</span>
              </div>
              <div className="flex justify-between">
                <span>Overdue:</span>
                <span className="font-medium text-red-600">7</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
