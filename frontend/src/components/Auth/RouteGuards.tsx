import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  allowUnauthenticated?: boolean;
  redirectTo?: string;
}

/**
 * Route Guard Component
 * Implements role-based access control for routes
 * Features: Authentication check, role authorization, automatic redirects
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requiredRoles = [],
  allowUnauthenticated = false,
  redirectTo,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Check authentication requirement
  if (!allowUnauthenticated && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based authorization
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    
    if (!hasRequiredRole) {
      // Redirect to appropriate dashboard or unauthorized page
      const defaultRedirect = redirectTo || getDashboardForRole(user.role);
      return <Navigate to={defaultRedirect} replace />;
    }
  }

  return <>{children}</>;
};

/**
 * Admin Route Guard - Restricts access to admin users only
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RouteGuard requiredRoles={['admin']}>
    {children}
  </RouteGuard>
);

/**
 * Librarian Route Guard - Allows admin and librarian access
 */
export const LibrarianRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RouteGuard requiredRoles={['admin', 'librarian']}>
    {children}
  </RouteGuard>
);

/**
 * Student Route Guard - Restricts access to student users only
 */
export const StudentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RouteGuard requiredRoles={['student']}>
    {children}
  </RouteGuard>
);

/**
 * Public Route Guard - Allows access to unauthenticated users
 * Redirects authenticated users to their dashboard
 */
export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardForRole(user.role)} replace />;
  }

  return <>{children}</>;
};

/**
 * Protected Route Guard - Requires authentication but no specific role
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RouteGuard>
    {children}
  </RouteGuard>
);

/**
 * Helper function to get default dashboard route for user role
 */
function getDashboardForRole(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'librarian':
      return '/librarian';
    case 'student':
      return '/student';
    default:
      return '/opac';
  }
}

/**
 * Role Check Hook - Utility hook for checking user roles in components
 */
export const useRoleCheck = () => {
  const { user } = useAuth();

  return {
    isAdmin: user?.role === 'admin',
    isLibrarian: user?.role === 'librarian' || user?.role === 'admin',
    isStudent: user?.role === 'student',
    hasRole: (roles: string[]) => user ? roles.includes(user.role) : false,
    role: user?.role,
  };
};

/**
 * Permission Check Component - Conditionally render content based on roles
 */
interface PermissionCheckProps {
  children: React.ReactNode;
  roles: string[];
  fallback?: React.ReactNode;
}

export const PermissionCheck: React.FC<PermissionCheckProps> = ({
  children,
  roles,
  fallback = null,
}) => {
  const { hasRole } = useRoleCheck();

  return hasRole(roles) ? <>{children}</> : <>{fallback}</>;
};
