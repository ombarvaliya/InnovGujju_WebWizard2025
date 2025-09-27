import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Mock data for wishlist items - in a real app, this would come from an API or context
const mockWishlistItems = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Clothing',
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Electronics',
  },
  {
    id: '3',
    name: 'Leather Wallet',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Accessories',
  },
];

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);

  const removeFromWishlist = (id: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-poppins font-bold mb-8">My Wishlist</h1>
          
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <svg 
                className="w-16 h-16 mx-auto text-neutral-mid mb-4"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h2 className="text-2xl font-medium mb-4">Your wishlist is empty</h2>
              <p className="text-neutral-dark/70 dark:text-neutral-light/70 mb-6">Browse our products and add items to your wishlist</p>
              <Link 
                to="/products" 
                className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <motion.div 
                  key={item.id}
                  className="bg-white dark:bg-neutral-dark-lighter rounded-lg shadow-md overflow-hidden flex flex-col"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <span className="absolute top-2 right-2 bg-tertiary text-white text-xs font-semibold px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                  
                  <div className="p-4 flex-grow">
                    <h3 className="font-medium text-lg mb-2">{item.name}</h3>
                    <p className="text-primary font-semibold">₹{item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="p-4 border-t border-neutral-mid/10 flex justify-between">
                    <Link 
                      to={`/products/${item.id}`}
                      className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                      View Details
                    </Link>
                    <button 
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-sm font-medium text-neutral-dark/70 dark:text-neutral-light/70 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WishlistPage; 