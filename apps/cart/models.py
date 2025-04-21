from django.db import models
from apps.product.models import Product
from django.contrib.auth import get_user_model
User = get_user_model()

class Cart(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='cart'  # Mejor acceso desde User
    )

    @property
    def total_items(self):
        """Calcula el total de items sumando las cantidades"""
        return sum(item.count for item in self.items.all())

    def __str__(self):
        return f"Carrito de {self.user.email}"


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items'  # Mejor acceso desde Cart
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )
    count = models.IntegerField(
        default=1  # Valor por defecto al añadir productos
    )

    class Meta:
        unique_together = [['cart', 'product']]  # Evita duplicados
        indexes = [
            models.Index(fields=['cart', 'product'])  # Mejor rendimiento
        ]

    def __str__(self):
        return f"{self.count}x {self.product.name}"

    def save(self, *args, **kwargs):
        if self.count < 0:
            self.count = 0
        super().save(*args, **kwargs)