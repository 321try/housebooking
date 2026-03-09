from rest_framework import generics, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import House, HouseImage
from .serializers import (
    HouseSerializer,
    HouseListSerializer,
    HouseStatusSerializer,
    HouseImageSerializer
)
from apps.users.permissions import IsAdminUser, IsAdminOrReadOnly
import cloudinary.uploader


class HouseListCreateView(generics.ListCreateAPIView):
    """API endpoint for listing and creating houses"""
    
    queryset = House.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'status', 'location', 'sublocation']
    search_fields = ['name', 'description', 'location__name', 'sublocation__name']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return HouseListSerializer
        return HouseSerializer


class HouseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API endpoint for retrieving, updating, and deleting a house"""
    
    queryset = House.objects.all()
    serializer_class = HouseSerializer
    permission_classes = [IsAdminOrReadOnly]


class HouseStatusUpdateView(generics.UpdateAPIView):
    """API endpoint for updating house status"""
    
    queryset = House.objects.all()
    serializer_class = HouseStatusSerializer
    permission_classes = [IsAdminUser]


class HouseImageUploadView(APIView):
    """API endpoint for uploading house images and videos"""
    
    permission_classes = [IsAdminUser]
    
    def post(self, request, pk):
        try:
            house = House.objects.get(pk=pk)
        except House.DoesNotExist:
            return Response({'error': 'House not found'}, status=status.HTTP_404_NOT_FOUND)
        
        media_file = request.FILES.get('image')
        is_primary = request.data.get('is_primary', False)
        
        if not media_file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Determine media type
            is_video = media_file.content_type.startswith('video/')
            media_type = 'VIDEO' if is_video else 'IMAGE'
            
            # Upload to Cloudinary with appropriate settings
            if is_video:
                upload_result = cloudinary.uploader.upload(
                    media_file,
                    folder='housebooking/houses',
                    resource_type='video'
                )
            else:
                upload_result = cloudinary.uploader.upload(
                    media_file,
                    folder='housebooking/houses',
                    transformation=[
                        {'width': 1200, 'height': 800, 'crop': 'limit'},
                        {'quality': 'auto'},
                    ]
                )
            
            # Create HouseImage instance
            house_image = HouseImage.objects.create(
                house=house,
                image_url=upload_result['secure_url'],
                media_type=media_type,
                is_primary=is_primary and not is_video  # Videos can't be primary
            )
            
            serializer = HouseImageSerializer(house_image)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class HouseImageDeleteView(generics.DestroyAPIView):
    """API endpoint for deleting house images"""
    
    queryset = HouseImage.objects.all()
    permission_classes = [IsAdminUser]
