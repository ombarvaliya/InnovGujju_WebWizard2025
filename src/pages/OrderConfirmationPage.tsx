import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  items: OrderItem[];
  total: number;
  shippingAddress: Address | null;
  paymentMethod: string;
}

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const order = location.state?.order as Order;

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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find the order details. Please check your order history.</p>
            <button
              onClick={() => navigate('/account/orders')}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition-colors"
            >
              View Orders
            </button>
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
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <div className="text-sm text-gray-500">
              Order Number: {order.orderNumber}
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold mb-6">Order Details</h2>
            
            {/* Items */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-white">
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
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-primary font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
              {order.shippingAddress ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">{order.shippingAddress.type}</p>
                  <div className="text-gray-600 space-y-1">
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              ) : user?.address ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">Default Address</p>
                  <div className="text-gray-600 space-y-1">
                    <p>Bharapara, Chora Pase, Palitana</p>
                    <p>India</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">No shipping address provided</p>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Payment Method</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium capitalize">
                  {order.paymentMethod.replace('_', ' ')}
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹10.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{(order.total * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/account/orders')}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderConfirmationPage; 