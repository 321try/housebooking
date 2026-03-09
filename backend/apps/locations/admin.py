from django.contrib import admin
from .models import Location, SubLocation


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_by', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(SubLocation)
class SubLocationAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'created_at']
    search_fields = ['name', 'description', 'location__name']
    list_filter = ['location', 'created_at']
    readonly_fields = ['created_at', 'updated_at']
