import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import products from '../data/products';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  isOnSale?: boolean;
  isNew?: boolean;
  stockStatus?: string;
  tags?: string[];
  features?: string[];
  rating?: number;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Get addToCart function from cart context
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  // Default fallback image
  const fallbackImage = "https://images.unsplash.com/photo-1553531384-411a247ccd73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  // Fetch product data
  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Find related products (same category, excluding current product)
      const related = products
        .filter(p => p.category === foundProduct.category && p.id !== id)
        .slice(0, 4);
      
      setRelatedProducts(related);
    } else {
      // If product not found, redirect to products page
      navigate('/products');
    }
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-20 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setQuantity(value < 1 ? 1 : value);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Show feedback to user
    alert(`Added ${quantity} x ${product.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-20 px-4 text-gray-800 dark:text-white">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary">Home</Link>
            </li>
            <li className="text-gray-500 dark:text-gray-400">/</li>
            <li>
              <Link to="/products" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary">Products</Link>
            </li>
            <li className="text-gray-500 dark:text-gray-400">/</li>
            <li className="text-primary">{product.name}</li>
          </ol>
        </nav>

        {/* Product Detail */}
        <div className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden dark:border dark:border-gray-800 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <img 
                src={imageError ? fallbackImage : product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                onError={() => setImageError(true)}
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Title and Badges */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  {product.isNew && (
                    <span className="inline-block bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full mr-2">
                      New
                    </span>
                  )}
                  {product.isOnSale && (
                    <span className="inline-block bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      Sale
                    </span>
                  )}
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold mb-1">{product.name}</h1>
                
                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          className={`w-5 h-5 ${star <= product.rating! ? 'text-yellow-500' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{product.rating} / 5</span>
                  </div>
                )}
                
                {/* Price */}
                <div className="text-3xl font-bold text-primary mb-4">
                  ₹{product.price.toFixed(2)}
                </div>
              </div>
              
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {product.description}
              </p>
              
              {/* Stock Status */}
              <div className="mb-4">
                <span className={`font-medium ${
                  product.stockStatus === 'in-stock' ? 'text-green-500' : 
                  product.stockStatus === 'low-stock' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {product.stockStatus === 'in-stock' ? 'In Stock' : 
                   product.stockStatus === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                </span>
              </div>
              
              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Key Features:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Add to Cart */}
              <div className="mt-auto">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-24">
                    <label htmlFor="quantity" className="block text-sm font-medium mb-1">Quantity</label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-full px-3 py-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
                  </div>
                  
                  <button 
                    className="flex-grow btn bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddToCart}
                    disabled={product.stockStatus === 'out-of-stock'}
                  >
                    {product.stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
                
                <div className="flex justify-center">
                  <Link to="/products" className="text-primary hover:underline">
                    &larr; Back to all products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <Link 
                  to={`/products/${relatedProduct.id}`} 
                  key={relatedProduct.id}
                  className="bg-white dark:bg-black rounded-lg shadow overflow-hidden dark:border dark:border-gray-800"
                >
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700">
                    <img 
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = fallbackImage;
                      }}
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 dark:text-white">{relatedProduct.name}</h3>
                    <p className="font-bold text-blue-600 dark:text-blue-400">
                      ₹{relatedProduct.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;