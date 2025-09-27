import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
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

// Define the props interface for the ProductCard component
interface ProductCardProps {
  product: Product;
}

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const productsRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [showOnSale, setShowOnSale] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  
  // Get unique categories
  const uniqueCategories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  
  // Read category from URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setCategory(decodeURIComponent(categoryParam));
      // Scroll to products section when category is selected from URL
      setTimeout(() => {
        if (productsRef.current) {
          productsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.search]);
  
  // Apply filters
  useEffect(() => {
    console.log('Applying filters...');
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (category && category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    
    // Apply on sale filter
    if (showOnSale) {
      result = result.filter(p => p.isOnSale);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
    }
    
    console.log(`Found ${result.length} matching products`);
    setFilteredProducts(result);
  }, [searchTerm, category, showOnSale, sortBy]);
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setCategory('');
    setShowOnSale(false);
    setSortBy('newest');
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-20 px-4 text-gray-800 dark:text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 dark:text-white">Our Products</h1>
        
        {/* Search and Filters */}
        <div className="bg-white dark:bg-black shadow rounded-lg p-6 mb-8 dark:border dark:border-gray-800">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Scroll to products section when searching
                  if (e.target.value.length > 0) {
                    setTimeout(() => {
                      if (productsRef.current) {
                        productsRef.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }
                }}
                placeholder="Search products..."
                className="w-full px-4 py-2 border rounded bg-white text-gray-800 dark:bg-gray-900 dark:text-white dark:border-gray-700"
              />
            </div>
            
            {/* Category filter - fix duplicate property */}
            <div className="md:w-48">
              <select 
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  // Scroll to products section when category is changed
                  setTimeout(() => {
                    if (productsRef.current) {
                      productsRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="w-full px-4 py-2 border rounded"
                style={{
                  backgroundColor: 'black',
                  color: 'white'
                }}
              >
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat} style={{
                    backgroundColor: 'black',
                    color: 'white'
                  }}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort filter - fix duplicate property */}
            <div className="md:w-48">
              <select 
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  // Scroll to products section when sorting
                  setTimeout(() => {
                    if (productsRef.current) {
                      productsRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="w-full px-4 py-2 border rounded"
                style={{
                  backgroundColor: 'black',
                  color: 'white'
                }}
              >
                <option value="newest" style={{backgroundColor: 'black', color: 'white'}}>Newest</option>
                <option value="price-low-high" style={{backgroundColor: 'black', color: 'white'}}>Price: Low to High</option>
                <option value="price-high-low" style={{backgroundColor: 'black', color: 'white'}}>Price: High to Low</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center dark:text-white">
              <input
                type="checkbox"
                checked={showOnSale}
                onChange={(e) => {
                  setShowOnSale(e.target.checked);
                  // Scroll to products section when filtering by sale
                  setTimeout(() => {
                    if (productsRef.current) {
                      productsRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="mr-2 dark:bg-gray-700"
              />
              <span>Show only items on sale</span>
            </label>
            
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            >
              Reset Filters
            </button>
          </div>
        </div>
        
        {/* Product Count */}
        <div className="mb-6" ref={productsRef}>
          <p className="text-gray-600 dark:text-gray-300">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-black p-8 rounded-lg shadow text-center dark:border dark:border-gray-800">
            <p className="text-xl font-medium mb-2 dark:text-white">No products found</p>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Fix TypeScript error by adding proper type annotation
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  
  // Default fallback image
  const fallbackImage = "https://images.unsplash.com/photo-1553531384-411a247ccd73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="bg-white dark:bg-black rounded-lg shadow overflow-hidden dark:border dark:border-gray-800 transition-shadow hover:shadow-lg">
        <div className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700">
          {/* Use onError to catch image loading failures */}
          <img 
            src={imageError ? fallbackImage : product.image}
            alt={product.name}
            className="w-full h-64 object-cover"
            onError={() => setImageError(true)}
            loading="eager" // Use eager loading for visibility
          />
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 dark:text-white">{product.name}</h3>
          <p className="font-bold text-blue-600 dark:text-blue-400">₹{product.price.toFixed(2)}</p>
          <p className="text-gray-600 mt-2 text-sm line-clamp-2 dark:text-gray-300">{product.description}</p>
          
          {product.isOnSale && (
            <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 mt-2 rounded">
              Sale
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductsPage;