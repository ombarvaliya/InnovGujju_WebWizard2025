import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  profileImage?: string;
}

// Define context type
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData?: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
  loading: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  error: null,
  loading: false
});

// Export the hook
export const useAuth = () => useContext(AuthContext);

// Setup axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for existing token on mount and get user data
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/user/profile');
          if (response.data.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('Error verifying token', err);
          localStorage.removeItem('token');
        }
      }
    };

    checkAuth();
  }, []);

  // Add this type for axios errors
  interface AxiosError {
    response?: {
      data?: {
        message?: string;
        error?: string;
      };
      status?: number;
    };
  }

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        setLoading(false);
        return true;
      }
      
      throw new Error(response.data.message || 'Login failed');
    } catch (err) {
      const error = err as AxiosError;
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
      return false;
    }
  };

  // Signup function
  const signup = async (email: string, password: string, userData?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Signup attempt with email:', email);
      
      // Parse user data from string
      let parsedUserData = {};
      if (userData) {
        try {
          parsedUserData = JSON.parse(userData);
          console.log('User data parsed successfully');
        } catch (e) {
          console.error('Error parsing user data', e);
        }
      }
      
      // Log the actual data being sent to the API
      const requestData = {
        email,
        password,
        ...parsedUserData
      };
      console.log('Sending registration data:', { ...requestData, password: '****' });
      
      const response = await api.post('/auth/register', requestData);
      
      if (response.data.success) {
        console.log('Registration successful');
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        setLoading(false);
        return true;
      }
      
      throw new Error(response.data.message || 'Registration failed');
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      console.error('Registration error:', errorMessage, error);
      
      // Set a more descriptive error message
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    signup,
    logout,
    error,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};