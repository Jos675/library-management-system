import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService, Book, ApiResponse } from '../../services/api';

const OPACPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('query');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [pagination, setPagination] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
  }>({
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadCategories();
    searchBooks();
  }, []);

  const loadCategories = async () => {
    try {
      const categoryList = await apiService.getBookCategories();
      setCategories(categoryList);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const searchBooks = async (page: number = 1) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        available_only: availableOnly,
      };

      if (searchQuery.trim()) {
        if (searchType === 'query') {
          params.query = searchQuery;
        } else {
          params[searchType] = searchQuery;
        }
      }

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const response: ApiResponse<Book> = await apiService.searchBooks(params);
      setBooks(response.results);
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous,
      });
      setCurrentPage(page);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchBooks(1);
  };

  const handlePageChange = (page: number) => {
    searchBooks(page);
    window.scrollTo(0, 0);
  };

  const getTotalPages = () => {
    return Math.ceil(pagination.count / 20); // 20 items per page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Balimo College Library Catalog (OPAC)
          </h1>
          <p className="text-lg text-gray-600">
            Search and discover books in our library collection
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Type
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="query">All Fields</option>
                  <option value="title">Title</option>
                  <option value="author">Author</option>
                  <option value="isbn">ISBN</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Available only</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter search terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            {pagination.count} book{pagination.count !== 1 ? 's' : ''} found
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {books.map((book) => (
                <div key={book.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <Link
                      to={`/opac/book/${book.id}`}
                      className="hover:text-primary-600"
                    >
                      {book.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-1">by {book.author}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    Category: {book.category.charAt(0).toUpperCase() + book.category.slice(1)}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">ISBN: {book.isbn}</p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600">
                      Location: {book.shelf_location}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        book.is_available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {book.is_available ? 'Available' : 'Checked Out'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span>Available: {book.available_copies} / {book.total_copies}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {getTotalPages() > 1 && (
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.previous}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="px-3 py-2 text-gray-700">
                  Page {currentPage} of {getTotalPages()}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.next}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {books.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No books found. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OPACPage;
