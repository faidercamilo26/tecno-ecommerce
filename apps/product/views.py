from django.shortcuts import render
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.product.models import Product
from apps.product.serializers import ProductSerializer
from apps.category.models import Category

from django.db.models import Q

class ProductDetailView(APIView):
    permissions_classes = [permissions.AllowAny]
    
    def get(self, request, productId, format=None):
        try:
            product_id = int(productId)
        except:
            return Response({'error': 'Product ID must be an integer'}, status=status.HTTP_400_BAD_REQUEST)
        
        if Product.objects.filter(id=product_id).exists():
            response = Product.objects.get(id=product_id)
            product = ProductSerializer(response)
            return Response({'product': product.data}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Product does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        
class ListProductsView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        sortBy = request.query_params.get('sortBy')

        if not (sortBy == 'date_created' or sortBy == 'price' or sortBy == 'sold' or sortBy == 'name'):
            sortBy = '-date_created'
        
        order = request.query_params.get('order')
        limit = request.query_params.get('limit')

        if not limit:
            limit = -1
        
        try:
            limit = int(limit)
        except:
            return Response(
                {'error': 'Limit must be an integer'},
                status=status.HTTP_404_NOT_FOUND)
        
        if limit <= 0:
            limit = -1
        
        if order == 'desc':
            sortBy = '-' + sortBy
            products = Product.objects.order_by(sortBy).all()[:int(limit)]
        elif order == 'asc':
            products = Product.objects.order_by(sortBy).all()[:int(limit)]
        else:
            products = Product.objects.order_by(sortBy).all()

        
        products = ProductSerializer(products, many=True)

        if products:
            return Response({'products': products.data}, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'No products to list'},
                status=status.HTTP_404_NOT_FOUND)

            
class ListSearchView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data


        search = data['search']

        # Chequear si se agrego texto en la busqueda
        if len(search) == 0:
            # mostrar todos los productos si no hay input en la busqueda
            search_results = Product.objects.order_by('-date_created').all()
        else:
            # Si hay criterio de busqueda, filtramos con dicho criterio usando Q
            search_results = Product.objects.filter(
                Q(description__icontains=search) | Q(name__icontains=search)
            )
        
        search_results = ProductSerializer(search_results, many=True)
        return Response({'search_products': search_results.data}, status=status.HTTP_200_OK)

class ListRelatedView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, productId, format=None):
        try:
            product_id = int(productId)
        except:
            return Response(
                {'error': 'Product ID must be an integer'},
                status=status.HTTP_404_NOT_FOUND)
        
        # Existe product id
        if not Product.objects.filter(id=product_id).exists():
            return Response(
                {'error': 'Product with this product ID does not exist'},
                status=status.HTTP_404_NOT_FOUND)
            
        category = Product.objects.get(id=product_id).category

        if Product.objects.filter(category=category).exists():
            # Si la categoria tiene padre filtrar solo por la categoria y no el padre tambien
            if category.parent:
                related_products = Product.objects.order_by(
                    '-sold'
                ).filter(category=category)
            else:
                if not Category.objects.filter(parent=category).exists():
                    related_products = Product.objects.order_by(
                        '-sold'
                    ).filter(category=category)
                
                else:
                    categories = Category.objects.filter(parent=category)
                    filtered_categories = [category]

                    for cat in categories:
                        filtered_categories.append(cat)

                    filtered_categories = tuple(filtered_categories)
                    related_products = Product.objects.order_by(
                        '-sold'
                    ).filter(category__in=filtered_categories)
                
            #Excluir producto que estamos viendo
            related_products = related_products.exclude(id=product_id)
            related_products = ProductSerializer(related_products, many=True)

            if len(related_products.data) > 3:
                return Response(
                    {'related_products': related_products.data[:3]},
                    status=status.HTTP_200_OK)
            elif len(related_products.data) > 0:
                return Response(
                    {'related_products': related_products.data},
                    status=status.HTTP_200_OK)
            else:
                return Response(
                    {'error': 'No related products found'},
                    status=status.HTTP_200_OK)
            
        else:
            return Response(
                {'error': 'No related products found'},
                status=status.HTTP_200_OK)
            

class ListBySearchView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data

        categories_id = data['categories_id']        
        price_range = data['price_range']
        sort_by = data['sort_by']

        if not (sort_by == 'date_created' or sort_by == 'price' or sort_by == 'sold' or sort_by == 'name'):
            sort_by = 'date_created'

        order = data['order']

        ## Si la lista categories_id esta vacia, filtrar todas las categorias
        if len(categories_id) == 0:
            product_results = Product.objects.all()
            
            
        for category_id in categories_id:
            if not Category.objects.filter(id=category_id).exists():
                return Response(
                    {'error': f'Category {category_id} does not exist'},
                    status=status.HTTP_404_NOT_FOUND)
                
        if len(categories_id) > 0:
            product_results = Product.objects.filter(category__id__in=categories_id)

        # Filtrar por precio
        if "".join(price_range.split()) == '1-300':
            product_results = product_results.filter(price__gte=1)
            product_results = product_results.filter(price__lt=300)
        elif "".join(price_range.split()) == '300-600':
            product_results = product_results.filter(price__gte=300)
            product_results = product_results.filter(price__lt=600)
        elif "".join(price_range.split()) == '600-900':
            product_results = product_results.filter(price__gte=600)
            product_results = product_results.filter(price__lt=900)
        elif "".join(price_range.split()) == '900-1200':
            product_results = product_results.filter(price__gte=900)
            product_results = product_results.filter(price__lt=1200)
        elif price_range.strip().lower() == 'more than 1200':
            product_results = product_results.filter(price__gte=1200)
        
        #Filtrar producto por sort_by
        if order == 'desc':
            sort_by = '-' + sort_by
            product_results = product_results.order_by(sort_by)
        elif order == 'asc':
            product_results = product_results.order_by(sort_by)
        else:
            product_results = product_results.order_by(sort_by)
        
        product_results = ProductSerializer(product_results, many=True)

        if len(product_results.data) > 0:
            return Response(
                {'filtered_products': product_results.data},
                status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'No products found'},
                status=status.HTTP_404_NOT_FOUND)