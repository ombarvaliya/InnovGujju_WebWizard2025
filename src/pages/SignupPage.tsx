import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const navigate = useNavigate();
  const { signup, error, loading, isAuthenticated } = useAuth();
  
  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Basic validation
    if (!name.trim()) {
      setFormError('Name is required');
      return;
    }
    
    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }
    
    // Email format validation using a simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    if (!password) {
      setFormError('Password is required');
      return;
    }
    
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (!agreeTerms) {
      setFormError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    // Attempt signup
    const success = await signup(name, email, password);
    
    if (success) {
      // Signup successful, navigation will happen via the useEffect
    }
  };
  
  return (
    <motion.div 
      className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-neutral-light dark:bg-neutral-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md px-6">
        <div className="bg-white dark:bg-neutral-dark/30 rounded-card shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-poppins font-bold mb-2 text-neutral-dark dark:text-neutral-light">Create Account</h1>
            <p className="text-neutral-dark/70 dark:text-neutral-light/70">
              Join our community of shoppers
            </p>
          </div>
          
          {/* Error Messages */}
          {(formError || error) && (
            <div className="mb-6 p-3 bg-error/10 border border-error rounded-md text-error text-sm">
              {formError || error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-neutral-dark dark:text-neutral-light">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input w-full"
                placeholder="John Doe"
              />
            </div>
            
            {/* Email Input */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-neutral-dark dark:text-neutral-light">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full"
                placeholder="your@email.com"
              />
            </div>
            
            {/* Password Input */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-neutral-dark dark:text-neutral-light">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-neutral-dark/60 dark:text-neutral-light/60">
                Password must be at least 8 characters long
              </p>
            </div>
            
            {/* Confirm Password Input */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-neutral-dark dark:text-neutral-light">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input w-full"
                placeholder="••••••••"
              />
            </div>
            
            {/* Terms Checkbox */}
            <div className="mb-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-primary"
                />
                <span className="ml-2 text-sm text-neutral-dark/80 dark:text-neutral-light/80">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </span>
              </label>
            </div>
            
            {/* Signup Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>
          
          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-neutral-dark/70 dark:text-neutral-light/70">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SignupPage; 