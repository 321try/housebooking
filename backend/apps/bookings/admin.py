from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['booking_code', 'house', 'customer_name', 'check_in', 'check_out', 'status', 'created_at']
    list_filter = ['status', 'check_in', 'check_out', 'created_at']
    search_fields = ['booking_code', 'house__name', 'user__name', 'guest_name', 'guest_phone']
    readonly_fields = ['booking_code', 'created_at', 'updated_at']
    
    def customer_name(self, obj):
        return obj.customer_name
    customer_name.short_description = 'Customer'
