from django.urls import path
from .views import (
    LocationListCreateView,
    LocationDetailView,
    LocationSublocationsView,
    SubLocationListCreateView,
    SubLocationDetailView,
)

urlpatterns = [
    path('locations/', LocationListCreateView.as_view(), name='location-list'),
    path('locations/<int:pk>/', LocationDetailView.as_view(), name='location-detail'),
    path('locations/<int:pk>/sublocations/', LocationSublocationsView.as_view(), name='location-sublocations'),
    path('sublocations/', SubLocationListCreateView.as_view(), name='sublocation-list'),
    path('sublocations/<int:pk>/', SubLocationDetailView.as_view(), name='sublocation-detail'),
]
