import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Adult Dog Food - Chicken & Rice',
    description: 'High-protein grain-free formula for adult dogs. enriched with vitamins and minerals for optimal health. Supports strong joints and a shiny coat.',
    price: 49.99,
    originalPrice: 65.00,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&q=80',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80',
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80'
    ],
    category: 'Dog',
    rating: 4.8,
    reviews: 1250,
    stock: 50,
    tags: ['Best Seller', 'Grain Free']
  },
  {
    id: '2',
    name: 'Interactive Cat Laser Toy - 360 Degree',
    description: '360-degree rotating laser toy to keep your feline friend active and entertained for hours. Adjustable speeds and patterns.',
    price: 19.99,
    originalPrice: 29.99,
    image: 'https://images.unsplash.com/photo-1548546738-8509cb246ed3?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1548546738-8509cb246ed3?w=800&q=80',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80'
    ],
    category: 'Cat',
    rating: 4.5,
    reviews: 840,
    stock: 120,
    tags: ['Fun', 'Exercise']
  },
  {
    id: '3',
    name: 'Tropical Fish Flakes - Color Enhancing',
    description: 'Specially formulated flakes for vibrant colors and healthy growth of all tropical fish species. Does not cloud water.',
    price: 12.50,
    originalPrice: 15.00,
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&q=80',
    category: 'Fish',
    rating: 4.7,
    reviews: 320,
    stock: 200
  },
  {
    id: '4',
    name: 'Luxury Orthopedic Dog Bed - Grey',
    description: 'Ultra-soft memory foam bed providing maximum comfort and joint support for your senior pet. Removable, washable cover.',
    price: 89.00,
    originalPrice: 120.00,
    image: 'https://images.unsplash.com/photo-1591946614421-1d977ff020d6?w=800&q=80',
    category: 'Dog',
    rating: 4.9,
    reviews: 450,
    stock: 15,
    tags: ['Comfort', 'Premium']
  },
  {
    id: '5',
    name: 'Organic Bird Seed Mix - All Seasons',
    description: 'A nutritious blend of seeds, nuts, and dried fruits for parakeets and cockatiels. Promotes healthy digestion.',
    price: 15.99,
    originalPrice: 19.99,
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30eba3?w=800&q=80',
    category: 'Bird',
    rating: 4.6,
    reviews: 210,
    stock: 85
  },
  {
    id: '6',
    name: 'Cat Grooming Brush - Self Cleaning',
    description: 'Self-cleaning slicker brush that gently removes loose fur and tangles from all coat types. One-click button retracts bristles.',
    price: 14.99,
    originalPrice: 22.00,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
    category: 'Cat',
    rating: 4.4,
    reviews: 670,
    stock: 90
  },
  {
    id: '7',
    name: 'Aquarium Water Filter - 3 Stage',
    description: 'Advanced 3-stage filtration system for crystal clear water in tanks up to 30 gallons. Silent operation.',
    price: 34.99,
    originalPrice: 45.00,
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80',
    category: 'Fish',
    rating: 4.3,
    reviews: 180,
    stock: 30
  },
  {
    id: '8',
    name: 'Durable Rubber Chew Toy - Large',
    description: 'Tough rubber toy designed for aggressive chewers. Helps clean teeth and massage gums. Infused with natural vanilla scent.',
    price: 9.99,
    originalPrice: 14.99,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=80',
    category: 'Dog',
    rating: 4.7,
    reviews: 2100,
    stock: 350
  }
];
