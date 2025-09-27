import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

type PaymentMethod = 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'cod';

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

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items: cartItems, totalPrice, clearCart } = useCart();
  
  // Prefer API URL from environment in production; fallback to localhost in dev
  // Expect REACT_APP_API_URL to be something like: http://localhost:5000/api
  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

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

  // Mock addresses array - replace with actual data from backend when available
  const mockAddresses: Address[] = [
    {
      id: '1',
      type: 'Home',
      street: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      zip: user?.zip || '',
      country: user?.country || 'India',
      isDefault: true
    }
  ];

  const subtotal = totalPrice;
  const shipping = 10;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setCurrentStep(2);
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePaymentDetails = (): boolean => {
    setPaymentError(null);

    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        setPaymentError('Please fill in all card details');
        return false;
      }
      // Basic card number validation (16 digits)
      if (!/^\d{16}$/.test(cardDetails.number.replace(/\s/g, ''))) {
        setPaymentError('Please enter a valid 16-digit card number');
        return false;
      }
      // Basic expiry validation (MM/YY format)
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) {
        setPaymentError('Please enter a valid expiry date (MM/YY)');
        return false;
      }
      // Basic CVV validation (3-4 digits)
      if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        setPaymentError('Please enter a valid CVV');
        return false;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId) {
        setPaymentError('Please enter your UPI ID');
        return false;
      }
      // Basic UPI ID validation
      if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        setPaymentError('Please enter a valid UPI ID');
        return false;
      }
    } else if (paymentMethod === 'net_banking') {
      if (!selectedBank) {
        setPaymentError('Please select a bank');
        return false;
      }
    }
    // COD doesn't need validation
    return true;
  };

  const handleContinue = () => {
    if (currentStep === 2 && !validatePaymentDetails()) {
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  // Places an order by sending cart + shipping + payment to backend
  // On success, clears the cart, emits an event to refresh orders page,
  // and navigates to order confirmation.
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // Prepare order data for API
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category || 'default'
        })),
        total: total,
        shippingAddress: selectedAddress || {
          type: 'Home',
          street: 'Bharapara, Chora Pase, Palitana',
          city: 'Palitana',
          state: 'Gujarat',
          zip: '364270',
          country: 'India'
        },
        paymentMethod: paymentMethod
      };

      // Debug logs
      console.log('Current user during order creation:', user);
      console.log('Order data being sent:', orderData);

  // Send order to backend
  const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to create order');
      }

      console.log('Order created successfully:', result.order);

  // Clear the cart after successful order
      clearCart();
      
  // Notify other pages (like My Orders/Admin Orders) to re-fetch immediately
  window.dispatchEvent(new Event('orders:updated'));
  try {
    localStorage.setItem('orders_last_update', String(Date.now()));
  } catch {}
      
      // Navigate to confirmation page
      navigate('/order-confirmation', { state: { order: result.order } });
    } catch (error) {
      console.error('Error placing order:', error);
      // Handle error appropriately - you might want to show a user-friendly error message
    } finally {
      setIsProcessing(false);
    }
  };

  return (
        <motion.div
      className="min-h-screen bg-gray-50 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div className={`flex flex-col items-center relative flex-1 ${currentStep >= 1 ? 'active' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-2 transition-all duration-300 ${
                  currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>1</div>
                <div className={`text-sm font-medium transition-colors duration-300 ${
                  currentStep >= 1 ? 'text-gray-900' : 'text-gray-500'
                }`}>Shipping</div>
              </div>
              <div className={`flex-1 h-0.5 mx-4 mt-4 transition-colors duration-300 ${
                currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'
              }`}></div>
              <div className={`flex flex-col items-center relative flex-1 ${currentStep >= 2 ? 'active' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-2 transition-all duration-300 ${
                  currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>2</div>
                <div className={`text-sm font-medium transition-colors duration-300 ${
                  currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'
                }`}>Payment</div>
              </div>
              <div className={`flex-1 h-0.5 mx-4 mt-4 transition-colors duration-300 ${
                currentStep >= 3 ? 'bg-primary' : 'bg-gray-200'
              }`}></div>
              <div className={`flex flex-col items-center relative flex-1 ${currentStep >= 3 ? 'active' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-2 transition-all duration-300 ${
                  currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>3</div>
                <div className={`text-sm font-medium transition-colors duration-300 ${
                  currentStep >= 3 ? 'text-gray-900' : 'text-gray-500'
                }`}>Review</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-semibold mb-6">Shipping Address</h2>
                  {/* Address Selection */}
                  <div className="space-y-4">
                    {mockAddresses.map((address: Address) => (
                      <div
                        key={address.id}
                        className={`border rounded-lg p-4 cursor-pointer ${
                          selectedAddress?.id === address.id ? 'border-primary' : 'border-gray-200'
                        }`}
                        onClick={() => handleAddressSelect(address)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{address.type}</p>
                            <p>{address.street}</p>
                            <p>{address.city}, {address.state} {address.zip}</p>
                            <p>{address.country}</p>
                      </div>
                          {address.isDefault && (
                            <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>
                  <div className="space-y-6">
                    {/* Payment Method Selection */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        className={`p-4 border rounded-lg ${
                          paymentMethod === 'credit_card' ? 'border-primary' : 'border-gray-200'
                        }`}
                        onClick={() => handlePaymentMethodSelect('credit_card')}
                      >
                        Credit Card
                      </button>
                      <button
                        className={`p-4 border rounded-lg ${
                          paymentMethod === 'debit_card' ? 'border-primary' : 'border-gray-200'
                        }`}
                        onClick={() => handlePaymentMethodSelect('debit_card')}
                      >
                        Debit Card
                      </button>
                      <button
                        className={`p-4 border rounded-lg ${
                          paymentMethod === 'upi' ? 'border-primary' : 'border-gray-200'
                        }`}
                        onClick={() => handlePaymentMethodSelect('upi')}
                      >
                        UPI
                      </button>
                      <button
                        className={`p-4 border rounded-lg ${
                          paymentMethod === 'net_banking' ? 'border-primary' : 'border-gray-200'
                        }`}
                        onClick={() => handlePaymentMethodSelect('net_banking')}
                      >
                        Net Banking
                      </button>
                      <button
                        className={`p-4 border rounded-lg ${
                          paymentMethod === 'cod' ? 'border-primary' : 'border-gray-200'
                        }`}
                        onClick={() => handlePaymentMethodSelect('cod')}
                      >
                        Cash on Delivery
                      </button>
                    </div>
                    
                    {paymentError && (
                      <div className="text-red-600 text-sm mt-2">{paymentError}</div>
                    )}

                    {/* Payment Details Form */}
                    {paymentMethod === 'credit_card' || paymentMethod === 'debit_card' ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Card Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="number"
                            value={cardDetails.number}
                            onChange={handleCardInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Cardholder Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={cardDetails.name}
                            onChange={handleCardInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                              Expiry Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                              name="expiry"
                              value={cardDetails.expiry}
                              onChange={handleCardInputChange}
                              className="w-full p-2 border rounded"
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                            CVV <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="cvv"
                              value={cardDetails.cvv}
                              onChange={handleCardInputChange}
                              className="w-full p-2 border rounded"
                            placeholder="123"
                            required
                            />
                          </div>
                        </div>
                      </div>
                    ) : paymentMethod === 'upi' ? (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          UPI ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full p-2 border rounded"
                          placeholder="yourname@upi"
                          required
                        />
                      </div>
                    ) : paymentMethod === 'net_banking' ? (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Select Bank <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full p-2 border rounded"
                          required
                        >
                          <option value="">Select a bank</option>
                          <option value="hdfc">HDFC Bank</option>
                          <option value="icici">ICICI Bank</option>
                          <option value="sbi">State Bank of India</option>
                          <option value="axis">Axis Bank</option>
                        </select>
                      </div>
                    ) : paymentMethod === 'cod' ? (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600">
                          You will pay the full amount when your order is delivered.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Note: Additional charges may apply for cash on delivery.
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-semibold mb-6">Review Order</h2>
                  <div className="space-y-6">
                    {/* Order Summary */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                      <div className="space-y-4">
                        {cartItems.map((item) => (
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
                    <div>
                      <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
                      {selectedAddress && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="font-medium text-gray-900 mb-2">{selectedAddress.type}</p>
                          <div className="text-gray-600 space-y-1">
                            <p>{selectedAddress.street}</p>
                            <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}</p>
                            <p>{selectedAddress.country}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                      <div className="bg-gray-50 p-4 rounded">
                        <p className="font-medium capitalize">
                          {paymentMethod.replace('_', ' ')}
                        </p>
                        {paymentMethod === 'credit_card' || paymentMethod === 'debit_card' ? (
                          <p>Card ending in {cardDetails.number.slice(-4)}</p>
                        ) : paymentMethod === 'upi' ? (
                          <p>UPI ID: {upiId}</p>
                        ) : paymentMethod === 'net_banking' ? (
                          <p>Bank: {selectedBank}</p>
                        ) : paymentMethod === 'cod' ? (
                          <p>Cash on Delivery</p>
                        ) : null}
                      </div>
                    </div>
                        </div>
                      </div>
                    )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="mt-6 space-y-4">
                  {currentStep > 1 && (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="w-full py-2 px-4 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
                    >
                      Back
                    </button>
                  )}
                  {currentStep < 3 ? (
                    <button
                      onClick={handleContinue}
                      className="w-full py-2 px-4 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                    >
                      Continue
                    </button>
                  ) : (
                  <button 
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="w-full py-2 px-4 bg-primary text-white rounded hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;