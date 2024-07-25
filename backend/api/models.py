from django.db import models

# Location database so we can store for django to process
class Location (models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    
    def __str__(self):
        return f"Location at {self.latitude}, {self.longitude}"