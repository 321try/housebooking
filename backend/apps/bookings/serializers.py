from rest_framework import serializers
from django.utils import timezone
from .models import Booking
from apps.houses.serializers import HouseListSerializer


class BookingSerializer(serializers.ModelSerializer):
    """Detailed serializer for Booking model"""
    
    house_detail = HouseListSerializer(source='house', read_only=True)
    customer_name = serializers.CharField(read_only=True)
    customer_phone = serializers.CharField(read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'booking_code', 'house', 'house_detail',
            'user', 'guest_name', 'guest_phone',
            'customer_name', 'customer_phone',
            'check_in', 'check_out', 'status', 'notes',
            'managed_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'booking_code', 'user', 'managed_by', 'created_at', 'updated_at']
    
    def validate(self, data):
        """Validate booking data"""
        check_in = data.get('check_in')
        check_out = data.get('check_out')
        
        # Validate dates
        if check_in and check_out:
            if check_in >= check_out:
                raise serializers.ValidationError("Check-out date must be after check-in date")
            
            if check_in < timezone.now():
                raise serializers.ValidationError("Check-in date cannot be in the past")
        
        # For guest bookings, either user or guest details must be provided
        user = self.context['request'].user if self.context['request'].user.is_authenticated else None
        guest_name = data.get('guest_name')
        guest_phone = data.get('guest_phone')
        
        if not user and not (guest_name and guest_phone):
            raise serializers.ValidationError(
                "Either user authentication or guest details (name and phone) are required"
            )
        
        return data
    
    def create(self, validated_data):
        # Set user if authenticated
        if self.context['request'].user.is_authenticated:
            validated_data['user'] = self.context['request'].user
        
        return super().create(validated_data)


class BookingListSerializer(serializers.ModelSerializer):
    """Simplified serializer for booking lists"""
    
    house_name = serializers.CharField(source='house.name', read_only=True)
    customer_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'booking_code', 'house_name', 'customer_name',
            'check_in', 'check_out', 'status', 'created_at'
        ]


class BookingStatusSerializer(serializers.ModelSerializer):
    """Serializer for updating booking status"""
    
    class Meta:
        model = Booking
        fields = ['status', 'notes']
