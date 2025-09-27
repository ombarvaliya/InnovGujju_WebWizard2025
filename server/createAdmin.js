const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@estore.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email: admin@estore.com');
      console.log('Password: admin123');
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@estore.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9876543210',
      address: 'Mumbai, Maharashtra, India'
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@estore.com');
    console.log('Password: admin123');
    console.log('Role: admin');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
};

createAdminUser(); 