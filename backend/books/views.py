from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from .models import Book, OPACSearchLog
from .serializers import (
    BookSerializer, BookSearchSerializer, OPACSearchLogSerializer,
    BookAvailabilitySerializer
)
from users.views import IsAdminUser, IsAdminOrLibrarian


class BookListCreateView(generics.ListCreateAPIView):
    """List all books or create new book (Admin/Librarian only)"""
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrLibrarian]
    
    def get_queryset(self):
        queryset = Book.objects.all()
        
        # Filter by availability if requested
        available_only = self.request.query_params.get('available_only', False)
        if available_only and available_only.lower() == 'true':
            queryset = queryset.filter(available_copies__gt=0)
        
        # Search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(author__icontains=search) |
                Q(isbn__icontains=search) |
                Q(category__icontains=search)
            )
        
        return queryset.order_by('title')


class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a book (Admin/Librarian only)"""
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrLibrarian]


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def opac_search(request):
    """Public OPAC search endpoint"""
    search_params = {
        'query': request.GET.get('query', ''),
        'title': request.GET.get('title', ''),
        'author': request.GET.get('author', ''),
        'isbn': request.GET.get('isbn', ''),
        'category': request.GET.get('category', ''),
        'available_only': request.GET.get('available_only', 'false').lower() == 'true'
    }
    
    # Build query
    queryset = Book.objects.all()
    
    # General search across multiple fields
    if search_params['query']:
        queryset = queryset.filter(
            Q(title__icontains=search_params['query']) |
            Q(author__icontains=search_params['query']) |
            Q(isbn__icontains=search_params['query']) |
            Q(description__icontains=search_params['query'])
        )
    
    # Specific field searches
    if search_params['title']:
        queryset = queryset.filter(title__icontains=search_params['title'])
    
    if search_params['author']:
        queryset = queryset.filter(author__icontains=search_params['author'])
    
    if search_params['isbn']:
        queryset = queryset.filter(isbn__icontains=search_params['isbn'])
    
    if search_params['category']:
        queryset = queryset.filter(category__iexact=search_params['category'])
    
    # Filter by availability
    if search_params['available_only']:
        queryset = queryset.filter(available_copies__gt=0)
    
    # Log the search
    search_query = search_params['query'] or f"title:{search_params['title']} author:{search_params['author']} isbn:{search_params['isbn']} category:{search_params['category']}"
    search_type = 'general'
    
    if search_params['title'] and not any([search_params['query'], search_params['author'], search_params['isbn'], search_params['category']]):
        search_type = 'title'
    elif search_params['author'] and not any([search_params['query'], search_params['title'], search_params['isbn'], search_params['category']]):
        search_type = 'author'
    elif search_params['isbn'] and not any([search_params['query'], search_params['title'], search_params['author'], search_params['category']]):
        search_type = 'isbn'
    elif search_params['category'] and not any([search_params['query'], search_params['title'], search_params['author'], search_params['isbn']]):
        search_type = 'category'
    
    # Create search log
    OPACSearchLog.objects.create(
        user=request.user if request.user.is_authenticated else None,
        search_query=search_query.strip(),
        search_type=search_type,
        results_count=queryset.count()
    )
    
    # Paginate results
    from rest_framework.pagination import PageNumberPagination
    paginator = PageNumberPagination()
    paginator.page_size = 20
    result_page = paginator.paginate_queryset(queryset, request)
    
    serializer = BookAvailabilitySerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def book_categories(request):
    """Get list of available book categories"""
    categories = [choice[0] for choice in Book.CATEGORY_CHOICES]
    return Response(categories)


@api_view(['GET'])
@permission_classes([IsAdminOrLibrarian])
def search_logs(request):
    """Get OPAC search logs (Admin/Librarian only)"""
    logs = OPACSearchLog.objects.all()[:100]  # Last 100 searches
    serializer = OPACSearchLogSerializer(logs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminOrLibrarian])
def book_statistics(request):
    """Get book statistics (Admin/Librarian only)"""
    total_books = Book.objects.count()
    total_copies = sum(book.total_copies for book in Book.objects.all())
    available_copies = sum(book.available_copies for book in Book.objects.all())
    borrowed_copies = total_copies - available_copies
    
    # Most popular books (by borrow count)
    from borrowing.models import BorrowRecord
    from django.db.models import Count
    
    popular_books = Book.objects.annotate(
        borrow_count=Count('borrow_records')
    ).order_by('-borrow_count')[:10]
    
    return Response({
        'total_books': total_books,
        'total_copies': total_copies,
        'available_copies': available_copies,
        'borrowed_copies': borrowed_copies,
        'popular_books': BookSerializer(popular_books, many=True).data
    })
