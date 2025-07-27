from rest_framework import serializers
from django.utils import timezone
from django.conf import settings
from .models import BorrowRecord
from books.serializers import BookSerializer
from users.serializers import UserSerializer


class BorrowRecordSerializer(serializers.ModelSerializer):
    book_details = BookSerializer(source='book', read_only=True)
    user_details = UserSerializer(source='user', read_only=True)
    librarian_details = UserSerializer(source='librarian', read_only=True)
    is_overdue = serializers.ReadOnlyField()
    days_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = BorrowRecord
        fields = '__all__'
        read_only_fields = ('borrow_date', 'due_date', 'fine_amount')


class BorrowBookSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    book_id = serializers.IntegerField()
    notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        from users.models import User
        from books.models import Book
        
        # Validate user exists and is a student
        try:
            user = User.objects.get(id=attrs['user_id'])
            if not user.is_student:
                raise serializers.ValidationError("Only students can borrow books")
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        
        # Validate book exists and is available
        try:
            book = Book.objects.get(id=attrs['book_id'])
            if not book.is_available:
                raise serializers.ValidationError("Book is not available")
        except Book.DoesNotExist:
            raise serializers.ValidationError("Book not found")
        
        # Check if user already has this book
        existing_borrow = BorrowRecord.objects.filter(
            user=user,
            book=book,
            status__in=['borrowed', 'overdue']
        ).exists()
        
        if existing_borrow:
            raise serializers.ValidationError("User already has this book borrowed")
        
        # Check borrowing limit
        max_books = getattr(settings, 'LIBRARY_SETTINGS', {}).get('MAX_BOOKS_PER_STUDENT', 3)
        current_borrows = BorrowRecord.objects.filter(
            user=user,
            status__in=['borrowed', 'overdue']
        ).count()
        
        if current_borrows >= max_books:
            raise serializers.ValidationError(f"User has reached maximum borrowing limit of {max_books} books")
        
        attrs['user'] = user
        attrs['book'] = book
        return attrs


class ReturnBookSerializer(serializers.Serializer):
    borrow_record_id = serializers.IntegerField()
    notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate_borrow_record_id(self, value):
        try:
            borrow_record = BorrowRecord.objects.get(
                id=value,
                status__in=['borrowed', 'overdue']
            )
            return borrow_record
        except BorrowRecord.DoesNotExist:
            raise serializers.ValidationError("Active borrow record not found")


class StudentBorrowHistorySerializer(serializers.ModelSerializer):
    book_details = BookSerializer(source='book', read_only=True)
    is_overdue = serializers.ReadOnlyField()
    days_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = BorrowRecord
        fields = (
            'id', 'book_details', 'borrow_date', 'due_date', 'return_date',
            'status', 'fine_amount', 'is_overdue', 'days_overdue'
        )
