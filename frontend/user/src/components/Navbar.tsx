import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  X,
  Heart,
  LogOut,
  Package,
  ChevronDown,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        'sticky top-0 z-[60] w-full transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl py-1 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-b border-slate-100'
          : 'bg-white py-2 border-b border-slate-100'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between gap-6 h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center group">
            <img
              src="/petkart-logo.png"
              alt="PetKart — Online Pet Store"
              className="h-20 w-auto max-w-[220px] object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg relative items-center">
            <input
              type="text"
              placeholder="Search products for your pet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-2 border-transparent hover:bg-slate-100 rounded-full transition-all focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 text-sm font-medium outline-none"
            />
            <button type="submit" className="absolute left-4">
              <Search className="w-4 h-4 text-slate-400" />
            </button>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            {/* Favorites */}
            <Link
              to="/favorites"
              className="relative p-2.5 rounded-2xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all hidden sm:flex"
            >
              <Heart className="w-5 h-5" />
              <AnimatePresence>
                {favorites.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center"
                  >
                    {favorites.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-2xl text-slate-500 hover:text-primary hover:bg-primary/5 transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-primary/30"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* User Menu / Auth Button */}
            {user ? (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-3 pr-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-all shadow-lg shadow-slate-900/20 text-sm font-bold"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="max-w-[80px] truncate">{user.firstName || user.username}</span>
                  <ChevronDown className={cn('w-3 h-3 transition-transform', showUserMenu && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => {}}
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        My Orders
                      </Link>
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-all shadow-lg shadow-slate-900/20 text-sm font-bold"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl lg:hidden text-slate-900"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[80] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-4 flex items-center justify-between border-b border-slate-100">
                <img
                  src="/petkart-logo.png"
                  alt="PetKart"
                  className="h-16 w-auto max-w-[180px] object-contain"
                />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </form>

                {/* Nav Links */}
                <div className="space-y-1">
                  {[
                    { to: '/', label: 'Home' },
                    { to: '/cart', label: `Cart (${cartCount})` },
                    { to: '/favorites', label: `Favorites (${favorites.length})` },
                    ...(user
                      ? [
                          { to: '/profile', label: 'My Profile' },
                          { to: '/profile', label: 'My Orders' },
                        ]
                      : []),
                    { to: '/contact', label: 'Contact Us' },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="block w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-sm font-bold text-slate-700 transition-all"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-slate-100">
                {user ? (
                  <button
                    onClick={logout}
                    className="w-full py-3.5 bg-red-50 text-red-500 rounded-2xl font-bold text-sm transition-all hover:bg-red-100"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full py-3.5 bg-slate-900 text-white text-center rounded-2xl font-black text-sm shadow-2xl"
                  >
                    Sign In to Your Account
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
