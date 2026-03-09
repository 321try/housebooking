from django.db import models
from django.conf import settings
from apps.houses.models import House
import random
import string


def generate_booking_code():
    """Generate a unique 8-character booking code"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))


class Booking(models.Model):
    """Booking model for house reservations"""
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('DONE', 'Done'),
        ('POSTPONED', 'Postponed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    booking_code = models.CharField(max_length=8, unique=True, editable=False)
    house = models.ForeignKey(
        House,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='bookings'
    )
    
    # Guest information (for non-logged-in users)
    guest_name = models.CharField(max_length=255, blank=True)
    guest_phone = models.CharField(max_length=20, blank=True)
    
    check_in = models.DateTimeField()
    check_out = models.DateTimeField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    notes = models.TextField(blank=True)
    
    managed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='managed_bookings'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bookings'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.booking_code} - {self.house.name}"
    
    def save(self, *args, **kwargs):
        if not self.booking_code:
            # Generate unique booking code
            while True:
                code = generate_booking_code()
                if not Booking.objects.filter(booking_code=code).exists():
                    self.booking_code = code
                    break
        super().save(*args, **kwargs)
    
    @property
    def customer_name(self):
        """Return the name of the customer (user or guest)"""
        if self.user:
            return self.user.name
        return self.guest_name
    
    @property
    def customer_phone(self):
        """Return the phone of the customer (user or guest)"""
        if self.user:
            return self.user.phone_number
        return self.guest_phone
