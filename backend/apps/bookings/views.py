from rest_framework import generics, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import Booking
from .serializers import (
    BookingSerializer,
    BookingListSerializer,
    BookingStatusSerializer,
    BookingRescheduleSerializer
)
from apps.users.permissions import IsAdminUser, IsOwnerOrAdmin


class BookingListCreateView(generics.ListCreateAPIView):
    """API endpoint for listing and creating bookings"""
    
    queryset = Booking.objects.all()
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'house', 'check_in', 'check_out']
    search_fields = ['booking_code', 'house__name', 'user__name', 'guest_name']
    ordering_fields = ['check_in', 'check_out', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return BookingListSerializer
        return BookingSerializer
    
    def get_queryset(self):
        """Filter queryset based on user role"""
        user = self.request.user
        
        # Admins can see all bookings
        if user.is_authenticated and user.role == 'ADMIN':
            return Booking.objects.all()
        
        # Regular users can only see their own bookings via /my/ endpoint
        # Public endpoint returns empty for non-admins
        return Booking.objects.none()


class UserBookingsView(generics.ListAPIView):
    """API endpoint for viewing user's own bookings"""
    
    serializer_class = BookingListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'house']
    ordering_fields = ['check_in', 'check_out', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)


class BookingDetailView(generics.RetrieveAPIView):
    """API endpoint for retrieving a booking"""
    
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsOwnerOrAdmin]


class BookingStatusUpdateView(generics.UpdateAPIView):
    """API endpoint for updating booking status"""
    
    queryset = Booking.objects.all()
    serializer_class = BookingStatusSerializer
    permission_classes = [IsAdminUser]
    
    def perform_update(self, serializer):
        serializer.save(managed_by=self.request.user)


class BookingRescheduleView(generics.UpdateAPIView):
    """API endpoint for rescheduling booking dates"""
    
    queryset = Booking.objects.all()
    serializer_class = BookingRescheduleSerializer
    permission_classes = [IsAdminUser]
    
    def perform_update(self, serializer):
        instance = serializer.save(managed_by=self.request.user)
        # Add a note about the reschedule
        reschedule_note = f"\n[Rescheduled by admin on {instance.updated_at.strftime('%b %d, %Y %H:%M')}]"
        if instance.notes:
            instance.notes += reschedule_note
        else:
            instance.notes = reschedule_note.strip()
        instance.save()
