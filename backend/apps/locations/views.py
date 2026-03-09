from rest_framework import generics, permissions
from .models import Location, SubLocation
from .serializers import LocationSerializer, LocationListSerializer, SubLocationSerializer
from apps.users.permissions import IsAdminUser, IsAdminOrReadOnly


class LocationListCreateView(generics.ListCreateAPIView):
    """API endpoint for listing and creating locations"""
    
    queryset = Location.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return LocationListSerializer
        return LocationSerializer


class LocationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API endpoint for retrieving, updating, and deleting a location"""
    
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAdminOrReadOnly]


class LocationSublocationsView(generics.ListAPIView):
    """API endpoint for listing sublocations of a specific location"""
    
    serializer_class = SubLocationSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        location_id = self.kwargs['pk']
        return SubLocation.objects.filter(location_id=location_id)


class SubLocationListCreateView(generics.ListCreateAPIView):
    """API endpoint for listing and creating sublocations"""
    
    queryset = SubLocation.objects.all()
    serializer_class = SubLocationSerializer
    permission_classes = [IsAdminOrReadOnly]


class SubLocationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API endpoint for retrieving, updating, and deleting a sublocation"""
    
    queryset = SubLocation.objects.all()
    serializer_class = SubLocationSerializer
    permission_classes = [IsAdminOrReadOnly]
