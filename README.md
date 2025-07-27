# Balimo College Library Management System

A modern, full-featured Library Management System built with React, TypeScript, Django, and TailwindCSS. This system provides comprehensive library operations management with role-based access control and a clean, intuitive user interface.

## 🌟 Features

### For Students
- **Public Catalog (OPAC)**: Search and browse books without authentication
- **Account Management**: Personal profile and borrowing history
- **Book Reservations**: Reserve available books for borrowing
- **Fine Tracking**: View outstanding fines and payment history
- **Reading History**: Track previously borrowed books
- Detailed book information pages

### 📋 Borrowing System
- Student borrowing limits (max 3 books)
- 14-day borrowing period
- Automatic overdue tracking
- Fine calculation (PGK 1.00/day)

### 📊 Analytics & Reporting
- Borrowing statistics
- Popular books tracking
- Search analytics
- User activity monitoring

## Technology Stack

### Backend
- **Framework**: Django 5.2.4 with Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT-based authentication
- **API**: RESTful API with role-based permissions

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Axios

## Project Structure

```
library_system/
├── backend/                    # Django backend
│   ├── users/                 # User management app
│   ├── books/                 # Book management app
│   ├── borrowing/             # Borrowing system app
│   ├── library_system/        # Main Django project
│   ├── manage.py
│   └── requirements.txt
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React contexts
│   │   ├── services/         # API services
│   │   └── App.tsx
│   ├── public/
│   └── package.json
└── README.md
```

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Create initial data:
```bash
python manage.py create_initial_data
```

7. Start development server:
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Demo Accounts

The system comes with pre-configured demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@balimocollege.edu.pg | admin123 |
| Librarian | librarian@balimocollege.edu.pg | librarian123 |
| Student | john.student@balimocollege.edu.pg | student123 |

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - Student registration
- `GET /api/auth/profile/` - Get user profile

### Books
- `GET /api/books/` - List books (Admin/Librarian)
- `POST /api/books/` - Create book (Admin/Librarian)
- `GET /api/books/search/` - OPAC search (Public)
- `GET /api/books/categories/` - Get categories (Public)

### Borrowing
- `POST /api/borrowing/borrow/` - Borrow book (Librarian)
- `POST /api/borrowing/return/` - Return book (Librarian)
- `GET /api/borrowing/my-borrows/` - Student's borrows
- `GET /api/borrowing/overdue/` - Overdue books (Librarian)

## Business Rules

### Borrowing Limits
- Students can borrow maximum 3 books at a time
- Borrowing period is 14 days
- Books automatically marked overdue after due date

### Fines
- PGK 1.00 per day for overdue books
- Fines calculated automatically

### User Roles
- Only admins can create users and assign roles
- Librarians can manage books and process borrowing
- Students have read-only access to OPAC and their own records

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (for production)
DB_NAME=library_management
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
```

### Frontend Configuration

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

## Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Install dependencies: `pip install -r requirements.txt`
4. Run migrations: `python manage.py migrate`
5. Create superuser: `python manage.py createsuperuser`
6. Collect static files: `python manage.py collectstatic`

### Frontend Deployment
1. Build the application: `npm run build`
2. Serve the build directory with a web server

## Features in Detail

### Admin Dashboard
- Complete user management (create, edit, delete users)
- System-wide statistics and reporting
- Book inventory management
- Borrowing record oversight

### Librarian Dashboard
- Book borrowing/returning interface
- Inventory management
- Overdue book tracking
- Student record management

### Student Dashboard
- Personal borrowing history
- Current borrowed books with due dates
- OPAC search access
- Fine and overdue tracking

### OPAC Features
- Advanced search capabilities
- Category filtering
- Availability status
- Detailed book information
- Search logging for analytics

## Support

For issues and questions, please create an issue in the project repository or contact the development team.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
