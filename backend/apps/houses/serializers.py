from rest_framework import serializers
from .models import House, HouseImage
from apps.locations.serializers import LocationListSerializer, SubLocationSerializer


class HouseImageSerializer(serializers.ModelSerializer):
    """Serializer for HouseImage model"""
    
    class Meta:
        model = HouseImage
        fields = ['id', 'image_url', 'media_type', 'is_primary', 'created_at']
        read_only_fields = ['id', 'created_at']


class HouseSerializer(serializers.ModelSerializer):
    """Detailed serializer for House model"""
    
    images = HouseImageSerializer(many=True, read_only=True)
    location_detail = LocationListSerializer(source='location', read_only=True)
    sublocation_detail = SubLocationSerializer(source='sublocation', read_only=True)
    
    class Meta:
        model = House
        fields = [
            'id', 'name', 'description', 'price', 'type', 'status',
            'location', 'location_detail', 'sublocation', 'sublocation_detail',
            'amenities', 'available_from', 'available_to',
            'images', 'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class HouseListSerializer(serializers.ModelSerializer):
    """Simplified serializer for house lists"""
    
    location_name = serializers.CharField(source='location.name', read_only=True)
    sublocation_name = serializers.CharField(source='sublocation.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = House
        fields = [
            'id', 'name', 'description', 'price', 'type', 'status',
            'location_name', 'sublocation_name', 'primary_image', 'created_at'
        ]
    
    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return HouseImageSerializer(primary_image).data
        # Return first image if no primary image is set
        first_image = obj.images.first()
        if first_image:
            return HouseImageSerializer(first_image).data
        return None


class HouseStatusSerializer(serializers.ModelSerializer):
    """Serializer for updating house status"""
    
    class Meta:
        model = House
        fields = ['status']
