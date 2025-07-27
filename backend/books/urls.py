from django.urls import path
from . import views

urlpatterns = [
    # Book management
    path('', views.BookListCreateView.as_view(), name='book_list_create'),
    path('<int:pk>/', views.BookDetailView.as_view(), name='book_detail'),
    
    # OPAC (Public access)
    path('search/', views.opac_search, name='opac_search'),
    path('categories/', views.book_categories, name='book_categories'),
    
    # Analytics (Admin/Librarian only)
    path('search-logs/', views.search_logs, name='search_logs'),
    path('statistics/', views.book_statistics, name='book_statistics'),
]
