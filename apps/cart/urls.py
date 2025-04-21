from django.urls import path
from .views import AddItemView, GetItemsView

app_name = "cart"
urlpatterns = [
    path('cart-items', GetItemsView.as_view()),
    path('add-item', AddItemView.as_view()),
]
