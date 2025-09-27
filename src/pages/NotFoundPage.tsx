import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen py-24 px-4 flex items-center justify-center">
      <div className="container max-w-md mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <div className="h-1 w-24 bg-primary mx-auto my-6"></div>
            <h2 className="text-2xl font-medium mb-4">Page Not Found</h2>
            <p className="text-neutral-dark/70 dark:text-neutral-light/70 mb-8">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/"
              className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Go Home
            </Link>
            <Link 
              to="/products"
              className="px-6 py-3 bg-white dark:bg-neutral-dark-lighter text-neutral-dark dark:text-neutral-light border border-neutral-mid/20 rounded-md hover:border-primary hover:text-primary transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage; 