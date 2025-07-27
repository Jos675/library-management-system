import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { apiService, BorrowRecord } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentBorrows, setCurrentBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentBorrows();
  }, []);

  const loadCurrentBorrows = async () => {
    try {
      const borrows = await apiService.getCurrentBorrows();
      setCurrentBorrows(borrows);
    } catch (error) {
      console.error('Failed to load current borrows:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Student Dashboard - {user?.full_name}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Currently Borrowed Books</h2>
              
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                </div>
              ) : currentBorrows.length > 0 ? (
                <div className="space-y-4">
                  {currentBorrows.map((borrow) => (
                    <div key={borrow.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {borrow.book_details.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            borrow.status === 'overdue'
                              ? 'bg-red-100 text-red-800'
                              : isOverdue(borrow.due_date)
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {borrow.status === 'overdue' || isOverdue(borrow.due_date)
                            ? 'Overdue'
                            : 'Borrowed'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">by {borrow.book_details.author}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Borrowed:</span> {formatDate(borrow.borrow_date)}
                        </div>
                        <div>
                          <span className="font-medium">Due:</span> {formatDate(borrow.due_date)}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {borrow.book_details.shelf_location}
                        </div>
                        {borrow.fine_amount && parseFloat(borrow.fine_amount) > 0 && (
                          <div className="text-red-600">
                            <span className="font-medium">Fine:</span> PGK {borrow.fine_amount}
                          </div>
                        )}
                      </div>
                      {borrow.is_overdue && (
                        <div className="mt-2 p-2 bg-red-50 rounded text-red-700 text-sm">
                          This book is {borrow.days_overdue} day(s) overdue. Please return it as soon as possible.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  You don't have any books currently borrowed.
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Catalog</h2>
                <p className="text-gray-600 mb-4">Browse and search the library catalog.</p>
                <Link
                  to="/opac"
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Browse Catalog →
                </Link>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Borrowing History</h2>
                <p className="text-gray-600 mb-4">View your complete borrowing history.</p>
                <Link
                  to="/student/history"
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  View History →
                </Link>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Stats</h2>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {currentBorrows.length}/3
                  </div>
                  <div className="text-sm text-gray-600">Books Borrowed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {currentBorrows.filter(b => b.is_overdue || isOverdue(b.due_date)).length}
                  </div>
                  <div className="text-sm text-gray-600">Overdue Books</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    PGK {currentBorrows.reduce((total, b) => total + parseFloat(b.fine_amount || '0'), 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total Fines</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Library Rules</h2>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Maximum 3 books at a time</p>
                <p>• 14-day borrowing period</p>
                <p>• PGK 1.00 fine per day for overdue books</p>
                <p>• Contact librarian for renewals</p>
              </div>
            </div>
          </div>
        </div>
        
        <Routes>
          <Route
            path="/*"
            element={
              <div className="mt-8 p-6 bg-purple-50 rounded-lg">
                <h3 className="text-lg font-medium text-purple-900 mb-2">
                  Welcome to Your Student Dashboard
                </h3>
                <p className="text-purple-700">
                  Here you can view your borrowed books, search the catalog, and track your borrowing history.
                  Remember to return books on time to avoid fines!
                </p>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;
