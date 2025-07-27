from django.urls import path
from . import views

urlpatterns = [
    # Borrowing operations
    path('borrow/', views.borrow_book, name='borrow_book'),
    path('return/', views.return_book, name='return_book'),
    
    # Student borrowing
    path('my-borrows/', views.my_borrows, name='my_borrows'),
    path('my-current-borrows/', views.my_current_borrows, name='my_current_borrows'),
    
    # Librarian/Admin views
    path('records/', views.BorrowRecordListView.as_view(), name='borrow_records'),
    path('overdue/', views.overdue_books, name='overdue_books'),
    path('statistics/', views.borrowing_statistics, name='borrowing_statistics'),
    path('user/<int:user_id>/history/', views.user_borrow_history, name='user_borrow_history'),
]
