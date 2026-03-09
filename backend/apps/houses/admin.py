from django.contrib import admin
from .models import House, HouseImage


class HouseImageInline(admin.TabularInline):
    model = HouseImage
    extra = 1


@admin.register(House)
class HouseAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'status', 'price', 'location', 'sublocation', 'created_at']
    list_filter = ['type', 'status', 'location', 'created_at']
    search_fields = ['name', 'description', 'location__name', 'sublocation__name']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [HouseImageInline]


@admin.register(HouseImage)
class HouseImageAdmin(admin.ModelAdmin):
    list_display = ['house', 'is_primary', 'created_at']
    list_filter = ['is_primary', 'created_at']
    search_fields = ['house__name']
