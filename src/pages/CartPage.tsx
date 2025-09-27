import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-20 px-4 text-gray-800 dark:text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>
          <div className="bg-white dark:bg-black p-8 rounded-lg shadow text-center dark:border dark:border-gray-800">
            <p className="text-xl mb-6 dark:text-white">Your cart is empty</p>
            <Link to="/products" className="btn bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-20 px-4 text-gray-800 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>
        
        <div className="bg-white dark:bg-black rounded-lg shadow-md dark:border dark:border-gray-800 overflow-hidden">
          {/* Cart Header */}
          <div className="grid grid-cols-12 p-4 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-center">Total</div>
          </div>
          
          {/* Cart Items */}
          {items.map(item => (
            <div key={item.id} className="grid grid-cols-12 p-4 border-b dark:border-gray-800 items-center">
              <div className="col-span-6 flex items-center">
                <Link to={`/products/${item.id}`} className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="ml-4">
                    <h3 className="font-medium dark:text-white">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </Link>
              </div>
              
              <div className="col-span-2 text-center dark:text-white">
                ₹{item.price.toFixed(2)}
              </div>
              
              <div className="col-span-2 text-center">
                <div className="flex items-center justify-center">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center border dark:border-gray-600 rounded-l"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-12 h-8 text-center border-t border-b dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border dark:border-gray-600 rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="col-span-2 text-center font-medium dark:text-white">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
          
          {/* Cart Summary */}
          <div className="p-4 flex flex-wrap md:flex-nowrap justify-between items-center">
            <div className="w-full md:w-auto mb-4 md:mb-0">
              <button 
                onClick={clearCart}
                className="text-red-500 hover:text-red-600"
              >
                Clear Cart
              </button>
            </div>
            
            <div className="w-full md:w-auto flex flex-col items-end">
              <div className="text-lg font-medium mb-2 dark:text-white">
                Total: <span className="text-primary">₹{totalPrice.toFixed(2)}</span>
              </div>
              <Link 
                to="/checkout" 
                className="btn bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;