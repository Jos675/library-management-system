from django.db import models
from django.core.validators import MinValueValidator


class Book(models.Model):
    """Book model for library catalog"""
    
    CATEGORY_CHOICES = [
        ('fiction', 'Fiction'),
        ('non-fiction', 'Non-Fiction'),
        ('science', 'Science'),
        ('technology', 'Technology'),
        ('history', 'History'),
        ('biography', 'Biography'),
        ('education', 'Education'),
        ('reference', 'Reference'),
        ('literature', 'Literature'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=500)
    author = models.CharField(max_length=255)
    isbn = models.CharField(max_length=13, unique=True, help_text="13-digit ISBN")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    total_copies = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    available_copies = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    shelf_location = models.CharField(max_length=50, help_text="e.g., A1-B2")
    description = models.TextField(blank=True)
    publication_year = models.PositiveIntegerField(null=True, blank=True)
    publisher = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} by {self.author}"
    
    @property
    def is_available(self):
        return self.available_copies > 0
    
    @property
    def borrowed_copies(self):
        return self.total_copies - self.available_copies
    
    def save(self, *args, **kwargs):
        # Ensure available copies doesn't exceed total copies
        if self.available_copies > self.total_copies:
            self.available_copies = self.total_copies
        super().save(*args, **kwargs)
    
    class Meta:
        db_table = 'books'
        ordering = ['title']


class OPACSearchLog(models.Model):
    """Log OPAC search queries for analytics"""
    
    user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True)
    search_query = models.CharField(max_length=500)
    search_type = models.CharField(max_length=50, choices=[
        ('title', 'Title'),
        ('author', 'Author'),
        ('isbn', 'ISBN'),
        ('category', 'Category'),
        ('general', 'General Search'),
    ], default='general')
    timestamp = models.DateTimeField(auto_now_add=True)
    results_count = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        user_str = self.user.full_name if self.user else "Anonymous"
        return f"{user_str}: {self.search_query} ({self.timestamp})"
    
    class Meta:
        db_table = 'opac_search_logs'
        ordering = ['-timestamp']
