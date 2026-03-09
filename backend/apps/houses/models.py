from django.db import models
from django.conf import settings
from apps.locations.models import Location, SubLocation


class House(models.Model):
    """House model for property listings"""
    
    TYPE_CHOICES = [
        ('HOUSE', 'House'),
        ('BNB', 'Bed & Breakfast'),
    ]
    
    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('BOOKED', 'Booked'),
        ('MAINTENANCE', 'Maintenance'),
        ('UNAVAILABLE', 'Unavailable'),
    ]
    
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='HOUSE')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='AVAILABLE')
    
    location = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        related_name='houses'
    )
    sublocation = models.ForeignKey(
        SubLocation,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='houses'
    )
    
    amenities = models.JSONField(default=dict, blank=True)
    available_from = models.DateTimeField(null=True, blank=True)
    available_to = models.DateTimeField(null=True, blank=True)
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_houses'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'houses'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class HouseImage(models.Model):
    """Model for house images and videos"""
    
    MEDIA_TYPE_CHOICES = [
        ('IMAGE', 'Image'),
        ('VIDEO', 'Video'),
    ]
    
    house = models.ForeignKey(
        House,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image_url = models.URLField(max_length=500)
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES, default='IMAGE')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'house_images'
        ordering = ['-is_primary', 'created_at']
    
    def __str__(self):
        return f"{self.house.name} - {'Primary' if self.is_primary else 'Secondary'} {self.media_type}"
    
    def save(self, *args, **kwargs):
        # Ensure only one primary image per house
        if self.is_primary:
            HouseImage.objects.filter(house=self.house, is_primary=True).update(is_primary=False)
        super().save(*args, **kwargs)
