from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'photo',
            'description',
            'price',
            'compare_price',
            'category',
            'quantity',
            'sold',
            'date_created',
            'image_url'
        ]
        
        
    def get_image_url(self, obj):
        return obj.photo.url if obj.photo else None
    
    
    #https://tecno-ecommerce-2001-26.s3.amazonaws.com/media/photos/2025/04/destok_computer.jpg
    #https://tecno-ecommerce-2001-26.s3.us-east-2.amazonaws.com/photos/2025/04/destok_computer.jpg