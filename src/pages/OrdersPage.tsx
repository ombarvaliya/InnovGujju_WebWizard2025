import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

// Shape of each item in an order returned by the backend
// Note: backend stores productId (not id). We keep id optional to remain
// compatible if any historical local orders had `id`.
interface OrderItem {
  productId: string;
  id?: string; // optional fallback
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

// Minimal address fields the UI uses
interface Address {
  type: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// Order object returned by the backend
interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  items: OrderItem[];
  total: number;
  shippingAddress: Address | null;
  paymentMethod: string;
  userId: string;
}

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Prefer API URL from env; fallback to localhost for dev
  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

  // Fetch orders for the current user from backend
  const fetchOrders = async () => {
    if (!user) return; // safety guard
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  // Initial fetch when user is ready
  useEffect(() => {
    if (!user) return;
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Live refresh: if checkout fires a global 'orders:updated' event,
  // re-fetch orders so the new order appears immediately
  useEffect(() => {
    const onOrdersUpdated = () => fetchOrders();
    window.addEventListener('orders:updated', onOrdersUpdated as EventListener);
    return () => window.removeEventListener('orders:updated', onOrdersUpdated as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fallback image handler
  const getFallbackImage = (category: string) => {
    const fallbackImages: {[key: string]: string} = {
      electronics: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      furniture: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      clothing: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      default: "https://images.unsplash.com/photo-1553531384-411a247ccd73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    };
    return fallbackImages[category.toLowerCase()] || fallbackImages.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-lg shadow-md p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">No Orders Found</h1>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
        <motion.div
      className="min-h-screen bg-gray-50 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">My Orders</h1>
          
            <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.orderNumber} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                      <div>
                      <h2 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h2>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.productId || item.id || Math.random().toString(36)}
                        className="flex items-center space-x-4"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = getFallbackImage(item.category || 'default');
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-primary font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                      </div>
                      
                {/* Order Summary */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                      <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-lg font-semibold text-gray-900">₹{order.total.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {order.paymentMethod.replace('_', ' ')}
                      </p>
                      </div>
                    </div>
                  </div>
                  
                {/* Shipping Address */}
                <div className="p-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
                  {order.shippingAddress ? (
                    <div className="text-sm text-gray-600">
                      <p>{order.shippingAddress.street}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  ) : user?.address ? (
                    <div className="text-sm text-gray-600">
                      <p>Bharapara, Chora Pase, Palitana</p>
                      <p>India</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No shipping address provided</p>
                  )}
                    </div>
                  </div>
              ))}
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrdersPage;