from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import BorrowRecord
from .serializers import (
    BorrowRecordSerializer, BorrowBookSerializer, ReturnBookSerializer,
    StudentBorrowHistorySerializer
)
from users.views import IsAdminUser, IsAdminOrLibrarian


@api_view(['POST'])
@permission_classes([IsAdminOrLibrarian])
def borrow_book(request):
    """Borrow a book (Librarian/Admin only)"""
    serializer = BorrowBookSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        book = serializer.validated_data['book']
        notes = serializer.validated_data.get('notes', '')
        
        # Create borrow record
        borrow_record = BorrowRecord.objects.create(
            user=user,
            book=book,
            librarian=request.user,
            notes=notes
        )
        
        # Update book availability
        book.available_copies -= 1
        book.save()
        
        return Response(
            BorrowRecordSerializer(borrow_record).data,
            status=status.HTTP_201_CREATED
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAdminOrLibrarian])
def return_book(request):
    """Return a book (Librarian/Admin only)"""
    serializer = ReturnBookSerializer(data=request.data)
    if serializer.is_valid():
        borrow_record = serializer.validated_data['borrow_record_id']
        notes = serializer.validated_data.get('notes', '')
        
        # Add notes if provided
        if notes:
            borrow_record.notes = f"{borrow_record.notes}\nReturn notes: {notes}"
        
        # Return the book
        borrow_record.return_book(librarian=request.user)
        
        return Response(
            BorrowRecordSerializer(borrow_record).data,
            status=status.HTTP_200_OK
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_borrows(request):
    """Get current user's borrow history"""
    if not request.user.is_student:
        return Response(
            {'error': 'Only students can view borrow history'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    borrows = BorrowRecord.objects.filter(user=request.user).order_by('-borrow_date')
    serializer = StudentBorrowHistorySerializer(borrows, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_current_borrows(request):
    """Get current user's active borrows"""
    if not request.user.is_student:
        return Response(
            {'error': 'Only students can view current borrows'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    borrows = BorrowRecord.objects.filter(
        user=request.user,
        status__in=['borrowed', 'overdue']
    ).order_by('-borrow_date')
    
    serializer = StudentBorrowHistorySerializer(borrows, many=True)
    return Response(serializer.data)


class BorrowRecordListView(generics.ListAPIView):
    """List all borrow records (Admin/Librarian only)"""
    serializer_class = BorrowRecordSerializer
    permission_classes = [IsAdminOrLibrarian]
    
    def get_queryset(self):
        queryset = BorrowRecord.objects.all().order_by('-borrow_date')
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by user
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        # Filter by book
        book_id = self.request.query_params.get('book_id', None)
        if book_id:
            queryset = queryset.filter(book_id=book_id)
        
        return queryset


@api_view(['GET'])
@permission_classes([IsAdminOrLibrarian])
def overdue_books(request):
    """Get list of overdue books"""
    overdue_records = BorrowRecord.objects.filter(
        status='overdue'
    ).order_by('due_date')
    
    serializer = BorrowRecordSerializer(overdue_records, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminOrLibrarian])
def borrowing_statistics(request):
    """Get borrowing statistics (Admin/Librarian only)"""
    from django.db.models import Count, Avg
    from datetime import timedelta
    
    total_borrows = BorrowRecord.objects.count()
    active_borrows = BorrowRecord.objects.filter(status__in=['borrowed', 'overdue']).count()
    overdue_borrows = BorrowRecord.objects.filter(status='overdue').count()
    
    # Most active students
    active_students = BorrowRecord.objects.values(
        'user__full_name', 'user__id'
    ).annotate(
        borrow_count=Count('id')
    ).order_by('-borrow_count')[:10]
    
    # Recent borrows (last 30 days)
    recent_date = timezone.now() - timedelta(days=30)
    recent_borrows = BorrowRecord.objects.filter(
        borrow_date__gte=recent_date
    ).count()
    
    return Response({
        'total_borrows': total_borrows,
        'active_borrows': active_borrows,
        'overdue_borrows': overdue_borrows,
        'recent_borrows': recent_borrows,
        'active_students': active_students
    })


@api_view(['GET'])
@permission_classes([IsAdminOrLibrarian])
def user_borrow_history(request, user_id):
    """Get specific user's borrow history (Admin/Librarian only)"""
    borrows = BorrowRecord.objects.filter(user_id=user_id).order_by('-borrow_date')
    serializer = BorrowRecordSerializer(borrows, many=True)
    return Response(serializer.data)
