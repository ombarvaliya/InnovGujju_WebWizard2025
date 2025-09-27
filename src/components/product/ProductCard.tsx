import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  isOnSale?: boolean;
  isNew?: boolean;
  stockStatus?: string;
  tags?: string[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Category-based fallback images
  const fallbackImages: {[key: string]: string} = {
    electronics: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    furniture: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    clothing: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    accessories: "https://images.unsplash.com/photo-1613152184920-bc1c4ab48d23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    footwear: "https://images.unsplash.com/photo-1560343090-f0409e92791a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    default: "https://images.unsplash.com/photo-1553531384-411a247ccd73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  };

  // Get appropriate fallback image
  const getFallbackImage = () => {
    if (!product || !product.category) return fallbackImages.default;
    const category = product.category.toLowerCase();
    return fallbackImages[category] || fallbackImages.default;
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    console.log(`Image failed to load for product: ${product?.name || 'unknown'}`);
    setImageError(true);
    setIsLoading(false);
  };

  // For debugging
  useEffect(() => {
    console.log(`Rendering product: ${product?.name || 'unknown'}, Image URL: ${product?.image || 'none'}`);
  }, [product]);

  // Safety check for missing product data
  if (!product) {
    return (
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg shadow-sm p-4 h-full">
        <p className="text-center text-gray-500">Product data unavailable</p>
      </div>
    );
  }

  return (
    <Link to={`/products/${product.id}`} className="group block h-full">
      <div className="bg-white dark:bg-neutral-dark rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative pt-[100%] overflow-hidden bg-white dark:bg-gray-800">
          {/* Loading placeholder */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Product image */}
          <img 
            src={imageError ? getFallbackImage() : product.image}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
          
          {/* Sale/New badges */}
          {product.isOnSale && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full z-10">
              Sale
            </div>
          )}
          
          {product.isNew && !product.isOnSale && (
            <div className="absolute top-2 right-2 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full z-10">
              New
            </div>
          )}
        </div>
        
        {/* Product details */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-medium text-lg mb-1 truncate">{product.name}</h3>
          <p className="text-primary font-medium">${product.price.toFixed(2)}</p>
          <div className="flex items-center mt-2 mt-auto">
            <div className="flex text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg 
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              {product.rating?.toFixed(1) || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;