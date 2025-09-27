import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated = false, logout = () => {}, user = null } = useAuth() || {};
  const { totalItems = 0 } = useCart() || {};
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed w-full z-50 transition-all duration-700 ${
        isScrolled
          ? 'backdrop-blur-xl bg-gradient-to-r from-gray-900/90 via-gray-950/90 to-gray-900/90 shadow-2xl shadow-violet-500/20 border-b border-violet-500/20'
          : 'backdrop-blur-lg bg-gradient-to-r from-gray-900/70 via-gray-950/70 to-gray-900/70 shadow-xl shadow-violet-500/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              to="/"
              className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-violet-400 via-purple-500 to-violet-600 bg-clip-text text-transparent drop-shadow-2xl hover:from-violet-300 hover:via-purple-400 hover:to-violet-500 transition-all duration-500"
            >
              E-Store
            </Link>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`relative text-lg font-medium tracking-wide transition-all duration-300 px-4 py-2 rounded-full group ${
                    location.pathname.startsWith(item.path)
                      ? 'text-violet-400 bg-violet-500/10 shadow-lg shadow-violet-500/20'
                      : 'text-gray-300 hover:text-violet-400 hover:bg-violet-500/5'
                  }`}
                >
                  {item.name}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-violet-400 to-purple-500 w-0 group-hover:w-full"
                    transition={{ duration: 0.3 }}
                    style={{ transform: 'translateX(-50%)' }}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative hidden sm:block group"
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-12 pr-6 py-2.5 rounded-full bg-gray-800/30 border border-gray-700/30 backdrop-blur-md
                           focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500/60 text-gray-200
                           placeholder-gray-400 transition-all duration-500 ease-out w-44 focus:w-56 shadow-lg
                           hover:bg-gray-800/50 hover:border-gray-600/40 hover:shadow-violet-500/20
                           focus:bg-gray-800/60 focus:shadow-violet-500/30"
              />
              <motion.button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-violet-400 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <svg
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  className="w-full h-full"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </motion.button>
            </form>

            {/* Cart */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link to="/cart" className="relative group">
                <div className="p-2.5 rounded-full bg-gray-800/30 backdrop-blur-md border border-gray-700/30 shadow-lg 
                              group-hover:bg-violet-500/10 group-hover:border-violet-500/30 
                              group-hover:shadow-violet-500/20 transition-all duration-300">
                  <svg
                    className="w-6 h-6 text-gray-300 group-hover:text-violet-400 transition-colors duration-300"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {totalItems > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.2 }}
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </div>
              </Link>
            </motion.div>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 rounded-full bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 px-3 py-2 shadow-lg hover:bg-violet-500/10 hover:border-violet-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {user?.profileImage ? (
                    <motion.img
                      src={user.profileImage}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover border-2 border-violet-500 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    />
                  ) : (
                    <motion.div
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </motion.div>
                  )}
                  <span className="font-medium text-gray-200 hidden md:block">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <motion.svg
                    className="w-4 h-4 text-gray-300 hidden md:block"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    animate={{ rotate: showUserMenu ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </motion.svg>
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-56 rounded-xl bg-gray-900/95 backdrop-blur-xl shadow-2xl border border-gray-700/50 overflow-hidden"
                    >
                      <motion.div
                        className="px-4 py-3 border-b border-gray-700/50"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <p className="text-sm text-gray-400">Signed in as</p>
                        <p className="font-medium text-gray-200 truncate">
                          {user?.email}
                        </p>
                      </motion.div>
                      {user?.role === 'admin' && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                        >
                          <Link
                            to="/admin"
                            className="block px-4 py-3 text-blue-400 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:text-blue-300 transition-all duration-300"
                            onClick={() => setShowUserMenu(false)}
                          >
                            🔧 Admin Panel
                          </Link>
                        </motion.div>
                      )}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Link
                          to="/profile"
                          className="block px-4 py-3 text-gray-200 hover:bg-gradient-to-r hover:from-violet-500/20 hover:to-purple-500/20 hover:text-violet-300 transition-all duration-300"
                          onClick={() => setShowUserMenu(false)}
                        >
                          👤 Profile
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-red-400 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 hover:text-red-300 transition-all duration-300"
                        >
                          🚪 Logout
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-gradient-to-r from-black-600 to-purple-600 rounded-full shadow-lg hover:shadow-violet-500/30 transition-all duration-300"
                
                >
                  <Link
                    to="/login"
                    className="text-white px-5 py-2 rounded-full hover:from-violet-500 hover:to-purple-500 
                               transition-all duration-300 block font-medium"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-full shadow-lg hover:shadow-violet-500/30 transition-all duration-300"
                >
                  <Link
                    to="/register"
                    className="text-white px-5 py-2 rounded-full hover:from-violet-500 hover:to-purple-500 
                               transition-all duration-300 block font-medium"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
