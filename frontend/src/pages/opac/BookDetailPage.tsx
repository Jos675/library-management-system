import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService, Book } from '../../services/api';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadBook(parseInt(id));
    }
  }, [id]);

  const loadBook = async (bookId: number) => {
    try {
      const bookData = await apiService.getBook(bookId);
      setBook(bookData);
    } catch (error) {
      setError('Book not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Book Not Found</h1>
          <p className="text-gray-600 mb-4">The requested book could not be found.</p>
          <Link
            to="/opac"
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            ← Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/opac"
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            ← Back to Catalog
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-6">by {book.author}</p>
              
              {book.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Book Details</h3>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">ISBN</dt>
                      <dd className="text-sm text-gray-900">{book.isbn}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Category</dt>
                      <dd className="text-sm text-gray-900">
                        {book.category.charAt(0).toUpperCase() + book.category.slice(1)}
                      </dd>
                    </div>
                    {book.publisher && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Publisher</dt>
                        <dd className="text-sm text-gray-900">{book.publisher}</dd>
                      </div>
                    )}
                    {book.publication_year && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Publication Year</dt>
                        <dd className="text-sm text-gray-900">{book.publication_year}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Library Information</h3>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Shelf Location</dt>
                      <dd className="text-sm text-gray-900">{book.shelf_location}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Total Copies</dt>
                      <dd className="text-sm text-gray-900">{book.total_copies}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Available Copies</dt>
                      <dd className="text-sm text-gray-900">{book.available_copies}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Borrowed Copies</dt>
                      <dd className="text-sm text-gray-900">{book.borrowed_copies}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-center mb-4">
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                      book.is_available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {book.is_available ? 'Available for Borrowing' : 'Currently Checked Out'}
                  </span>
                </div>
                
                <div className="text-center text-sm text-gray-600 mb-4">
                  {book.is_available ? (
                    <p>This book is available for borrowing. Please visit the library or contact a librarian to borrow this book.</p>
                  ) : (
                    <p>This book is currently checked out. Please check back later or ask a librarian about availability.</p>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {book.available_copies} / {book.total_copies}
                  </div>
                  <div className="text-sm text-gray-500">Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
