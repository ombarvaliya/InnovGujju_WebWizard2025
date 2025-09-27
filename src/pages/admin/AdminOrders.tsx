import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  userId: { _id: string; name: string; email: string } | string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  items: OrderItem[];
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 1, limit: 50, status: filterStatus, search: searchTerm }
      });
      if (response.data?.success) {
        const list: Order[] = response.data.data.orders || [];
        setOrders(list);
        setError(null);
      } else {
        setOrders([]);
        setError('Failed to load orders');
      }
    } catch (e) {
      console.error('Failed to fetch orders', e);
      // Provide clearer message when not admin/unauthorized
      // @ts-ignore
      const status = e?.response?.status;
      if (status === 401) setError('Unauthorized. Please log in as an admin.');
      else if (status === 403) setError('Forbidden. Your account does not have admin access.');
      else setError('Unable to fetch orders. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchOrders(), 400);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Light polling to reflect latest orders in near real-time
  useEffect(() => {
    const timer = setInterval(() => {
      fetchOrders();
    }, 10000); // refresh every 10s
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, searchTerm]);

  // Immediate refresh when any page dispatches 'orders:updated' or storage flag changes
  useEffect(() => {
    const onOrdersUpdated = () => fetchOrders();
    window.addEventListener('orders:updated', onOrdersUpdated as EventListener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'orders_last_update') fetchOrders();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('orders:updated', onOrdersUpdated as EventListener);
      window.removeEventListener('storage', onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredOrders = orders; // Filtering handled by API params

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/admin/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <div className="flex space-x-2">
          <button onClick={fetchOrders} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200">
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by customer name, email, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading orders…</td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{typeof order.userId === 'object' ? order.userId.name : ''}</div>
                    <div className="text-sm text-gray-500">{typeof order.userId === 'object' ? order.userId.email : ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{order.total.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 items-center">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value as Order['status'])}
                        className="text-xs px-2 py-1 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        className="text-blue-600 hover:text-blue-800 text-xs underline"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending Orders</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'processing').length}
            </div>
            <div className="text-sm text-gray-600">Processing Orders</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {orders.filter(o => o.status === 'shipped').length}
            </div>
            <div className="text-sm text-gray-600">Shipped Orders</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
            <div className="text-sm text-gray-600">Delivered Orders</div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Order #{selectedOrder.orderNumber}</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Customer</div>
                  <div className="font-medium">{typeof selectedOrder.userId === 'object' ? selectedOrder.userId.name : ''}</div>
                  <div className="text-gray-500">{typeof selectedOrder.userId === 'object' ? selectedOrder.userId.email : ''}</div>
                </div>
                <div>
                  <div className="text-gray-500">Status</div>
                  <div className="font-medium capitalize">{selectedOrder.status}</div>
                </div>
                <div>
                  <div className="text-gray-500">Placed</div>
                  <div className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-500">Total</div>
                  <div className="font-medium">₹{selectedOrder.total.toFixed(2)}</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Items ({selectedOrder.items.length})</h4>
                <div className="divide-y">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="py-3 flex items-center gap-3">
                      <img src={it.image} alt={it.name} className="w-12 h-12 rounded object-cover" />
                      <div className="flex-1">
                        <div className="font-medium">{it.name}</div>
                        <div className="text-sm text-gray-500">Qty: {it.quantity}</div>
                      </div>
                      <div className="text-sm font-medium">₹{(it.price * it.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end">
              <button className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
