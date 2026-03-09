from django.db import models
from django.conf import settings


class Location(models.Model):
    """Location model for main areas"""
    
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_locations'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'locations'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class SubLocation(models.Model):
    """SubLocation model for specific areas within a location"""
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    location = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        related_name='sublocations'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'sublocations'
        ordering = ['location', 'name']
        unique_together = ['location', 'name']
    
    def __str__(self):
        return f"{self.location.name} - {self.name}"
