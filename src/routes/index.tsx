import React from 'react';
import { useParams } from 'react-router-dom';
import products from '../data/products';

// Define Product interface to fix TypeScript error
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  isOnSale?: boolean;
  isNew?: boolean;
  tags?: string[];
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-20 px-4 text-gray-800 dark:text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4 dark:text-white">Product Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sorry, the product you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-20 px-4 text-gray-800 dark:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-black rounded-lg shadow overflow-hidden dark:border dark:border-gray-800">
          <div className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover"
              loading="eager"
            />
          </div>
          <div className="p-4">
            <h1 className="font-semibold text-2xl mb-2 dark:text-white">{product.name}</h1>
            <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-600 mt-4 text-sm dark:text-gray-300">{product.description}</p>
            {product.isOnSale && (
              <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 mt-2 rounded">
                Sale
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;