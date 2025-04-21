from django.db import models

# Create your models here.
class Category(models.Model):
    class Meta:
        verbose_name = "category"
        verbose_name_plural = "categories"
        
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    name = models.CharField(max_length=255, unique=True)
    
    def __str__(self):
        return self.name