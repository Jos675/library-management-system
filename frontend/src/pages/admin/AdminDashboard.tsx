import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
            <p className="text-gray-600 mb-4">Manage users, create accounts, and assign roles.</p>
            <Link
              to="/admin/users"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Manage Users →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Book Management</h2>
            <p className="text-gray-600 mb-4">Add, edit, and manage the library collection.</p>
            <Link
              to="/admin/books"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Manage Books →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reports & Analytics</h2>
            <p className="text-gray-600 mb-4">View system reports and usage statistics.</p>
            <Link
              to="/admin/reports"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              View Reports →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Borrowing Records</h2>
            <p className="text-gray-600 mb-4">Monitor all borrowing activities and overdue books.</p>
            <Link
              to="/admin/borrowing"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              View Records →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">OPAC Management</h2>
            <p className="text-gray-600 mb-4">Manage the public catalog and search logs.</p>
            <Link
              to="/admin/opac"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Manage OPAC →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Settings</h2>
            <p className="text-gray-600 mb-4">Configure library policies and system settings.</p>
            <Link
              to="/admin/settings"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Manage Settings →
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">--</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">--</div>
              <div className="text-sm text-gray-600">Total Books</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">--</div>
              <div className="text-sm text-gray-600">Active Borrows</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">--</div>
              <div className="text-sm text-gray-600">Overdue Books</div>
            </div>
          </div>
        </div>
        
        <Routes>
          <Route
            path="/*"
            element={
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  Welcome to the Admin Dashboard
                </h3>
                <p className="text-blue-700">
                  Use the navigation above to access different administrative functions.
                  This system provides complete control over the library management system.
                </p>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
