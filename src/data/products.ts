// Mock product data
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  description: string;
  features: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
  sizes?: string[];
  colors?: Array<{
    name: string;
    hex: string;
  }>;
  tags: string[];
}

const products: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 249.99,
    originalPrice: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Electronics',
    rating: 4.8,
    description: 'Experience premium sound quality with our wireless over-ear headphones. Featuring active noise cancellation, high-resolution audio, and all-day battery life.',
    features: [
      'Active Noise Cancellation',
      '40 hour battery life',
      'Premium sound quality',
      'Bluetooth 5.0 connectivity',
      'Built-in microphone for calls',
      'Comfortable over-ear design'
    ],
    isNew: true,
    isFeatured: true,
    isOnSale: true,
    stockStatus: 'in-stock',
    colors: [
      { name: 'Matte Black', hex: '#1a1a1a' },
      { name: 'Silver', hex: '#c0c0c0' },
      { name: 'Navy Blue', hex: '#000080' }
    ],
    tags: ['headphones', 'audio', 'wireless', 'bluetooth', 'noise-cancellation']
  },
  {
    id: '2',
    name: 'Designer Leather Watch',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Accessories',
    rating: 4.5,
    description: 'Elevate your style with our premium leather watch. Featuring a minimalist design, precision quartz movement, and genuine leather band.',
    features: [
      'Genuine leather band',
      'Stainless steel case',
      'Japanese quartz movement',
      'Water resistant to 50m',
      'Scratch-resistant glass',
      '2-year warranty'
    ],
    isFeatured: true,
    stockStatus: 'in-stock',
    colors: [
      { name: 'Brown', hex: '#8B4513' },
      { name: 'Black', hex: '#000000' }
    ],
    tags: ['watch', 'accessories', 'leather', 'luxury']
  },
  {
    id: '3',
    name: 'Ultra Slim Laptop',
    price: 1299.99,
    originalPrice: 1499.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Electronics',
    rating: 4.9,
    description: 'Our thinnest and most powerful laptop yet. Featuring a stunning display, lightning-fast processor, and all-day battery life in an impossibly thin design.',
    features: [
      '14" 4K OLED Display',
      'Latest Gen Processor',
      '16GB RAM, 512GB SSD',
      'All-day battery life',
      'Backlit keyboard',
      'Ultra-thin aluminum chassis'
    ],
    isNew: true,
    isOnSale: true,
    stockStatus: 'low-stock',
    colors: [
      { name: 'Space Gray', hex: '#5f5f5f' },
      { name: 'Silver', hex: '#c0c0c0' }
    ],
    tags: ['laptop', 'computer', 'electronics', 'tech']
  },
  {
    id: '4',
    name: 'Premium Leather Sneakers',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Footwear',
    rating: 4.3,
    description: 'Crafted from premium leather and designed for both style and comfort, these sneakers are perfect for any casual occasion.',
    features: [
      'Premium leather upper',
      'Cushioned insole',
      'Rubber outsole for durability',
      'Breathable design',
      'Handcrafted in Italy'
    ],
    isFeatured: true,
    stockStatus: 'in-stock',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: [
      { name: 'White', hex: '#ffffff' },
      { name: 'Black', hex: '#000000' },
      { name: 'Tan', hex: '#d2b48c' }
    ],
    tags: ['shoes', 'sneakers', 'leather', 'footwear']
  },
  {
    id: '5',
    name: 'Smart Fitness Tracker',
    price: 89.99,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Fitness',
    rating: 4.6,
    description: 'Track your activity, sleep, heart rate and more with our advanced fitness tracker. Water-resistant design with a 7-day battery life.',
    features: [
      '24/7 heart rate monitoring',
      'Sleep tracking',
      'GPS tracking',
      'Water resistant to 50m',
      '7-day battery life',
      'Smart notifications'
    ],
    isOnSale: true,
    stockStatus: 'in-stock',
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Blue', hex: '#1e90ff' },
      { name: 'Pink', hex: '#ff69b4' }
    ],
    tags: ['fitness', 'wearable', 'tracker', 'health']
  },
  {
    id: '6',
    name: 'Minimalist Desk Lamp',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Home Decor',
    rating: 4.2,
    description: 'Add a touch of elegance to your workspace with our minimalist desk lamp. Features adjustable brightness and color temperature.',
    features: [
      'Touch-sensitive controls',
      'Adjustable brightness',
      'Color temperature settings',
      'USB charging port',
      'Energy-efficient LED',
      'Sleek aluminum construction'
    ],
    stockStatus: 'out-of-stock',
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#ffffff' },
      { name: 'Gold', hex: '#ffd700' }
    ],
    tags: ['lamp', 'lighting', 'desk', 'home', 'office']
  },
  {
    id: '7',
    name: 'Vintage Polaroid Camera',
    price: 179.99,
    originalPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Photography',
    rating: 4.7,
    description: 'Capture memories instantly with our vintage-inspired polaroid camera. Blending retro design with modern technology for beautiful instant photos.',
    features: [
      'Instant photo printing',
      'Built-in flash',
      'Selfie mirror',
      'Double exposure capability',
      'Rechargeable battery',
      'Includes 10 film sheets'
    ],
    isNew: true,
    stockStatus: 'in-stock',
    colors: [
      { name: 'Mint Green', hex: '#98fb98' },
      { name: 'Coral Pink', hex: '#f88379' },
      { name: 'Sky Blue', hex: '#87ceeb' }
    ],
    tags: ['camera', 'polaroid', 'photography', 'instant', 'vintage']
  },
  {
    id: '8',
    name: 'Designer Tote Bag',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1585488763177-bde7d15fd3cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Accessories',
    rating: 4.5,
    description: 'Elevate your style with our premium designer tote bag. Crafted from high-quality materials with ample storage space and elegant design.',
    features: [
      'Genuine leather construction',
      'Interior pocket organization',
      'Magnetic closure',
      'Detachable shoulder strap',
      'Gold-tone hardware',
      'Handcrafted in Italy'
    ],
    isFeatured: true,
    stockStatus: 'in-stock',
    colors: [
      { name: 'Tan', hex: '#d2b48c' },
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#000080' }
    ],
    tags: ['bag', 'tote', 'leather', 'designer', 'accessories']
  },
  // New products start here
  {
    id: '9',
    name: 'Smart Home Speaker',
    price: 129.99,
    originalPrice: 159.99,
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc0d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Electronics',
    rating: 4.7,
    description: 'Transform your home with our intelligent speaker system featuring voice control, premium sound quality, and seamless smart home integration.',
    features: [
      'Voice assistant built-in',
      '360° room-filling sound',
      'Multi-room audio sync',
      'Smart home device control',
      'Streaming services integration',
      'Automatic acoustic calibration'
    ],
    isNew: true,
    isFeatured: true,
    stockStatus: 'in-stock',
    colors: [
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'White', hex: '#ffffff' },
      { name: 'Sage Green', hex: '#9CAF88' }
    ],
    tags: ['speaker', 'smart home', 'audio', 'voice assistant', 'electronics']
  },
  {
    id: '10',
    name: 'Artisan Coffee Table',
    price: 399.99,
    originalPrice: 499.99,
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Furniture',
    rating: 4.8,
    description: 'This handcrafted coffee table combines sustainable materials with contemporary design for a stunning centerpiece in any living space.',
    features: [
      'Solid reclaimed wood construction',
      'Hand-finished metal legs',
      'Environmentally sustainable materials',
      'Hidden storage compartment',
      'Scratch-resistant finish',
      'Easy assembly'
    ],
    isOnSale: true,
    stockStatus: 'in-stock',
    colors: [
      { name: 'Natural Wood', hex: '#D2B48C' },
      { name: 'Walnut', hex: '#5C4033' },
      { name: 'Ebony', hex: '#555D50' }
    ],
    tags: ['furniture', 'coffee table', 'wood', 'sustainable', 'home decor']
  },
  {
    id: '11',
    name: 'Professional Chef Knife Set',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Kitchen',
    rating: 4.9,
    description: 'Professional-grade knife set crafted from high-carbon stainless steel with ergonomic handles for precision cutting and comfort.',
    features: [
      '8-piece premium knife set',
      'Full tang construction',
      'High-carbon German steel',
      'Hand-sharpened edges',
      'Ergonomic handles',
      'Elegant storage block'
    ],
    isFeatured: true,
    stockStatus: 'in-stock',
    colors: [
      { name: 'Classic Black', hex: '#000000' },
      { name: 'Stainless Steel', hex: '#CACACA' }
    ],
    tags: ['kitchen', 'knives', 'cooking', 'chef', 'cutlery']
  },
  {
    id: '12',
    name: 'Luxury Silk Pajama Set',
    price: 129.99,
    originalPrice: 149.99,
    image: 'https://images.unsplash.com/photo-1617952125960-4e8207548dc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Clothing',
    rating: 4.6,
    description: 'Indulge in luxury with our 100% mulberry silk pajama set, offering unparalleled comfort and elegance for a perfect night\'s sleep.',
    features: [
      '100% Grade 6A mulberry silk',
      'Hypoallergenic material',
      'Temperature regulating',
      'Adjustable waistband',
      'Relaxed fit',
      'Machine washable'
    ],
    isOnSale: true,
    stockStatus: 'in-stock',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Midnight Blue', hex: '#191970' },
      { name: 'Blush Pink', hex: '#FEC5E5' },
      { name: 'Pearl White', hex: '#F5F5F5' }
    ],
    tags: ['pajamas', 'sleepwear', 'silk', 'luxury', 'clothing']
  },
  {
    id: '13',
    name: 'Ergonomic Office Chair',
    price: 349.99,
    originalPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1589384327408-c0ca19d6d805?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Furniture',
    rating: 4.7,
    description: 'Engineered for all-day comfort, our ergonomic office chair features adjustable lumbar support, breathable mesh, and customizable settings.',
    features: [
      'Adjustable lumbar support',
      'Breathable mesh backrest',
      '4D adjustable armrests',
      'Synchronous tilt mechanism',
      'Weight-activated mechanism',
      '10-year warranty'
    ],
    isFeatured: true,
    isOnSale: true,
    stockStatus: 'in-stock',
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Gray', hex: '#808080' }
    ],
    tags: ['chair', 'office', 'ergonomic', 'furniture', 'home office']
  },
  {
    id: '14',
    name: 'Waterproof Hiking Boots',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Footwear',
    rating: 4.5,
    description: 'Conquer any trail with our premium waterproof hiking boots featuring superior traction, ankle support, and all-weather protection.',
    features: [
      'Waterproof membrane',
      'Vibram outsole for traction',
      'Shock-absorbing midsole',
      'Reinforced toe cap',
      'Padded collar and tongue',
      'Speed lacing system'
    ],
    isNew: true,
    stockStatus: 'in-stock',
    sizes: ['7', '8', '9', '10', '11', '12', '13'],
    colors: [
      { name: 'Brown', hex: '#8B4513' },
      { name: 'Gray/Blue', hex: '#778899' }
    ],
    tags: ['boots', 'hiking', 'outdoors', 'waterproof', 'footwear']
  },
  {
    id: '15',
    name: 'Wireless Gaming Mouse',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1613141411244-0e4ac259d217?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Gaming',
    rating: 4.8,
    description: 'Dominate the competition with our ultra-responsive wireless gaming mouse featuring customizable buttons, RGB lighting, and precision sensors.',
    features: [
      '25,000 DPI optical sensor',
      'Ultra-low latency connection',
      '8 programmable buttons',
      'Customizable RGB lighting',
      '70-hour battery life',
      'Lightweight design'
    ],
    isOnSale: true,
    stockStatus: 'low-stock',
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#ffffff' }
    ],
    tags: ['mouse', 'gaming', 'wireless', 'rgb', 'esports']
  },
  {
    id: '16',
    name: 'Ceramic Plant Pot Set',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Home Decor',
    rating: 4.4,
    description: 'Add a touch of elegance to your indoor garden with our set of three handcrafted ceramic plant pots in complementary designs.',
    features: [
      'Set of 3 different sizes',
      'Handcrafted ceramic',
      'Drainage holes with plugs',
      'Geometric modern design',
      'Suitable for indoor plants',
      'Non-toxic glazed finish'
    ],
    isFeatured: true,
    stockStatus: 'in-stock',
    colors: [
      { name: 'Terracotta', hex: '#E2725B' },
      { name: 'White', hex: '#ffffff' },
      { name: 'Sage Green', hex: '#9CAF88' }
    ],
    tags: ['planter', 'pottery', 'ceramic', 'plants', 'home decor']
  }
];

export default products; 