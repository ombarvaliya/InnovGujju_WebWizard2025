const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const User = require('../models/User');
const Order = require('../models/Order');
// Products are not persisted yet; we'll compute from frontend dataset as a temporary fallback
const path = require('path');
let productCountCache = null;
try {
  const productsPath = path.join(__dirname, '..', '..', 'src', 'data', 'products.ts');
  // Naive count by scanning exported default array length when present
  // We cannot import TS here; instead, fallback to 0 and leave TODO.
  productCountCache = null;
} catch (_) {
  productCountCache = null;
}

// Admin Dashboard Stats
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    // Total registered users with role user
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    // Users who actually signed in at least once (loginCount>0 or lastLogin set)
    const totalSignedInUsers = await User.countDocuments({
      role: 'user',
      $or: [
        { loginCount: { $gt: 0 } },
        { lastLogin: { $ne: null } }
      ]
    });

    // Recent sign-ins (fallback to createdAt when lastLogin missing)
    const recentUsers = await User.find({ role: 'user' })
      .sort({ lastLogin: -1, createdAt: -1 })
      .limit(5)
      .select('-password');

    // Total orders
    const totalOrders = await Order.countDocuments({});

    // Total products: until a Product model exists, return count from frontend data length if available
    let totalProducts = 0;
    if (productCountCache !== null) {
      totalProducts = productCountCache;
    } else {
      try {
        // Try reading the TS file and extract rough count by counting occurrences of 'id:' in array
        const fs = require('fs');
        const productsFile = path.join(__dirname, '..', '..', 'src', 'data', 'products.ts');
        const content = fs.readFileSync(productsFile, 'utf8');
        const matches = content.match(/id:\s*['"][^'"]+['"]/g) || [];
        totalProducts = matches.length;
        productCountCache = totalProducts;
      } catch (e) {
        totalProducts = 0;
      }
    }

    res.json({
      success: true,
      data: {
        totalUsers, // total registered users
        totalSignedInUsers, // users who have actually logged in
        totalAdmins,
        totalProducts,
        totalOrders,
        recentUsers,
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ------------------- Admin Analytics Endpoint -------------------
// Returns revenue, orders, AOV, conversion rate approximation, monthly series, and top products
router.get('/analytics', protect, admin, async (req, res) => {
  try {
    const rangeDays = Math.max(1, parseInt(req.query.rangeDays) || 30);
    const now = new Date();
    const startDate = new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000);

    const matchStage = { createdAt: { $gte: startDate } };

    // Totals
    const totalsAgg = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 },
          uniqueBuyers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalOrders: 1,
          uniqueBuyers: { $size: '$uniqueBuyers' }
        }
      }
    ]);

    const totalRevenue = totalsAgg[0]?.totalRevenue || 0;
    const totalOrders = totalsAgg[0]?.totalOrders || 0;
    const uniqueBuyers = totalsAgg[0]?.uniqueBuyers || 0;

    // Conversion rate approximation: unique buyers / total registered users
    const totalRegisteredUsers = await User.countDocuments({ role: 'user' });
    const conversionRate = totalRegisteredUsers > 0 ? (uniqueBuyers / totalRegisteredUsers) * 100 : 0;

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Monthly series (by year+month)
    const monthlyAgg = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.y': 1, '_id.m': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = monthlyAgg.map(row => ({
      month: `${monthNames[row._id.m - 1]} ${row._id.y}`,
      revenue: row.revenue,
      orders: row.orders
    }));

    // Top products by revenue within period
    const topProductsAgg = await Order.aggregate([
      { $match: matchStage },
      { $unwind: '$items' },
      {
        $group: {
          _id: { productId: '$items.productId', name: '$items.name' },
          sales: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    const topProducts = topProductsAgg.map((p, idx) => ({
      productId: p._id.productId,
      name: p._id.name,
      sales: p.sales,
      revenue: p.revenue
    }));

    res.json({
      success: true,
      data: {
        rangeDays,
        totalRevenue,
        totalOrders,
        avgOrderValue,
        conversionRate,
        monthlyData,
        topProducts
      }
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/users', protect, admin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single user (admin only)
router.get('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user role (admin only)
router.patch('/users/:id/role', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Toggle user status (admin only)
router.patch('/users/:id/toggle-status', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Toggle the isActive status
    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      data: user,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// TODO: Add product management routes when Product model is created
// TODO: Add analytics routes

// ------------------- Admin Orders Endpoints -------------------
// List orders with filters, search and pagination
router.get('/orders', protect, admin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'all', search = '' } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search by orderNumber or user name/email
    let userIds = [];
    if (search) {
      const regex = new RegExp(search, 'i');
      const users = await User.find({ $or: [{ name: regex }, { email: regex }] }).select('_id');
      userIds = users.map(u => u._id);
      query.$or = [
        { orderNumber: regex },
        { userId: { $in: userIds } }
      ];
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
      success: true,
      data: {
        orders,
        total,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page)
      }
    });
  } catch (error) {
    console.error('Admin list orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get order details
router.get('/orders/:id', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Admin get order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update order status
router.patch('/orders/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('userId', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order, message: 'Order status updated' });
  } catch (error) {
    console.error('Admin update order status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;