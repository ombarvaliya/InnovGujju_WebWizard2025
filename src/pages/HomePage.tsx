import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductsGrid from '../components/product/ProductsGrid';
import products from '../data/products';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  
  // Get unique categories
  const uniqueCategories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  
  // Get only featured products
  const featuredProducts = products.filter(product => product.isFeatured);
  
  // Get products on sale
  const onSaleProducts = products.filter(product => product.isOnSale);

  // Get products by selected category
  const categoryProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Category images mapping with all categories
  const categoryImages = {
    'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Accessories': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Footwear': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Clothing': 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Home': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Fitness': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'HomeDecor': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Photography': 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Kitchen': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Gaming': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  };

  // Fallback image for when category images fail to load
  const fallbackImage = 'https://images.unsplash.com/photo-1553531384-411a247ccd73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  const handleImageError = (category: string) => {
    setImageErrors(prev => ({ ...prev, [category]: true }));
  };

  // Handle category selection from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    if (categoryFromUrl && uniqueCategories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [location.search, uniqueCategories]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    if (category !== 'All') {
      navigate(`/products?category=${encodeURIComponent(category)}`);
    } else {
      navigate('/products');
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    animate: {
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video/Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="inline-block bg-primary text-white px-4 py-1 rounded-full text-sm font-medium mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome to E-Store
            </motion.span>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Discover Your Style
              <span className="block text-primary mt-2">Shop the Latest Trends</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Explore our curated collection of premium products that combine style, quality, and innovation.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link to="/products">
                <motion.button 
                  className="px-8 py-4 bg-primary text-white rounded-full font-medium text-lg hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Shop Now
                </motion.button>
              </Link>
              <Link to="/products?category=New">
                <motion.button 
                  className="px-8 py-4 bg-white text-black rounded-full font-medium text-lg hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  New Arrivals
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        >
          <svg 
            className="w-8 h-8 text-white"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </motion.div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Shop by Category</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Discover our curated collections</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {uniqueCategories.filter(cat => cat !== 'All').map(cat => (
          <motion.div 
                key={cat}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative group cursor-pointer"
                onClick={() => handleCategoryClick(cat)}
              >
                <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img 
                    src={imageErrors[cat] ? fallbackImage : (categoryImages[cat as keyof typeof categoryImages] || `https://source.unsplash.com/800x600/?${cat.toLowerCase()}`)}
                    alt={cat}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={() => handleImageError(cat)}
                    loading="eager"
                  />
                  <div className="absolute inset-0 flex items-end p-6 z-20">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{cat}</h3>
                      <p className="text-white/80 text-sm">Explore our {cat.toLowerCase()} collection</p>
                </div>
                  </div>
                </div>
            </motion.div>
            ))}
          </div>

          {/* Category Products Grid */}
          {selectedCategory !== 'All' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mt-12"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold dark:text-white">
                  {selectedCategory} Collection
                </h3>
                <button
                  onClick={() => handleCategoryClick('All')}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  View All Categories
                </button>
              </div>
              <ProductsGrid products={categoryProducts} />
            </motion.div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Featured Products</h2>
            <p className="text-gray-600 dark:text-gray-300">Our handpicked selection of premium items</p>
          </motion.div>

          <ProductsGrid products={featuredProducts} />
        </div>
      </section>

      {/* On Sale Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Special Offers</h2>
            <p className="text-gray-600 dark:text-gray-300">Limited time deals on selected items</p>
          </motion.div>

          <ProductsGrid products={onSaleProducts} />
        </div>
      </section>
    </div>
  );
};

export default HomePage; 