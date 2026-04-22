"""
Administration service layer.

Provides analytics computation and admin-specific business logic.
Keeps admin views thin and testable.
"""

import logging
from datetime import timedelta

from django.db.models import Sum
from django.db.models.functions import TruncDate
from django.utils import timezone

from api.models import User, Product, Order

logger = logging.getLogger(__name__)


class AnalyticsService:
    """Computes dashboard analytics data."""

    @staticmethod
    def get_dashboard_data():
        """
        Compute real-time analytics for the admin dashboard.

        Returns:
            dict with keys:
                - totalRevenue: Sum of non-cancelled orders
                - totalOrders: Count of all orders
                - totalUsers: Count of non-staff users
                - totalProducts: Count of products
                - salesData: Daily sales for last 7 days
                - recentActivity: Latest 5 orders
        """
        # Aggregate totals
        total_revenue = (
            Order.objects.exclude(status='Cancelled')
            .aggregate(total=Sum('total_amount'))['total']
        ) or 0

        total_orders = Order.objects.count()
        total_users = User.objects.filter(is_staff=False).count()
        total_products = Product.objects.count()

        # Sales data — last 7 days
        sales_data = AnalyticsService._get_weekly_sales()

        # Recent orders
        recent_activity = AnalyticsService._get_recent_activity()

        return {
            'totalRevenue': float(total_revenue),
            'totalOrders': total_orders,
            'totalUsers': total_users,
            'totalProducts': total_products,
            'salesData': sales_data,
            'recentActivity': recent_activity,
        }

    @staticmethod
    def _get_weekly_sales():
        """
        Calculate daily sales totals for the last 7 days.

        Returns:
            list[dict]: One entry per day with name, sales, and date.
        """
        today = timezone.now().date()
        seven_days_ago = today - timedelta(days=6)

        sales_qs = (
            Order.objects
            .filter(created_at__date__gte=seven_days_ago)
            .exclude(status='Cancelled')
            .annotate(day=TruncDate('created_at'))
            .values('day')
            .annotate(sales=Sum('total_amount'))
            .order_by('day')
        )

        sales_map = {
            entry['day']: float(entry['sales'] or 0)
            for entry in sales_qs
        }

        day_names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        return [
            {
                'name': day_names[(seven_days_ago + timedelta(days=i)).weekday()],
                'sales': sales_map.get(seven_days_ago + timedelta(days=i), 0),
                'date': str(seven_days_ago + timedelta(days=i)),
            }
            for i in range(7)
        ]

    @staticmethod
    def _get_recent_activity(limit=5):
        """
        Get the most recent orders for the activity feed.

        Args:
            limit: Number of orders to return.

        Returns:
            list[dict]: Recent order summaries.
        """
        recent_orders = (
            Order.objects
            .select_related('user')
            .order_by('-created_at')[:limit]
        )

        return [
            {
                'id': order.id,
                'customer': (
                    f"{order.first_name} {order.last_name}".strip()
                    or order.user.username
                ),
                'amount': float(order.total_amount),
                'status': order.status,
                'created_at': order.created_at.isoformat(),
            }
            for order in recent_orders
        ]
