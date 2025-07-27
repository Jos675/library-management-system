# Project Setup Instructions

This guide will walk you through setting up the Balimo College Library Management System on your local machine.

## System Requirements

- **Python**: 3.8 or higher
- **Node.js**: 16.0 or higher
- **Git**: Latest version
- **Code Editor**: VS Code recommended

## Step-by-Step Setup

### 1. Clone or Download the Project

If you have the project files, ensure they're in your desired directory.

### 2. Backend Setup (Django)

Open a terminal/command prompt and navigate to the project directory:

```powershell
cd "C:\Users\KTF-RBBAS24-092\Desktop\Lib"
```

#### 2.1 Navigate to Backend Directory
```powershell
cd backend
```

#### 2.2 Create Python Virtual Environment
```powershell
python -m venv venv
```

#### 2.3 Activate Virtual Environment
```powershell
venv\Scripts\activate
```

You should see `(venv)` at the beginning of your command prompt.

#### 2.4 Install Python Dependencies
```powershell
pip install -r requirements.txt
```

#### 2.5 Run Database Migrations
```powershell
python manage.py migrate
```

#### 2.6 Create Initial Demo Data
```powershell
python manage.py shell
```

Then paste this code:
```python
from users.models import CustomUser
from books.models import Book, Category
from borrowing.models import BorrowRecord
from datetime import date, timedelta

# Create categories
fiction, _ = Category.objects.get_or_create(name='Fiction')
non_fiction, _ = Category.objects.get_or_create(name='Non-Fiction')
science, _ = Category.objects.get_or_create(name='Science')
history, _ = Category.objects.get_or_create(name='History')

# Create users
admin = CustomUser.objects.create_user(
    email='admin@balimocollege.edu.pg',
    password='admin123',
    first_name='System',
    last_name='Administrator',
    role='admin'
)

librarian = CustomUser.objects.create_user(
    email='librarian@balimocollege.edu.pg',
    password='librarian123',
    first_name='Jane',
    last_name='Librarian',
    role='librarian'
)

student = CustomUser.objects.create_user(
    email='john.student@balimocollege.edu.pg',
    password='student123',
    first_name='John',
    last_name='Student',
    role='student',
    student_id='STU001'
)

# Create sample books
books_data = [
    {
        'title': 'To Kill a Mockingbird',
        'author': 'Harper Lee',
        'isbn': '978-0-06-112008-4',
        'category': fiction,
        'total_copies': 5,
        'shelf_location': 'A1-001'
    },
    {
        'title': 'The History of Papua New Guinea',
        'author': 'John Waiko',
        'isbn': '978-0-521-82364-7',
        'category': history,
        'total_copies': 3,
        'shelf_location': 'H2-045'
    },
    {
        'title': 'Introduction to Computer Science',
        'author': 'David Evans',
        'isbn': '978-1-4493-9156-9',
        'category': science,
        'total_copies': 8,
        'shelf_location': 'S3-120'
    },
    {
        'title': 'Papua New Guinea: A Country Study',
        'author': 'Tim Flannery',
        'isbn': '978-0-8248-1454-8',
        'category': non_fiction,
        'total_copies': 4,
        'shelf_location': 'NF1-030'
    }
]

for book_data in books_data:
    Book.objects.get_or_create(**book_data)

print("Demo data created successfully!")
exit()
```

#### 2.7 Start Django Development Server
```powershell
python manage.py runserver
```

Keep this terminal open. The backend will run at `http://localhost:8000`

### 3. Frontend Setup (React)

Open a **new** terminal/command prompt and navigate to the project directory:

```powershell
cd "C:\Users\KTF-RBBAS24-092\Desktop\Lib"
```

#### 3.1 Navigate to Frontend Directory
```powershell
cd frontend
```

#### 3.2 Install Node.js Dependencies
```powershell
npm install
```

This will install all required packages including React, TypeScript, and TailwindCSS.

#### 3.3 Start React Development Server
```powershell
npm start
```

The frontend will automatically open in your browser at `http://localhost:3000`

## Demo Accounts

You can now log in with these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@balimocollege.edu.pg | admin123 |
| Librarian | librarian@balimocollege.edu.pg | librarian123 |
| Student | john.student@balimocollege.edu.pg | student123 |

## Troubleshooting

### Python Issues

**Error: 'python' is not recognized**
- Install Python from python.org
- Ensure Python is added to your PATH

**Error: No module named 'django'**
- Make sure your virtual environment is activated
- Run `pip install -r requirements.txt` again

### Node.js Issues

**Error: 'npm' is not recognized**
- Install Node.js from nodejs.org
- Restart your terminal after installation

**Error: npm install fails**
- Try deleting `node_modules` folder and `package-lock.json`
- Run `npm install` again

### Port Conflicts

**Error: Port already in use**
- For Django: Use `python manage.py runserver 8001`
- For React: The system will automatically suggest a different port

### Database Issues

**Error: no such table**
- Run `python manage.py migrate` again
- If issues persist, delete `db.sqlite3` and run migrations again

## Next Steps

Once both servers are running:

1. Visit `http://localhost:3000` in your browser
2. Try logging in with the demo accounts
3. Explore the different user dashboards
4. Test the OPAC search functionality
5. Try borrowing books as a librarian

## Development Workflow

- Backend changes: Restart the Django server (`Ctrl+C` then `python manage.py runserver`)
- Frontend changes: React will automatically reload in the browser
- Database changes: Run `python manage.py makemigrations` then `python manage.py migrate`

## File Structure

```
Lib/
├── backend/                 # Django backend
│   ├── users/              # User management
│   ├── books/              # Book management
│   ├── borrowing/          # Borrowing system
│   └── library_system/     # Main project
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── public/
└── README.md
```

The system is now ready for development and testing!
