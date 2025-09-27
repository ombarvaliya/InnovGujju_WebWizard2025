const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connection');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { protect } = require('./middleware/auth');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/orders');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api', orderRoutes);

// Auth routes
// Add detailed debugging for registration
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    const { name, email, password, phone, address, profileImage } = req.body;
    
    // Check if any required fields are missing
    if (!name || !email || !password) {
      console.log('Missing required fields for registration');
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and password are required' 
      });
    }
    
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        console.log(`User with email ${email} already exists`);
        return res.status(400).json({ 
          success: false, 
          message: 'User already exists' 
        });
      }
      
      console.log('Creating new user...');
      
      // Create new user with explicit error handling
      const user = new User({
        name,
        email,
        password,
        phone,
        address,
        profileImage
      });
      
      await user.save();
      console.log('User saved successfully');
      
      // Mark as signed in on registration (UI logs in immediately after register)
      try {
        await User.findByIdAndUpdate(user._id, {
          $set: { lastLogin: new Date() },
          $inc: { loginCount: 1 }
        });
      } catch (e) {
        console.error('Failed to set initial login stats on register:', e);
      }

      // Create JWT token
      const token = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: '30d',
      });
      
      console.log('Registration successful for:', email);
      
      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          profileImage: user.profileImage,
          role: user.role
        }
      });
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return res.status(500).json({ 
        success: false, 
        message: `Database error: ${dbError.message}`,
        error: dbError.toString()
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.',
      details: error.toString()
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
  const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Check password
  const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '30d',
    });
    
    // Update lastLogin and loginCount
    try {
      await User.findByIdAndUpdate(user._id, {
        $set: { lastLogin: new Date() },
        $inc: { loginCount: 1 }
      });
    } catch (e) {
      console.error('Failed to update login stats:', e);
    }

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user profile
app.get('/api/user/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update server startup
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Connect to database after server starts
  connectDB()
    .then(() => console.log('Database connection established'))
    .catch(err => {
      console.error('Failed to connect to database:', err);
      // Don't exit process, just log the error
    });
});
