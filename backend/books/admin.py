from django.contrib import admin
from .models import Book, OPACSearchLog


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'total_copies', 'available_copies', 'is_available', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('title', 'author', 'isbn')
    ordering = ('title',)
    readonly_fields = ('created_at', 'updated_at', 'is_available', 'borrowed_copies')
    
    fieldsets = (
        ('Book Information', {
            'fields': ('title', 'author', 'isbn', 'category', 'description')
        }),
        ('Publication Details', {
            'fields': ('publisher', 'publication_year')
        }),
        ('Library Management', {
            'fields': ('total_copies', 'available_copies', 'shelf_location')
        }),
        ('System Information', {
            'fields': ('is_available', 'borrowed_copies', 'created_at', 'updated_at')
        }),
    )


@admin.register(OPACSearchLog)
class OPACSearchLogAdmin(admin.ModelAdmin):
    list_display = ('search_query', 'search_type', 'user', 'results_count', 'timestamp')
    list_filter = ('search_type', 'timestamp')
    search_fields = ('search_query', 'user__full_name', 'user__email')
    ordering = ('-timestamp',)
    readonly_fields = ('timestamp',)
