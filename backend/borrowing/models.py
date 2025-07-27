from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.conf import settings


class BorrowRecord(models.Model):
    """Model for tracking book borrowing and returns"""
    
    STATUS_CHOICES = [
        ('borrowed', 'Borrowed'),
        ('returned', 'Returned'),
        ('overdue', 'Overdue'),
    ]
    
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='borrow_records')
    book = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='borrow_records')
    borrow_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    return_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='borrowed')
    fine_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    librarian = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, 
                                related_name='processed_borrows')
    notes = models.TextField(blank=True)
    
    def save(self, *args, **kwargs):
        # Set due date automatically if not provided
        if not self.due_date:
            borrow_period = getattr(settings, 'LIBRARY_SETTINGS', {}).get('BORROW_PERIOD_DAYS', 14)
            self.due_date = timezone.now() + timedelta(days=borrow_period)
        
        # Update status based on dates
        if not self.return_date and timezone.now().date() > self.due_date.date():
            self.status = 'overdue'
        elif self.return_date:
            self.status = 'returned'
        
        # Calculate fine for overdue books
        if self.status == 'overdue' and not self.return_date:
            days_overdue = (timezone.now().date() - self.due_date.date()).days
            fine_per_day = getattr(settings, 'LIBRARY_SETTINGS', {}).get('FINE_PER_DAY', 1.0)
            self.fine_amount = max(0, days_overdue * fine_per_day)
        
        super().save(*args, **kwargs)
    
    def return_book(self, librarian=None):
        """Mark book as returned"""
        self.return_date = timezone.now()
        self.status = 'returned'
        if librarian:
            self.librarian = librarian
        
        # Calculate final fine if returned late
        if self.return_date.date() > self.due_date.date():
            days_overdue = (self.return_date.date() - self.due_date.date()).days
            fine_per_day = getattr(settings, 'LIBRARY_SETTINGS', {}).get('FINE_PER_DAY', 1.0)
            self.fine_amount = days_overdue * fine_per_day
        
        self.save()
        
        # Update book availability
        self.book.available_copies += 1
        self.book.save()
    
    @property
    def is_overdue(self):
        if self.return_date:
            return False
        return timezone.now().date() > self.due_date.date()
    
    @property
    def days_overdue(self):
        if not self.is_overdue:
            return 0
        return (timezone.now().date() - self.due_date.date()).days
    
    def __str__(self):
        return f"{self.user.full_name} - {self.book.title} ({self.status})"
    
    class Meta:
        db_table = 'borrow_records'
        ordering = ['-borrow_date']
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'book'],
                condition=models.Q(status__in=['borrowed', 'overdue']),
                name='unique_active_borrow'
            )
        ]
