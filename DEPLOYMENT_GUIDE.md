# Production Deployment Guide
## Balimo College Library Management System

### Overview
This is a comprehensive Library Management System built with modern web technologies and following clean architecture principles. The system provides role-based access control and complete library operations management.

## Technical Stack

### Backend
- **Framework**: Django 5.2.4 REST Framework
- **Database**: PostgreSQL (production) / SQLite (development)
- **Authentication**: JWT (JSON Web Tokens)
- **Python Version**: 3.8+

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS v3.4.17
- **State Management**: React Context API
- **Build Tool**: Create React App

## Prerequisites

### System Requirements
- **Node.js**: v16+ with npm
- **Python**: 3.8+
- **PostgreSQL**: 12+ (for production)
- **Git**: For version control

### Development Tools (Optional)
- Visual Studio Code with extensions:
  - Python
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense

## Quick Start Guide

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Lib
```

### 2. Backend Setup

#### Environment Configuration
Create `backend/.env`:
```env
# Django Settings
DEBUG=False
SECRET_KEY=your-super-secret-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database Configuration (Production)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=balimo_library_db
DB_USER=library_user
DB_PASSWORD=secure_password_here
DB_HOST=localhost
DB_PORT=5432

# Development Database (SQLite)
# Leave above variables empty to use SQLite

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=60
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7

# Email Configuration (Optional)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Security Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
CSRF_TRUSTED_ORIGINS=https://yourdomain.com

# Media and Static Files
MEDIA_URL=/media/
STATIC_URL=/static/

# Feature Flags
ENABLE_REGISTRATION=True
ENABLE_FINE_SYSTEM=True
DEFAULT_FINE_PER_DAY=1.00
MAX_BORROWING_DAYS=14
```

#### Install Dependencies
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

#### Database Setup
```bash
# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data (optional)
python manage.py loaddata fixtures/sample_data.json
```

#### Start Backend Server
```bash
python manage.py runserver
```
Backend runs on: http://localhost:8000

### 3. Frontend Setup

#### Environment Configuration
Create `frontend/.env`:
```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_API_TIMEOUT=10000

# Application Settings
REACT_APP_APP_NAME=Balimo College Library
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_REGISTRATION=true
REACT_APP_ENABLE_GUEST_ACCESS=true
REACT_APP_MAINTENANCE_MODE=false

# Security
REACT_APP_JWT_STORAGE_KEY=library_token
REACT_APP_USER_STORAGE_KEY=library_user

# UI Configuration
REACT_APP_ITEMS_PER_PAGE=10
REACT_APP_DEFAULT_THEME=light
```

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Start Frontend Development Server
```bash
npm start
```
Frontend runs on: http://localhost:3000

## Production Deployment

### Backend Production Setup

#### 1. Server Configuration
```bash
# Install system dependencies
sudo apt update
sudo apt install python3-pip python3-venv postgresql postgresql-contrib nginx

# Create application user
sudo useradd --system --home /opt/library --shell /bin/bash library
sudo mkdir -p /opt/library
sudo chown library:library /opt/library
```

#### 2. Database Setup
```bash
# PostgreSQL setup
sudo -u postgres createuser --interactive library
sudo -u postgres createdb balimo_library_db -O library
```

#### 3. Application Deployment
```bash
# Deploy code
sudo -u library git clone <repository-url> /opt/library/app
cd /opt/library/app/backend

# Setup virtual environment
sudo -u library python3 -m venv /opt/library/venv
sudo -u library /opt/library/venv/bin/pip install -r requirements.txt

# Configure environment
sudo -u library cp .env.production .env
# Edit .env with production values

# Run migrations
sudo -u library /opt/library/venv/bin/python manage.py migrate
sudo -u library /opt/library/venv/bin/python manage.py collectstatic --noinput

# Create superuser
sudo -u library /opt/library/venv/bin/python manage.py createsuperuser
```

#### 4. Gunicorn Configuration
Create `/opt/library/app/backend/gunicorn.conf.py`:
```python
bind = "127.0.0.1:8000"
workers = 3
worker_class = "sync"
timeout = 30
keepalive = 2
user = "library"
max_requests = 1000
max_requests_jitter = 100
preload_app = True
```

#### 5. Systemd Service
Create `/etc/systemd/system/library-backend.service`:
```ini
[Unit]
Description=Balimo Library Backend
After=network.target

