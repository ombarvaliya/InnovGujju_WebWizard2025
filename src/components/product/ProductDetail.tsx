import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Tabs for account pages
type AccountTab = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings';

// Update the ExtendedUserData interface to include address
// Define our local user type that includes all properties we need
interface ExtendedUserData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
  profileImage?: string;
  addresses?: {
    id: string;
    type: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
  }[];
}

// ---- Orders types (aligned with backend schema) ----
interface OrderItem {
  productId: string;
  id?: string; // optional legacy field
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

interface Address {
  type?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: string; // e.g. 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[];
  total: number;
  shippingAddress?: Address | null;
  paymentMethod?: string;
  userId: string;
}

// Modify the component to accept props for initial tab selection
interface ProductDetailProps {
  initialTab?: AccountTab;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ initialTab = 'profile' }) => {
  const { user, logout } = useAuth() || {};
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the tab from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get('tab') as AccountTab | null;
  
  // Set initial active tab from query parameter or default to 'profile'
  const [activeTab, setActiveTab] = useState<AccountTab>(
    tabFromQuery && ['profile', 'orders', 'wishlist', 'addresses', 'settings'].includes(tabFromQuery) 
      ? tabFromQuery 
      : 'profile'
  );
  
  // Listen for changes in the URL query parameters
  useEffect(() => {
    if (tabFromQuery && ['profile', 'orders', 'wishlist', 'addresses', 'settings'].includes(tabFromQuery)) {
      setActiveTab(tabFromQuery);
    }
  }, [location.search, tabFromQuery]);
  
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Orders state for the "Orders" tab
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);

  // Prefer API URL from env; fallback to localhost for dev
  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

  // Fetch current user's orders from backend
  const fetchOrders = async () => {
    if (!user) return;
    try {
      setOrdersLoading(true);
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const result = await response.json();
      if (result?.success && Array.isArray(result.orders)) {
        setOrders(result.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // When switching to Orders tab (and when user becomes available), load orders
  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user]);

  // Live refresh after checkout emits a global 'orders:updated' event
  useEffect(() => {
    const onOrdersUpdated = () => {
      if (activeTab === 'orders' && user) fetchOrders();
    };
    window.addEventListener('orders:updated', onOrdersUpdated as EventListener);
    return () => window.removeEventListener('orders:updated', onOrdersUpdated as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user]);

  // Create a safe user object merging auth user with default values
  const userData: ExtendedUserData = {
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+1 (555) 123-4567',
    address: user?.address || '123 Main Street, New York, NY 10001',
    country: user?.country || 'India',
    profileImage: user?.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg',
    addresses: [
      {
        id: '1',
        type: 'Home',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'India',
        isDefault: true
      }
    ]
  };

  // Helper to map backend status to human-friendly label
  const getStatusLabel = (status: string) => {
    const s = (status || '').toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1); // pending -> Pending
  };

  // Helper to map status to badge colors
  const getStatusBadgeClass = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (s === 'shipped') return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    if (s === 'processing') return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (s === 'pending') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (s === 'cancelled') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  // Fallback image by category
  const getFallbackImage = (category?: string) => {
    const fallbackImages: { [key: string]: string } = {
      electronics: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      clothing: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      default: 'https://images.unsplash.com/photo-1553531384-411a247ccd73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    };
    const key = (category || 'default').toLowerCase();
    return fallbackImages[key] || fallbackImages.default;
  };

  // Function to handle clicking on an order
  const handleOrderClick = (orderId: string) => {
    // We store the MongoDB _id as the selected identifier
    setSelectedOrderId(orderId);
  };

  // Function to go back to order list
  const handleBackToOrders = () => {
    setSelectedOrderId(null);
  };

  // Get the selected order
  const selectedOrder: Order | null = selectedOrderId
    ? (orders.find(order => order._id === selectedOrderId) || null)
    : null;

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate('/');
    }
  };

  // Update the tab click handlers to update the URL
  const handleTabChange = (tab: AccountTab) => {
    setActiveTab(tab);
    // Update URL without triggering a page reload
    navigate(`/profile?tab=${tab}`, { replace: true });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Account</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account details and preferences</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {/* User Info with Logo */}
              <div className="flex flex-col items-center space-y-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                  {userData.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{userData.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 break-words">{userData.email}</p>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="mt-6 space-y-1">
                <button
                  onClick={() => handleTabChange('profile')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-md ${
                    activeTab === 'profile'
                      ? 'bg-black text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-black hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Info
                </button>
                
                <button
                  onClick={() => handleTabChange('orders')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-md ${
                    activeTab === 'orders'
                      ? 'bg-black text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-black hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Orders
                </button>
                
                <button
                  onClick={() => handleTabChange('addresses')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-md ${
                    activeTab === 'addresses'
                      ? 'bg-black text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-black hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Addresses
                </button>
                
                <button
                  onClick={() => handleTabChange('wishlist')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-md ${
                    activeTab === 'wishlist'
                      ? 'bg-black text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-black hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Wishlist
                </button>
                
                <button
                  onClick={() => handleTabChange('settings')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-md ${
                    activeTab === 'settings'
                      ? 'bg-black text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-black hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md mt-6"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {/* Profile Section */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Personal Information</h2>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          defaultValue={userData.name}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          defaultValue={userData.email}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          defaultValue={userData.phone || ''}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          defaultValue={userData.country || 'India'}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="India">India</option>
                          <option value="USA">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Address
                        </label>
                        <textarea
                          id="address"
                          name="address"
                          defaultValue={userData.address || ''}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-black text-white font-medium rounded-md hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Orders Section */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                    {selectedOrder ? 'Order Details' : 'My Orders'}
                  </h2>
                  
                    {selectedOrder ? (
                    /* Order Detail View */
                    <div>
                      {/* Back Button */}
                      <button 
                        onClick={handleBackToOrders}
                        className="mb-6 flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Orders
                      </button>
                      
                      {/* Order Summary */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <h3 className="text-sm text-gray-500 dark:text-gray-400">Order #</h3>
                            <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.orderNumber}</p>
                          </div>
                          <div>
                            <h3 className="text-sm text-gray-500 dark:text-gray-400">Date Placed</h3>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(selectedOrder.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Amount</h3>
                            <p className="font-medium text-gray-900 dark:text-white">₹{selectedOrder.total.toFixed(2)}</p>
                          </div>
                          <div>
                            <h3 className="text-sm text-gray-500 dark:text-gray-400">Status</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedOrder.status)}`}>
                              {getStatusLabel(selectedOrder.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Timeline */}
                      <div className="mb-8">
                        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Order Timeline</h3>
                        <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700 space-y-6">
                          <div className="relative">
                            <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-green-500"></div>
                            <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                              {new Date(selectedOrder.createdAt).toLocaleDateString()}
                            </div>
                            <p className="font-medium text-gray-900 dark:text-white">Order Placed</p>
                          </div>
                          <div className="relative">
                            <div className={`absolute -left-[25px] w-4 h-4 rounded-full ${['processing', 'shipped', 'delivered'].includes(selectedOrder.status.toLowerCase()) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                            <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                              {new Date(new Date(selectedOrder.createdAt).getTime() + 86400000).toLocaleDateString()}
                            </div>
                            <p className={`font-medium ${['processing', 'shipped', 'delivered'].includes(selectedOrder.status.toLowerCase()) ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>Order Processed</p>
                          </div>
                          <div className="relative">
                            <div className={`absolute -left-[25px] w-4 h-4 rounded-full ${['shipped', 'delivered'].includes(selectedOrder.status.toLowerCase()) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                            <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                              {new Date(new Date(selectedOrder.createdAt).getTime() + 172800000).toLocaleDateString()}
                            </div>
                            <p className={`font-medium ${['shipped', 'delivered'].includes(selectedOrder.status.toLowerCase()) ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>Order Shipped</p>
                          </div>
                          <div className="relative">
                            <div className={`absolute -left-[25px] w-4 h-4 rounded-full ${selectedOrder.status.toLowerCase() === 'delivered' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                            <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                              {selectedOrder.status.toLowerCase() === 'delivered' 
                                ? new Date(new Date(selectedOrder.createdAt).getTime() + 432000000).toLocaleDateString()
                                : 'Pending'}
                            </div>
                            <p className={`font-medium ${selectedOrder.status.toLowerCase() === 'delivered' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>Order Delivered</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Items */}
                      <div>
                        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Items ({selectedOrder.items.length})</h3>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          {selectedOrder.items.map((item, index) => (
                            <div key={item.productId || item.id || index} className={`flex p-4 ${index !== selectedOrder.items.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                              <div className="w-20 h-20 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = getFallbackImage(item.category);
                                  }}
                                />
                              </div>
                              <div className="ml-4 flex-grow">
                                <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quantity: {item.quantity}</p>
                                <div className="mt-2 flex justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Price per unit</span>
                                  <span className="font-medium text-gray-900 dark:text-white">₹{item.price.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Order Summary */}
                          <div className="bg-gray-50 dark:bg-gray-700 p-4">
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                              <span className="text-gray-900 dark:text-white">
                                ₹{selectedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                              <span className="text-gray-900 dark:text-white">₹50.00</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600 dark:text-gray-400">Tax</span>
                              <span className="text-gray-900 dark:text-white">
                                ₹{(selectedOrder.total * 0.18).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-200 dark:border-gray-600 mt-2">
                              <span className="text-gray-900 dark:text-white">Total</span>
                              <span className="text-primary">₹{selectedOrder.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="mt-8 flex flex-wrap gap-4">
                        <button className="px-4 py-2 border border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black rounded-md transition-colors">
                          Download Invoice
                        </button>
                        <button className="px-4 py-2 border border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black rounded-md transition-colors">
                          Track Order
                        </button>
                        <button className="px-4 py-2 border border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black rounded-md transition-colors">
                          Buy Again
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Orders List */
                    <>
                      {/* Order Search & Filter */}
                      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative w-full sm:w-64">
                          <input
                            type="text"
                            placeholder="Search orders..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        
                        <select className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option value="">All Orders</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      
                      {/* Orders List */}
                      <div className="space-y-6">
                        {/* Loading state */}
                        {ordersLoading && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">Loading your orders...</div>
                        )}
                        {/* Empty state */}
                        {!ordersLoading && orders.length === 0 && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">You haven't placed any orders yet.</div>
                        )}
                        {/* Orders */}
                        {!ordersLoading && orders.map(order => (
                          <div 
                            key={order._id}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleOrderClick(order._id)}
                          >
                            {/* Order Header */}
                            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Order #</p>
                                <p className="font-medium text-gray-900 dark:text-white">{order.orderNumber}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                                <p className="font-medium text-gray-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                                <p className="font-medium text-gray-900 dark:text-white">₹{order.total.toFixed(2)}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                                  {getStatusLabel(order.status)}
                                </span>
                              </div>
                              
                              <div className="sm:ml-auto">
                                <button 
                                  className="text-primary hover:text-primary-dark font-medium text-sm flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOrderClick(order._id);
                                  }}
                                >
                                  View Details
                                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            {/* Order Items */}
                            <div className="p-6">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Items</h4>
                              
                              <div className="space-y-4">
                                {order.items.map((item, idx) => (
                                  <div key={item.productId || item.id || idx} className="flex items-center space-x-4">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-16 h-16 object-cover rounded"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = getFallbackImage(item.category);
                                      }}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-gray-900 dark:text-white truncate">
                                        {item.name}
                                      </p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Qty: {item.quantity}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium text-gray-900 dark:text-white">
                                        ₹{item.price.toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="mt-6 flex justify-between items-center">
                                <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary">
                                  Need Help?
                                </button>
                                
                                <button className="px-4 py-2 border border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black rounded-md transition-colors">
                                  Buy Again
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {/* Placeholder for other tabs */}
              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">My Addresses</h2>
                  {/* Addresses content would go here */}
                  <p className="text-gray-600 dark:text-gray-400">Manage your shipping and billing addresses.</p>
                </div>
              )}
              
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">My Wishlist</h2>
                  {/* Wishlist content would go here */}
                  <p className="text-gray-600 dark:text-gray-400">Products you've saved for later.</p>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Account Settings</h2>
                  {/* Settings content would go here */}
                  <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and security settings.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
