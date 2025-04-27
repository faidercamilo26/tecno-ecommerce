from django.db import models
from datetime import datetime
from apps.category.models import Category
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFit
import io
from django.core.files.base import ContentFile
from PIL import Image, ImageOps

from django.conf import settings
bucket_name = settings.AWS_STORAGE_BUCKET_NAME
region = settings.AWS_S3_REGION_NAME

class Product(models.Model):
    name = models.CharField(max_length=255)
    photo = models.ImageField(upload_to='photos/%Y/%m/')
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    compare_price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    sold = models.IntegerField(default=0)
    date_created = models.DateTimeField(default=datetime.now)
    
    def save(self, *args, **kwargs):
        """Redimensiona la imagen manteniendo la relación de aspecto y agregando relleno si es necesario"""
        if self.photo:
            img = Image.open(self.photo)

            # Definir el tamaño de destino
            target_size = (800, 1200)

            # Mantener la relación de aspecto y agregar fondo blanco
            img = ImageOps.pad(img, target_size, color=(255, 255, 255))

            # Guardar la imagen en un buffer
            img_io = io.BytesIO()
            img.save(img_io, format='JPEG', quality=80)
            img_content = ContentFile(img_io.getvalue(), self.photo.name)

            # Reemplazar la imagen original
            self.photo = img_content

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name