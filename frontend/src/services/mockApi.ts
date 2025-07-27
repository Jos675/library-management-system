/**
 * Mock API Service for Live Demo
 * Provides simulated backend functionality when no real API is available
 */

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@library.com',
    first_name: 'Admin',
    last_name: 'User',
    role: 'admin',
    is_active: true
  },
  {
    id: 2,
    username: 'librarian',
    password: 'lib123',
    email: 'librarian@library.com',
    first_name: 'John',
    last_name: 'Librarian',
    role: 'librarian',
    is_active: true
  },
  {
    id: 3,
    username: 'student',
    password: 'student123',
    email: 'student@library.com',
    first_name: 'Jane',
    last_name: 'Student',
    role: 'student',
    is_active: true
  },
  {
    id: 4,
    username: 'demo',
    password: 'demo123',
    email: 'demo@library.com',
    first_name: 'Demo',
    last_name: 'User',
    role: 'student',
    is_active: true
  }
];

// Mock books data
const MOCK_BOOKS = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0-7432-7356-5",
    publication_year: 1925,
    category: "Fiction",
    availability_status: "available",
    location: "A-001",
    description: "A classic American novel set in the Jazz Age."
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    publication_year: 1960,
    category: "Fiction",
    availability_status: "borrowed",
    location: "A-002",
    description: "A story of racial injustice and childhood innocence."
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    isbn: "978-0-452-28423-4",
    publication_year: 1949,
    category: "Science Fiction",
    availability_status: "available",
    location: "SF-001",
    description: "A dystopian social science fiction novel."
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-0-14-143951-8",
    publication_year: 1813,
    category: "Romance",
    availability_status: "available",
    location: "R-001",
    description: "A romantic novel of manners."
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "978-0-316-76948-0",
    publication_year: 1951,
    category: "Fiction",
    availability_status: "available",
    location: "A-003",
    description: "A controversial novel about teenage rebellion."
  }
];

/**
 * Mock API class that simulates backend responses
 */
class MockApiService {
  private isOnline: boolean = false;

  constructor() {
    // Check if we're in a production environment without a real API
    this.isOnline = this.shouldUseMockData();
  }

  private shouldUseMockData(): boolean {
    // Use mock data if we're on GitHub Pages or if API is not accessible
    const isGitHubPages = window.location.hostname.includes('github.io');
    const isLocalhost = window.location.hostname === 'localhost';
    
    return isGitHubPages || (!isLocalhost && process.env.NODE_ENV === 'production');
  }

  /**
   * Mock login functionality
   */
  async login(credentials: { username: string; password: string }) {
    if (!this.isOnline) {
      throw new Error('Mock API not active');
    }

    // Simulate network delay
    await this.delay(1000);

    const user = MOCK_USERS.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    return {
      access_token: `mock_token_${user.id}_${Date.now()}`,
      refresh_token: `mock_refresh_${user.id}_${Date.now()}`,
      user: userWithoutPassword
    };
  }

  /**
   * Mock registration functionality
   */
  async register(userData: any) {
    if (!this.isOnline) {
      throw new Error('Mock API not active');
    }

    await this.delay(1500);

    // Simulate successful registration
    const newUser = {
      id: MOCK_USERS.length + 1,
      ...userData,
      role: 'student', // Default role for new registrations
      is_active: true
    };

    const { password, ...userWithoutPassword } = newUser;

    return {
      access_token: `mock_token_${newUser.id}_${Date.now()}`,
      refresh_token: `mock_refresh_${newUser.id}_${Date.now()}`,
      user: userWithoutPassword
    };
  }

  /**
   * Mock books search functionality
   */
  async searchBooks(query: string = '', filters: any = {}) {
    if (!this.isOnline) {
      throw new Error('Mock API not active');
    }

    await this.delay(800);

    let filteredBooks = [...MOCK_BOOKS];

    // Apply search query
    if (query) {
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category) {
      filteredBooks = filteredBooks.filter(book =>
        book.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Apply availability filter
    if (filters.availability) {
      filteredBooks = filteredBooks.filter(book =>
        book.availability_status === filters.availability
      );
    }

    return {
      books: filteredBooks,
      total: filteredBooks.length,
      page: 1,
      per_page: filteredBooks.length
    };
  }

  /**
   * Mock user profile functionality
   */
  async getCurrentUser() {
    if (!this.isOnline) {
      throw new Error('Mock API not active');
    }

    await this.delay(500);

    // Get user from localStorage (set during login)
    const userData = localStorage.getItem('user');
    if (!userData) {
      throw new Error('Not authenticated');
    }

    return JSON.parse(userData);
  }

  /**
   * Check if mock API should be used
   */
  shouldUseMock(): boolean {
    return this.isOnline;
  }

  /**
   * Get demo credentials for display
   */
  getDemoCredentials() {
    return [
      { username: 'admin', password: 'admin123', role: 'Admin' },
      { username: 'librarian', password: 'lib123', role: 'Librarian' },
      { username: 'student', password: 'student123', role: 'Student' },
      { username: 'demo', password: 'demo123', role: 'Demo User' }
    ];
  }

  /**
   * Utility function to simulate network delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockApiService = new MockApiService();
export default MockApiService;
