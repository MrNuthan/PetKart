from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import User, Category, Product, Cart, CartItem, Order, OrderItem, Favorite, Review
from .serializers import (
    UserSerializer, CategorySerializer, ProductSerializer, 
    CartSerializer, CartItemSerializer, OrderSerializer, FavoriteSerializer,
    ReviewSerializer
)
from .permissions import IsAdminOrReadOnly
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action in ['list', 'destroy']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def update_profile(self, request):
        user = request.user
        allowed_fields = ['first_name', 'last_name', 'email', 'phone', 'address']
        for field in allowed_fields:
            if field in request.data:
                setattr(user, field, request.data[field])
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        category_name = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')
        
        if category_name:
            queryset = queryset.filter(category__name=category_name)
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(featured=True)
        
        return queryset

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def reviews(self, request, pk=None):
        """Get all reviews for a specific product."""
        product = self.get_object()
        reviews = Review.objects.filter(product=product)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

class CartViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        product = get_object_or_404(Product, id=product_id)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()
        
        return Response({'status': 'item added'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        product_id = request.data.get('product_id')
        item = get_object_or_404(CartItem, cart=cart, product_id=product_id)
        item.delete()
        return Response({'status': 'item removed'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def update_item(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        product = get_object_or_404(Product, id=product_id)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        
        cart_item.quantity = quantity
        cart_item.save()
        
        return Response({'status': 'item updated'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def clear(self, request):
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            cart.items.all().delete()
        return Response({'status': 'cart cleared'}, status=status.HTTP_200_OK)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=False, methods=['post'])
    def create_order(self, request):
        cart = Cart.objects.filter(user=request.user).first()
        if not cart or not cart.items.exists():
            return Response(
                {'error': 'Cart is empty. Add items before placing an order.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        total_amount = sum(item.product.price * item.quantity for item in cart.items.all())

        # Get shipping info from request
        first_name = request.data.get('first_name', request.user.first_name or '')
        last_name = request.data.get('last_name', request.user.last_name or '')
        address_line_1 = request.data.get('address_line_1', '')
        city = request.data.get('city', '')
        state = request.data.get('state', '')
        postal_code = request.data.get('postal_code', '')
        phone = request.data.get('phone', '')
        payment_method = request.data.get('payment_method', 'razorpay')

        # Validate required fields
        if not address_line_1 or not city or not postal_code:
            return Response(
                {'error': 'Shipping address, city, and postal code are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        razorpay_order_id = None
        
        if payment_method == 'razorpay':
            # Create Razorpay order
            try:
                import razorpay
                RAZORPAY_KEY_ID = getattr(settings, 'RAZORPAY_KEY_ID', None)
                RAZORPAY_KEY_SECRET = getattr(settings, 'RAZORPAY_KEY_SECRET', None)
                
                if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
                    logger.error("Razorpay credentials not configured in settings.")
                    return Response(
                        {'error': 'Payment gateway is not configured. Please contact support.'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
                
                client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
                razorpay_order = client.order.create({
                    "amount": int(total_amount * 100),  # Amount in paise
                    "currency": "INR",
                    "payment_capture": "1"
                })
                razorpay_order_id = razorpay_order['id']
                logger.info(f"Razorpay order created: {razorpay_order_id} for amount ₹{total_amount}")
                
            except ImportError:
                logger.error("razorpay package not installed")
                return Response(
                    {'error': 'Payment system unavailable. Please try Cash on Delivery.'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            except Exception as e:
                logger.error(f"Razorpay order creation failed: {str(e)}")
                return Response(
                    {'error': f'Payment gateway error: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        # Create the order with 'Placed' status
        order = Order.objects.create(
            user=request.user,
            total_amount=total_amount,
            payment_method=payment_method,
            first_name=first_name,
            last_name=last_name,
            address_line_1=address_line_1,
            city=city,
            state=state,
            postal_code=postal_code,
            phone=phone,
            razorpay_order_id=razorpay_order_id,
            status='Placed',
        )
        
        # Create order items from cart
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                price=item.product.price,
                quantity=item.quantity
            )
        
        # Clear the cart
        cart.items.all().delete()

        serializer = self.get_serializer(order)
        response_data = serializer.data
        
        if razorpay_order_id:
            response_data['razorpay_order_id'] = razorpay_order_id
        
        logger.info(f"Order #{order.id} created successfully. Payment: {payment_method}")
        return Response(response_data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def update_status(self, request, pk=None):
        """Admin endpoint to update order status with automatic timestamp tracking."""
        order = self.get_object()
        new_status = request.data.get('status')
        
        valid_statuses = [s[0] for s in Order.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response(
                {'error': f'Invalid status. Choose from: {valid_statuses}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Set timestamps based on status transition
        now = timezone.now()
        timestamp_map = {
            'Packed': 'packed_at',
            'Shipped': 'shipped_at',
            'Out for Delivery': 'out_for_delivery_at',
            'Delivered': 'delivered_at',
            'Cancelled': 'cancelled_at',
        }
        
        if new_status in timestamp_map:
            setattr(order, timestamp_map[new_status], now)
        
        order.status = new_status
        order.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def verify_payment(self, request):
        """Verify Razorpay payment signature after successful payment."""
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_signature = request.data.get('razorpay_signature')

        if not all([razorpay_payment_id, razorpay_order_id, razorpay_signature]):
            return Response(
                {'error': 'Missing payment verification data.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            import razorpay
            RAZORPAY_KEY_ID = getattr(settings, 'RAZORPAY_KEY_ID', None)
            RAZORPAY_KEY_SECRET = getattr(settings, 'RAZORPAY_KEY_SECRET', None)
            
            client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
            
            # Verify signature
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
            client.utility.verify_payment_signature(params_dict)

            # Update the order
            order = get_object_or_404(
                Order,
                razorpay_order_id=razorpay_order_id,
                user=request.user
            )
            order.status = 'Placed'
            order.razorpay_payment_id = razorpay_payment_id
            order.save()

            logger.info(f"Payment verified for Order #{order.id}: {razorpay_payment_id}")
            
            serializer = self.get_serializer(order)
            return Response({
                'status': 'Payment verified successfully',
                'order': serializer.data
            })

        except Exception as e:
            logger.error(f"Payment verification failed: {str(e)}")
            return Response(
                {'error': 'Payment verification failed. Please contact support.'},
                status=status.HTTP_400_BAD_REQUEST
            )

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def create(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            product_id=product_id
        )
        serializer = self.get_serializer(favorite)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        # Support deletion by product_id
        try:
            favorite = Favorite.objects.get(user=request.user, product_id=pk)
            favorite.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Favorite.DoesNotExist:
            return Response({'error': 'Favorite not found'}, status=status.HTTP_404_NOT_FOUND)

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)

    def create(self, request):
        product_id = request.data.get('product_id')
        order_id = request.data.get('order_id')
        rating = request.data.get('rating')
        comment = request.data.get('comment', '')

        if not product_id or not rating:
            return Response(
                {'error': 'product_id and rating are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            rating = int(rating)
            if rating < 1 or rating > 5:
                raise ValueError
        except (ValueError, TypeError):
            return Response(
                {'error': 'Rating must be an integer between 1 and 5.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        product = get_object_or_404(Product, id=product_id)

        # Verify the user actually ordered and received this product
        if order_id:
            order = get_object_or_404(Order, id=order_id, user=request.user)
            if order.status != 'Delivered':
                return Response(
                    {'error': 'You can only review products from delivered orders.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # Check that this product was in the order
            if not order.items.filter(product=product).exists():
                return Response(
                    {'error': 'This product was not part of the specified order.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # Check if user has ANY delivered order with this product
            has_delivered = Order.objects.filter(
                user=request.user,
                status='Delivered',
                items__product=product
            ).exists()
            if not has_delivered:
                return Response(
                    {'error': 'You can only review products you have received.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Create or update review (unique per user+product)
        review, created = Review.objects.update_or_create(
            user=request.user,
            product=product,
            defaults={
                'rating': rating,
                'comment': comment,
                'order_id': order_id,
            }
        )

        serializer = self.get_serializer(review)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def my_reviews(self, request):
        """Get all reviews by the authenticated user."""
        reviews = Review.objects.filter(user=request.user)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def for_product(self, request):
        """Get all reviews for a specific product (public)."""
        product_id = request.query_params.get('product_id')
        if not product_id:
            return Response({'error': 'product_id query param is required.'}, status=status.HTTP_400_BAD_REQUEST)
        reviews = Review.objects.filter(product_id=product_id)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