[Service]
Type=exec
User=library
Group=library
WorkingDirectory=/opt/library/app/backend
Environment=PATH=/opt/library/venv/bin
ExecStart=/opt/library/venv/bin/gunicorn -c gunicorn.conf.py library.wsgi:application
ExecReload=/bin/kill -s HUP $MAINPID
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start service:
```bash
sudo systemctl enable library-backend
sudo systemctl start library-backend
```

### Frontend Production Build

#### 1. Build for Production
```bash
cd frontend

# Update environment for production
cp .env.production .env
# Edit API_URL to point to production backend

# Build
npm run build
```

#### 2. Nginx Configuration
Create `/etc/nginx/sites-available/library`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Frontend
    location / {
        root /opt/library/app/frontend/build;
        try_files $uri $uri/ /index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static files
    location /static/ {
        alias /opt/library/app/backend/staticfiles/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Media files
    location /media/ {
        alias /opt/library/app/backend/media/;
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/library /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 3. SSL Certificate (Optional but Recommended)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## User Roles & Permissions

### Admin
- Full system access
- User management
- System configuration
- Reports and analytics
- Backup and maintenance

### Librarian
- Book management (add, edit, delete)
- Borrowing operations
- Fine management
- User assistance
- Inventory management

### Student
- Book search and browsing
- Borrowing requests
- Account management
- Fine payments
- Reading history

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Refresh JWT token
- `POST /api/auth/register/` - User registration (if enabled)

### Book Management
- `GET /api/books/` - List/search books
- `POST /api/books/` - Create book (Admin/Librarian)
- `GET /api/books/{id}/` - Book details
- `PUT /api/books/{id}/` - Update book (Admin/Librarian)
- `DELETE /api/books/{id}/` - Delete book (Admin)

### Borrowing Operations
- `GET /api/borrowing/` - List borrowing records
- `POST /api/borrowing/` - Create borrowing record
- `PUT /api/borrowing/{id}/return/` - Return book
- `PUT /api/borrowing/{id}/renew/` - Renew borrowing

### User Management
- `GET /api/users/` - List users (Admin/Librarian)
- `GET /api/users/profile/` - Current user profile
- `PUT /api/users/profile/` - Update profile

## Troubleshooting

### Common Issues

#### Backend Issues
1. **Database Connection Error**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql
   
   # Check database settings in .env
   ```

2. **Migration Errors**
   ```bash
   # Reset migrations (development only)
   python manage.py migrate users zero
   python manage.py migrate
   ```

3. **Permission Denied**
   ```bash
   # Fix file permissions
   sudo chown -R library:library /opt/library/
   ```

#### Frontend Issues
1. **Build Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **API Connection Issues**
   - Check REACT_APP_API_URL in .env
   - Verify CORS settings in Django
   - Check network connectivity

### Logs
- **Backend logs**: `journalctl -u library-backend -f`
- **Nginx logs**: `/var/log/nginx/error.log`
- **Frontend logs**: Browser Developer Tools Console

## Maintenance

### Regular Tasks
1. **Database Backup**
   ```bash
   sudo -u postgres pg_dump balimo_library_db > backup_$(date +%Y%m%d).sql
   ```

2. **Update Dependencies**
   ```bash
   # Backend
   pip list --outdated
   pip install -U package-name
   
   # Frontend
   npm outdated
   npm update
   ```

3. **Log Rotation**
   - Configure logrotate for application logs
   - Monitor disk space usage

### Security Updates
- Regularly update system packages
- Monitor Django security advisories
- Update Node.js and npm
- Review and rotate secrets

## Support

### Documentation
- Django: https://docs.djangoproject.com/
- React: https://reactjs.org/docs/
- TailwindCSS: https://tailwindcss.com/docs

### Development Team
- Lead Developer: [Your Name]
- Email: [your-email@example.com]
- Project Repository: [repository-url]

## License
This project is proprietary software developed for Balimo College.

---
**Balimo College Library Management System v1.0.0**  
*Production-ready deployment guide*
