from rest_framework import serializers
from .models import Location, SubLocation


class SubLocationSerializer(serializers.ModelSerializer):
    """Serializer for SubLocation model"""
    
    class Meta:
        model = SubLocation
        fields = ['id', 'name', 'description', 'location', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class LocationSerializer(serializers.ModelSerializer):
    """Serializer for Location model"""
    
    sublocations = SubLocationSerializer(many=True, read_only=True)
    sublocation_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Location
        fields = ['id', 'name', 'description', 'sublocations', 'sublocation_count', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def get_sublocation_count(self, obj):
        return obj.sublocations.count()
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class LocationListSerializer(serializers.ModelSerializer):
    """Simplified serializer for location lists"""
    
    sublocation_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Location
        fields = ['id', 'name', 'description', 'sublocation_count']
    
    def get_sublocation_count(self, obj):
        return obj.sublocations.count()
