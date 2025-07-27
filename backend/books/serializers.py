from rest_framework import serializers
from .models import Book, OPACSearchLog


class BookSerializer(serializers.ModelSerializer):
    is_available = serializers.ReadOnlyField()
    borrowed_copies = serializers.ReadOnlyField()
    
    class Meta:
        model = Book
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
    
    def validate(self, attrs):
        # Ensure available copies doesn't exceed total copies
        if 'available_copies' in attrs and 'total_copies' in attrs:
            if attrs['available_copies'] > attrs['total_copies']:
                raise serializers.ValidationError(
                    "Available copies cannot exceed total copies"
                )
        return attrs


class BookSearchSerializer(serializers.Serializer):
    query = serializers.CharField(required=False, allow_blank=True)
    title = serializers.CharField(required=False, allow_blank=True)
    author = serializers.CharField(required=False, allow_blank=True)
    isbn = serializers.CharField(required=False, allow_blank=True)
    category = serializers.CharField(required=False, allow_blank=True)
    available_only = serializers.BooleanField(default=False)


class OPACSearchLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = OPACSearchLog
        fields = '__all__'
        read_only_fields = ('timestamp',)


class BookAvailabilitySerializer(serializers.ModelSerializer):
    """Simplified serializer for OPAC catalog display"""
    is_available = serializers.ReadOnlyField()
    borrowed_copies = serializers.ReadOnlyField()
    
    class Meta:
        model = Book
        fields = (
            'id', 'title', 'author', 'isbn', 'category', 'shelf_location',
            'description', 'publication_year', 'publisher', 'total_copies',
            'available_copies', 'is_available', 'borrowed_copies'
        )
