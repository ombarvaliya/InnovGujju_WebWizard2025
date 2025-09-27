import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AdminAnalytics: React.FC = () => {
  // API base URL
  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
  const [rangeDays, setRangeDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    monthlyData: [] as Array<{ month: string; revenue: number; orders: number }>,
    topProducts: [] as Array<{ name: string; sales: number; revenue: number }>
  });
  
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { rangeDays }
      });
      if (res.data?.success) {
        setData(res.data.data);
        setError(null);
      } else {
        setError('Failed to load analytics');
      }
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 401) setError('Unauthorized. Please log in as an admin.');
      else if (status === 403) setError('Forbidden. Your account does not have admin access.');
      else setError('Unable to fetch analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when range changes
  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeDays]);

  // Poll every 10s and listen for order updates across tabs
  useEffect(() => {
    const timer = setInterval(fetchAnalytics, 10000);
    const onOrdersUpdated = () => fetchAnalytics();
    window.addEventListener('orders:updated', onOrdersUpdated as EventListener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'orders_last_update') fetchAnalytics();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      clearInterval(timer);
      window.removeEventListener('orders:updated', onOrdersUpdated as EventListener);
      window.removeEventListener('storage', onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // INR currency formatter
  const formatINR = useMemo(
    () => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }),
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <div className="flex space-x-2">
          <select
            value={rangeDays}
            onChange={(e) => setRangeDays(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 3 months</option>
            <option value={180}>Last 6 months</option>
            <option value={365}>Last year</option>
          </select>
          <button onClick={fetchAnalytics} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200">Refresh</button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{error}</div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-md">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatINR.format(data.totalRevenue)}</p>
              <p className="text-sm text-green-600">+12.5% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-md">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{data.totalOrders}</p>
              <p className="text-sm text-blue-600">+8.3% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-md">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatINR.format(data.avgOrderValue)}</p>
              <p className="text-sm text-purple-600">+4.2% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-md">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data.conversionRate.toFixed(2)}%</p>
              <p className="text-sm text-yellow-600">+0.8% from last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <div className="space-y-3">
            {data.monthlyData.map((row, index) => (
              <div key={`${row.month}-${index}`} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-28">{row.month}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full"
                      style={{ width: `${data.monthlyData.length ? (row.revenue / Math.max(...data.monthlyData.map(m => m.revenue), 1)) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-24">
                  {formatINR.format(row.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Orders</h3>
          <div className="space-y-3">
            {data.monthlyData.map((row, index) => (
              <div key={`${row.month}-${index}`} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-28">{row.month}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-600 h-4 rounded-full"
                      style={{ width: `${data.monthlyData.length ? (row.orders / Math.max(...data.monthlyData.map(m => m.orders), 1)) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12">
                  {row.orders}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.topProducts.map((product, index) => (
                  <tr key={product.name}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          #{index + 1} {product.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.sales} units</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatINR.format(product.revenue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${data.topProducts.length ? (product.sales / Math.max(...data.topProducts.map(p => p.sales), 1)) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {data.topProducts.length ? Math.round((product.sales / Math.max(...data.topProducts.map(p => p.sales), 1)) * 100) : 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Demographics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Customers</span>
              <span className="font-semibold">64%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Returning Customers</span>
              <span className="font-semibold">36%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Session Duration</span>
              <span className="font-semibold">4m 32s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bounce Rate</span>
              <span className="font-semibold">23.5%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Direct</span>
              <span className="font-semibold">42%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Search Engines</span>
              <span className="font-semibold">31%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Social Media</span>
              <span className="font-semibold">18%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email Marketing</span>
              <span className="font-semibold">9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
