import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Product } from '../../types/Product'; // Ensure this import exists

interface ProductsGridProps {
  products: any[]; // Accept any array for flexibility
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ products }) => {
  // Safely handle edge cases
  if (!products || products.length === 0) {
    return (
      <div className="text-center p-8">
        <p>No products available.</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="products-grid">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {products.map(product => (
          <motion.div key={product.id || Math.random()} variants={itemVariants}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProductsGrid;