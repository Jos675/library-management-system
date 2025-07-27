import axios from 'axios';
import config from './config';

// Types
export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: 'admin' | 'librarian' | 'student';
  is_active: boolean;
  created_at: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  total_copies: number;
  available_copies: number;
  shelf_location: string;
  description: string;
  publication_year?: number;
  publisher: string;
  is_available: boolean;
  borrowed_copies: number;
  created_at: string;
  updated_at: string;
}

export interface BorrowRecord {
  id: number;
  user_details: User;
  book_details: Book;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  fine_amount: string;
  is_overdue: boolean;
  days_overdue: number;
  librarian_details?: User;
  notes: string;
}

export interface LoginResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

class ApiService {
  private api: any;

  constructor() {
    this.api = axios.create({
      baseURL: config.api.url,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use((config: any) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await axios.post(
                `${this.api.defaults.baseURL}/token/refresh/`,
                { refresh: refreshToken }
              );
              
              const access = (response.data as any).access;
              localStorage.setItem('access_token', access);
              
              originalRequest.headers.Authorization = `Bearer ${access}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.api.post('/auth/login/', {
      email,
      password,
    });
    return response.data;
  }

  async register(data: {
    email: string;
    username: string;
    full_name: string;
    password: string;
    password_confirm: string;
  }): Promise<LoginResponse> {
    const response = await this.api.post('/auth/register/', data);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get('/auth/profile/');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.api.patch('/auth/profile/update/', data);
    return response.data;
  }

  // User management (Admin only)
  async getUsers(): Promise<User[]> {
    const response = await this.api.get('/auth/users/');
    return response.data;
  }

  async createUser(data: {
    email: string;
    username: string;
    full_name: string;
    password: string;
    role: string;
  }): Promise<User> {
    const response = await this.api.post('/auth/users/', data);
    return response.data;
  }

  async getStudents(): Promise<User[]> {
    const response = await this.api.get('/auth/students/');
    return response.data;
  }

  // Book methods
  async getBooks(params?: {
    search?: string;
    available_only?: boolean;
  }): Promise<ApiResponse<Book>> {
    const response = await this.api.get('/books/', { params });
    return response.data;
  }

  async getBook(id: number): Promise<Book> {
    const response = await this.api.get(`/books/${id}/`);
    return response.data;
  }

  async createBook(data: Partial<Book>): Promise<Book> {
    const response = await this.api.post('/books/', data);
    return response.data;
  }

  async updateBook(id: number, data: Partial<Book>): Promise<Book> {
    const response = await this.api.patch(`/books/${id}/`, data);
    return response.data;
  }

  async deleteBook(id: number): Promise<void> {
    await this.api.delete(`/books/${id}/`);
  }

  // OPAC search (public)
  async searchBooks(params: {
    query?: string;
    title?: string;
    author?: string;
    isbn?: string;
    category?: string;
    available_only?: boolean;
    page?: number;
  }): Promise<ApiResponse<Book>> {
    const response = await this.api.get('/books/search/', { params });
    return response.data;
  }

  async getBookCategories(): Promise<string[]> {
    const response = await this.api.get('/books/categories/');
    return response.data;
  }

  // Borrowing methods
  async borrowBook(data: {
    user_id: number;
    book_id: number;
    notes?: string;
  }): Promise<BorrowRecord> {
    const response = await this.api.post('/borrowing/borrow/', data);
    return response.data;
  }

  async returnBook(data: {
    borrow_record_id: number;
    notes?: string;
  }): Promise<BorrowRecord> {
    const response = await this.api.post('/borrowing/return/', data);
    return response.data;
  }

  async getMyBorrows(): Promise<BorrowRecord[]> {
    const response = await this.api.get('/borrowing/my-borrows/');
    return response.data;
  }

  async getCurrentBorrows(): Promise<BorrowRecord[]> {
    const response = await this.api.get('/borrowing/my-current-borrows/');
    return response.data;
  }

  async getBorrowRecords(params?: {
    status?: string;
    user_id?: number;
    book_id?: number;
  }): Promise<ApiResponse<BorrowRecord>> {
    const response = await this.api.get('/borrowing/records/', { params });
    return response.data;
  }

  async getOverdueBooks(): Promise<BorrowRecord[]> {
    const response = await this.api.get('/borrowing/overdue/');
    return response.data;
  }

  async getUserBorrowHistory(userId: number): Promise<BorrowRecord[]> {
    const response = await this.api.get(`/borrowing/user/${userId}/history/`);
    return response.data;
  }

  // Statistics
  async getBookStatistics(): Promise<any> {
    const response = await this.api.get('/books/statistics/');
    return response.data;
  }

  async getBorrowingStatistics(): Promise<any> {
    const response = await this.api.get('/borrowing/statistics/');
    return response.data;
  }
}

export const apiService = new ApiService();
