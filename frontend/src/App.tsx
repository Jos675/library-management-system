import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RouteGuard } from './components/Auth/RouteGuards';
import GlobalLayout from './components/Layout/GlobalLayout';
import BaseLayout from './components/Layout/BaseLayout';

// Public Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OPACPage from './pages/opac/OPACPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Librarian Pages
import LibrarianDashboard from './pages/librarian/LibrarianDashboard';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';

/**
 * Simple 404 component for missing routes
 */
const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page not found</p>
      <Link to="/opac" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        Go to OPAC
      </Link>
    </div>
  </div>
);

/**
 * Simple unauthorized component
 */
const UnauthorizedPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-red-600">401</h1>
      <p className="text-xl text-gray-600 mt-4">Unauthorized Access</p>
      <Link to="/login" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        Login
      </Link>
    </div>
  </div>
);

/**
 * Smart Redirect Component
 * Redirects authenticated users to their appropriate dashboard
 * Redirects unauthenticated users to OPAC
 */
const SmartRedirect: React.FC = () => {
  const token = localStorage.getItem('access_token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return <Navigate to="/opac" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    const dashboardPath = getDashboardPath(user.role);
    return <Navigate to={dashboardPath} replace />;
  } catch {
    return <Navigate to="/opac" replace />;
  }
};

/**
 * Get the appropriate dashboard path for a user role
 */
function getDashboardPath(role: string): string {
  switch (role?.toLowerCase()) {
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
 * Main Application Component
 * Features: GlobalLayout for consistent header, role-based access control
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router basename="/library-management-system">
        <GlobalLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/opac" element={<OPACPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Admin Routes */}
            <Route path="/admin/*" element={
              <RouteGuard requiredRoles={['admin']}>
                <BaseLayout>
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                  </Routes>
                </BaseLayout>
              </RouteGuard>
            } />

            {/* Protected Librarian Routes */}
            <Route path="/librarian/*" element={
              <RouteGuard requiredRoles={['admin', 'librarian']}>
                <BaseLayout>
                  <Routes>
                    <Route index element={<LibrarianDashboard />} />
                  </Routes>
                </BaseLayout>
              </RouteGuard>
            } />

            {/* Protected Student Routes */}
            <Route path="/student/*" element={
              <RouteGuard requiredRoles={['admin', 'librarian', 'student']}>
                <BaseLayout>
                  <Routes>
                    <Route index element={<StudentDashboard />} />
                  </Routes>
                </BaseLayout>
              </RouteGuard>
            } />

            {/* Default Route - Smart Redirect */}
            <Route path="/" element={<SmartRedirect />} />

            {/* 404 and Error Routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </GlobalLayout>
      </Router>
    </AuthProvider>
  );
};

export default App;
