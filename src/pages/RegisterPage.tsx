import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
  // Add any missing state variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signup, error } = useAuth();
  const navigate = useNavigate();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Enhance validation
    if (!name.trim()) {
      setFormError("Full name is required");
      return;
    }

    if (!email.trim()) {
      setFormError("Email is required");
      return;
    }

    if (!phone.trim()) {
      setFormError("Phone number is required");
      return;
    }

    if (!address.trim()) {
      setFormError("Address is required");
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setFormError("Passwords don't match");
      return;
    }

    // Validate password strength (at least 6 characters)
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Pass all user data as a JSON string
      const userData = JSON.stringify({
        name,
        phone,
        address,
        profileImage: photoPreview,
      });

      const success = await signup(email, password, userData);

      if (success) {
        navigate('/');
      }
    } catch (err) {
      setFormError("Failed to create account");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-4 bg-black text-white">
      <div className="container mx-auto max-w-md">
        <h1 className="text-4xl font-poppins font-bold mb-6 text-center text-white">Create Account</h1>
        <p className="text-center mb-8 text-gray-300">Sign up to get started with your new account</p>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-md p-8">
          {(error || formError) && (
            <div className="mb-4 p-3 bg-red-900/30 text-red-300 border border-red-800 rounded-md">
              {formError || error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Profile Photo Upload */}
            <div className="mb-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-800 mb-2">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <label htmlFor="profilePhoto" className="cursor-pointer text-primary hover:text-primary-light text-sm">
                {photoPreview ? 'Change Photo' : 'Upload Photo'}
                <input
                  type="file"
                  id="profilePhoto"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
            
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">Full Name*</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">Email Address*</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-300">Mobile Number*</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your phone number"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium mb-2 text-gray-300">Address*</label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your address"
                required
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-300">Password*</label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                  minLength={6}
                  style={{ color: 'white', caretColor: 'white' }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">Password must be at least 6 characters</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-gray-300">Confirm Password*</label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                  style={{ color: 'white', caretColor: 'white' }}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md focus:outline-none transition duration-200 flex justify-center items-center"
            >
              {loading ? (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              ) : "Sign Up"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary-light">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;