from django.contrib import admin
from .models import BorrowRecord


@admin.register(BorrowRecord)
class BorrowRecordAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'borrow_date', 'due_date', 'return_date', 'status', 'fine_amount', 'is_overdue')
    list_filter = ('status', 'borrow_date', 'due_date', 'return_date')
    search_fields = ('user__full_name', 'user__email', 'book__title', 'book__author')
    ordering = ('-borrow_date',)
    readonly_fields = ('borrow_date', 'is_overdue', 'days_overdue')
    
    fieldsets = (
        ('Borrow Information', {
            'fields': ('user', 'book', 'librarian')
        }),
        ('Dates', {
            'fields': ('borrow_date', 'due_date', 'return_date')
        }),
        ('Status & Fines', {
            'fields': ('status', 'fine_amount', 'is_overdue', 'days_overdue')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
    )
