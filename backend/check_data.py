import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'ecommerce_project.settings'

import django
django.setup()

from api.models import Product, Category

print("=== CATEGORIES ===")
for c in Category.objects.all():
    print(f"  {c.id}: {c.name}")

print("\n=== ALL PRODUCTS ===")
for p in Product.objects.all():
    print(f"  ID={p.id} | Name={p.name}")
    print(f"    Category={p.category.name} | Price={p.price} | Stock={p.stock}")
    print(f"    Image={p.image} | Featured={p.featured}")
    print()
