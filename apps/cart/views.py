from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .models import Cart, CartItem
from rest_framework.permissions import IsAuthenticated

from apps.product.models import Product
from apps.product.serializers import ProductSerializer

# Create your views here.


class GetItemsView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    
    def get(self, request):
        try:
            cart = request.user.cart
            cart_items = cart.items.select_related('product').all()
            
            total_items = cart.total_items
            total_price = sum(item.product.price * item.count for item in cart_items)
            total_compare_price = sum(item.product.compare_price * item.count for item in cart_items)
            
            result = []
            if cart_items:
                for cart_item in cart_items:
                    
                    item = {}
                    
                    item['id'] = cart_item.id
                    item['count'] = cart_item.count
                    product = Product.objects.get(id=cart_item.product.id)
                    product = ProductSerializer(product)
                    item['product'] = product.data
                    
                    result.append(item)
            return Response({
                'items': result,
                'total_items': total_items,
                'total_price': total_price,
                'total_compare_price': total_compare_price
            }, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Something went wrong when retrieving cart items'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
            
class AddItemView(APIView):
    permission_classes = [IsAuthenticated]  

    def post(self, request):
        # Obtener datos del request
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        # Validaciones básicas
        if not product_id or quantity <= 0:
            return Response(
                {'error': 'product_id y quantity (positiva) son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            # Obtener usuario y carrito
            try:
                cart = request.user.cart  # Acceso directo desde el usuario autenticado
            except Cart.DoesNotExist:
                # Si no existe el carrito, se crea uno nuevo
                cart = Cart.objects.create(user=request.user)

            # Bloquear producto para evitar condiciones de carrera
            try:
                product = Product.objects.select_for_update().get(id=product_id)
            except Product.DoesNotExist:
                return Response(
                    {'error': 'Producto no encontrado'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Buscar o crear el ítem en el carrito
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'count': 0}
            )

            # Calcular nueva cantidad
            new_quantity = cart_item.count + quantity

            # Validar inventario
            if new_quantity > product.quantity:
                available = product.inventory - cart_item.count
                return Response(
                    {'error': f'Inventario insuficiente. Máximo disponible: {available}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Actualizar
            cart_item.count = new_quantity
            cart_item.save()

            return Response({
                'message': 'Producto agregado al carrito',
                'cart_item_id': cart_item.id,
                'quantity': new_quantity
            }, status=status.HTTP_200_OK)
            
            
class RemoveItemView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request, cart_item_id):
        try:
            cart_item = CartItem.objects.get(id=cart_item_id)
            if cart_item.cart.user != request.user:
                return Response({'error': 'You do not have permission to remove this item from your cart'},
                                status=status.HTTP_403_FORBIDDEN)
            cart_item.delete()
            return Response({'message': 'Item removed succesfuly from cart'}, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

class EmptyCartView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        try: 
            cart = request.user.cart
            cart.items.all().delete()
            return Response({'message': 'Cart emptied succesfuly'}, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
              return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
       

