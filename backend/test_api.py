import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'ecommerce_project.settings'

import django
django.setup()

from django.test import RequestFactory
from api.views import ProductViewSet

factory = RequestFactory()
request = factory.get('/api/products/')

try:
    view = ProductViewSet.as_view({'get': 'list'})
    response = view(request)
    response.render()
    print(f"Status: {response.status_code}")
    print(f"Content length: {len(response.content)}")
    
    import json
    data = json.loads(response.content)
    if isinstance(data, list):
        print(f"Products returned: {len(data)}")
        if data:
            print(f"First product keys: {list(data[0].keys())}")
            print(f"First product: {data[0].get('name')}")
            print(f"First product image: {data[0].get('image')}")
            print(f"First product category: {data[0].get('category')}")
            print(f"First product category_name: {data[0].get('category_name')}")
    else:
        print(f"Response data: {data}")
except Exception as e:
    import traceback
    print(f"ERROR: {e}")
    traceback.print_exc()
