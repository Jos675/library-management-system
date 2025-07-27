"""
Management command to create initial data for the library system
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from books.models import Book
from datetime import datetime

User = get_user_model()


class Command(BaseCommand):
    help = 'Create initial data for library system'

    def handle(self, *args, **options):
        # Create admin user
        if not User.objects.filter(email='admin@balimocollege.edu.pg').exists():
            admin = User.objects.create_user(
                email='admin@balimocollege.edu.pg',
                username='admin',
                full_name='System Administrator',
                password='admin123',
                role='admin'
            )
            admin.is_staff = True
            admin.is_superuser = True
            admin.save()
            self.stdout.write(self.style.SUCCESS('Admin user created'))

        # Create librarian user
        if not User.objects.filter(email='librarian@balimocollege.edu.pg').exists():
            User.objects.create_user(
                email='librarian@balimocollege.edu.pg',
                username='librarian',
                full_name='Mary Librarian',
                password='librarian123',
                role='librarian'
            )
            self.stdout.write(self.style.SUCCESS('Librarian user created'))

        # Create sample student users
        students = [
            {
                'email': 'john.student@balimocollege.edu.pg',
                'username': 'john.student',
                'full_name': 'John Student',
                'password': 'student123'
            },
            {
                'email': 'jane.student@balimocollege.edu.pg',
                'username': 'jane.student',
                'full_name': 'Jane Student',
                'password': 'student123'
            }
        ]

        for student_data in students:
            if not User.objects.filter(email=student_data['email']).exists():
                User.objects.create_user(
                    email=student_data['email'],
                    username=student_data['username'],
                    full_name=student_data['full_name'],
                    password=student_data['password'],
                    role='student'
                )
                self.stdout.write(self.style.SUCCESS(f'Student {student_data["full_name"]} created'))

        # Create sample books
        sample_books = [
            {
                'title': 'Introduction to Computer Science',
                'author': 'John Smith',
                'isbn': '9781234567890',
                'category': 'technology',
                'total_copies': 5,
                'available_copies': 5,
                'shelf_location': 'A1-B2',
                'description': 'A comprehensive introduction to computer science concepts.',
                'publication_year': 2020,
                'publisher': 'Tech Books Inc.'
            },
            {
                'title': 'Papua New Guinea History',
                'author': 'Maria Johnson',
                'isbn': '9781234567891',
                'category': 'history',
                'total_copies': 3,
                'available_copies': 3,
                'shelf_location': 'B1-C3',
                'description': 'Complete history of Papua New Guinea.',
                'publication_year': 2019,
                'publisher': 'PNG Historical Society'
            },
            {
                'title': 'Mathematics for Engineers',
                'author': 'David Wilson',
                'isbn': '9781234567892',
                'category': 'science',
                'total_copies': 4,
                'available_copies': 4,
                'shelf_location': 'C2-D1',
                'description': 'Advanced mathematics concepts for engineering students.',
                'publication_year': 2021,
                'publisher': 'Academic Press'
            },
            {
                'title': 'English Literature Classics',
                'author': 'Sarah Brown',
                'isbn': '9781234567893',
                'category': 'literature',
                'total_copies': 6,
                'available_copies': 6,
                'shelf_location': 'D3-E2',
                'description': 'Collection of classic English literature.',
                'publication_year': 2018,
                'publisher': 'Literary Works'
            },
            {
                'title': 'Business Management Principles',
                'author': 'Robert Davis',
                'isbn': '9781234567894',
                'category': 'education',
                'total_copies': 3,
                'available_copies': 3,
                'shelf_location': 'E1-F2',
                'description': 'Fundamental principles of business management.',
                'publication_year': 2022,
                'publisher': 'Business Education Ltd'
            }
        ]

        for book_data in sample_books:
            if not Book.objects.filter(isbn=book_data['isbn']).exists():
                Book.objects.create(**book_data)
                self.stdout.write(self.style.SUCCESS(f'Book "{book_data["title"]}" created'))

        self.stdout.write(self.style.SUCCESS('Initial data creation completed!'))
        self.stdout.write(self.style.WARNING('Login credentials:'))
        self.stdout.write(self.style.WARNING('Admin: admin@balimocollege.edu.pg / admin123'))
        self.stdout.write(self.style.WARNING('Librarian: librarian@balimocollege.edu.pg / librarian123'))
        self.stdout.write(self.style.WARNING('Student: john.student@balimocollege.edu.pg / student123'))
