import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import products from '../data/products';

const CategoriesPage: React.FC = () => {
  // Use useMemo to prevent recalculating on each render
  const categories = useMemo(() => {
    const categoryMap: {[key: string]: { count: number, image: string }} = {};
    
    products.forEach(product => {
      if (!categoryMap[product.category]) {
        categoryMap[product.category] = { count: 0, image: product.image };
      }
      categoryMap[product.category].count++;
    });
    
    return Object.keys(categoryMap).map(category => ({
      name: category,
      count: categoryMap[category].count,
      image: categoryMap[category].image
    }));
  }, []);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { opacity: 0 }
  };

  return (
    <motion.div
      className="pt-24 pb-16 min-h-screen bg-neutral-light dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-poppins font-bold mb-4">Product Categories</h1>
          <p className="text-lg text-neutral-dark/70 dark:text-neutral-light/70 max-w-2xl mx-auto">
            Browse our products by category to find exactly what you're looking for.
          </p>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.name}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="group"
            >
              <motion.div 
                className="bg-white dark:bg-neutral-dark/30 rounded-card shadow-sm overflow-hidden h-full"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-poppins font-semibold mb-2">{category.name}</h3>
                  <p className="text-neutral-dark/70 dark:text-neutral-light/70">
                    {category.count} Products
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CategoriesPage; 