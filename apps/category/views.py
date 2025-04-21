from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions

from .models import Category

class ListCategoryView(APIView):
    permissions_classes = (permissions.AllowAny,)
    
    def get(self, request, format=None):
        if Category.objects.all().exists():
            categories = Category.objects.all()
            
            result = []
            for category in categories:
                subcategories = []
                if category.parent is None:
                    if category.children.all().exists():
                        for child in category.children.all():
                            subcategories.append({
                                'id': child.id,
                                'name': child.name,
                            })
                    result.append({
                        'id': category.id,
                        'name': category.name,
                        'subcategories': subcategories,
                    })
            return Response({"categories":result}, status=status.HTTP_200_OK)
        else:
            return Response({"categories":[]}, status=status.HTTP_404_NOT_FOUND)
                