from django.urls import path
from .views import (
    HouseListCreateView,
    HouseDetailView,
    HouseStatusUpdateView,
    HouseImageUploadView,
    HouseImageDeleteView,
)

urlpatterns = [
    path('houses/', HouseListCreateView.as_view(), name='house-list'),
    path('houses/<int:pk>/', HouseDetailView.as_view(), name='house-detail'),
    path('houses/<int:pk>/status/', HouseStatusUpdateView.as_view(), name='house-status'),
    path('houses/<int:pk>/images/', HouseImageUploadView.as_view(), name='house-image-upload'),
    path('house-images/<int:pk>/', HouseImageDeleteView.as_view(), name='house-image-delete'),
]
