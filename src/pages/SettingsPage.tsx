import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PasswordInput from '../components/common/PasswordInput';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    productUpdates: false,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update logic here
    alert('Profile updated successfully!');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password update logic here
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password updated successfully!');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle notification preferences update logic here
    alert('Notification preferences updated successfully!');
  };

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-poppins font-bold mb-8">Account Settings</h1>
          
          <div className="bg-white dark:bg-neutral-dark-lighter rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b border-neutral-mid/10">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral-dark/70 dark:text-neutral-light/70 hover:text-primary'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral-dark/70 dark:text-neutral-light/70 hover:text-primary'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'notifications'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral-dark/70 dark:text-neutral-light/70 hover:text-primary'
                }`}
              >
                Notifications
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1" htmlFor="firstName">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={profileForm.firstName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-neutral-mid/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-neutral-dark dark:border-neutral-dark-lighter"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1" htmlFor="lastName">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={profileForm.lastName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-neutral-mid/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-neutral-dark dark:border-neutral-dark-lighter"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1" htmlFor="email">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-neutral-mid/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-neutral-dark dark:border-neutral-dark-lighter"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1" htmlFor="phone">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-neutral-mid/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-neutral-dark dark:border-neutral-dark-lighter"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
              
              {activeTab === 'security' && (
                <form onSubmit={handlePasswordSubmit}>
                  <h2 className="text-xl font-medium mb-6">Change Password</h2>
                  
                  <PasswordInput
                    label="Current Password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    name="currentPassword"
                    placeholder="Enter your current password"
                    required
                    autoComplete="current-password"
                  />
                  
                  <PasswordInput
                    label="New Password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    name="newPassword"
                    placeholder="Enter your new password"
                    required
                    autoComplete="new-password"
                  />
                  
                  <PasswordInput
                    label="Confirm New Password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    name="confirmPassword"
                    placeholder="Confirm your new password"
                    required
                    autoComplete="new-password"
                  />
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              )}
              
              {activeTab === 'notifications' && (
                <form onSubmit={handleNotificationSubmit}>
                  <h2 className="text-xl font-medium mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="orderUpdates"
                          name="orderUpdates"
                          type="checkbox"
                          checked={notifications.orderUpdates}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-primary border-neutral-mid/20 rounded focus:ring-primary"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="orderUpdates" className="font-medium">
                          Order Updates
                        </label>
                        <p className="text-neutral-dark/70 dark:text-neutral-light/70 text-sm">
                          Receive notifications about your order status
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="promotions"
                          name="promotions"
                          type="checkbox"
                          checked={notifications.promotions}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-primary border-neutral-mid/20 rounded focus:ring-primary"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="promotions" className="font-medium">
                          Promotions and Discounts
                        </label>
                        <p className="text-neutral-dark/70 dark:text-neutral-light/70 text-sm">
                          Receive notifications about sales, discounts, and special offers
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="newsletter"
                          name="newsletter"
                          type="checkbox"
                          checked={notifications.newsletter}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-primary border-neutral-mid/20 rounded focus:ring-primary"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="newsletter" className="font-medium">
                          Newsletter
                        </label>
                        <p className="text-neutral-dark/70 dark:text-neutral-light/70 text-sm">
                          Receive our monthly newsletter with product updates and trends
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="productUpdates"
                          name="productUpdates"
                          type="checkbox"
                          checked={notifications.productUpdates}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-primary border-neutral-mid/20 rounded focus:ring-primary"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="productUpdates" className="font-medium">
                          Product Updates
                        </label>
                        <p className="text-neutral-dark/70 dark:text-neutral-light/70 text-sm">
                          Receive notifications when products from your wishlist are back in stock
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                    >
                      Save Preferences
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage; 