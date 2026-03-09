from django.urls import path
from .views import (
    BookingListCreateView,
    UserBookingsView,
    BookingDetailView,
    BookingStatusUpdateView,
    BookingRescheduleView,
)

urlpatterns = [
    path('bookings/', BookingListCreateView.as_view(), name='booking-list'),
    path('bookings/my/', UserBookingsView.as_view(), name='user-bookings'),
    path('bookings/<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),
    path('bookings/<int:pk>/status/', BookingStatusUpdateView.as_view(), name='booking-status'),
    path('bookings/<int:pk>/reschedule/', BookingRescheduleView.as_view(), name='booking-reschedule'),
]