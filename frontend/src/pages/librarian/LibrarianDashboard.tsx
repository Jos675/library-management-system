import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

const LibrarianDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Librarian Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Borrow Books</h2>
            <p className="text-gray-600 mb-4">Process book borrowing for students.</p>
            <Link
              to="/librarian/borrow"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Borrow Books →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Return Books</h2>
            <p className="text-gray-600 mb-4">Process book returns and manage overdue items.</p>
            <Link
              to="/librarian/return"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Return Books →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Book Management</h2>
            <p className="text-gray-600 mb-4">Add, edit, and manage book inventory.</p>
            <Link
              to="/librarian/books"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Manage Books →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Borrowing Records</h2>
            <p className="text-gray-600 mb-4">View all borrowing activities and history.</p>
            <Link
              to="/librarian/records"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              View Records →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Overdue Books</h2>
            <p className="text-gray-600 mb-4">Manage overdue books and fines.</p>
            <Link
              to="/librarian/overdue"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              View Overdue →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Students</h2>
            <p className="text-gray-600 mb-4">View student information and borrowing history.</p>
            <Link
              to="/librarian/students"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              View Students →
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">--</div>
              <div className="text-sm text-gray-600">Books Borrowed Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">--</div>
              <div className="text-sm text-gray-600">Books Returned Today</div>
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
              <div className="mt-8 p-6 bg-green-50 rounded-lg">
                <h3 className="text-lg font-medium text-green-900 mb-2">
                  Welcome to the Librarian Dashboard
                </h3>
                <p className="text-green-700">
                  Use the navigation above to access librarian functions.
                  You can process borrowing/returns, manage inventory, and monitor student activities.
                </p>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default LibrarianDashboard;
