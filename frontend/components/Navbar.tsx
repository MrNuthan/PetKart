import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Search, ShoppingBag, User, LogOut, Menu, X, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { favorites } = useFavorites();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Sync search term with URL params when they change
  React.useEffect(() => {
    const urlSearchTerm = searchParams.get('search') || '';
    setSearchTerm(urlSearchTerm);
  }, [searchParams]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/');
    }
    setIsMobileSearchOpen(false);
  };

  const cartCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left: Main Brand Logo */}
          <div className="flex-shrink-0 relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-40 animate-glow-pulse" />
            <Link to="/" className="relative flex items-center group">
              <img
                src="/pet_logo.png"
                alt="PetKart"
                className="h-20 md:h-28 w-auto transition-all duration-500 group-hover:scale-105 filter brightness-110 drop-shadow-[0_0_12px_rgba(0,210,255,0.3)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/StackBlitz/stackblitz-images/main/petkart-logo.png';
                }}
              />
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-grow justify-center max-w-xl mx-8">
            <div className="relative w-full group">
              <Search
                onClick={handleSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors cursor-pointer hover:text-primary"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for your pet's happiness..."
                className="w-full bg-white/5 border border-white/5 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/10 focus:border-primary/30 transition-all placeholder:text-zinc-600 text-zinc-200"
              />
            </div>
          </div>

          {/* Right: Actions & Secondary Brand Badge */}
          <div className="flex items-center space-x-1 md:space-x-4">
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link to="/favorites" className="relative group p-2.5 hidden sm:block">
              <Heart className="w-5 h-5 text-zinc-500 group-hover:text-primary-coral transition-colors" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 bg-primary-coral text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center shadow-lg">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative group p-2.5">
              <ShoppingBag className="w-5 h-5 text-zinc-500 group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 aura-btn text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="h-6 w-[1px] bg-white/5 mx-2 hidden sm:block"></div>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="p-2.5 rounded-full hover:bg-white/5 transition-colors group" title="View Profile">
                  <User className="w-5 h-5 text-zinc-500 group-hover:text-white" />
                </Link>
                <button
                  onClick={() => logout()}
                  className="ml-2 px-5 py-2 rounded-full border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-red-400 text-[10px] font-black uppercase tracking-widest transition-all duration-300 hidden sm:block"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 px-7 py-2.5 rounded-full aura-btn text-white text-[11px] font-black uppercase tracking-widest transition-all duration-300"
              >
                Login
              </Link>
            )}



            <button
              className="md:hidden p-2 text-zinc-400"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Drawer */}
      {isMobileSearchOpen && (
        <div className="md:hidden glass border-t border-white/5 animate-fade-in absolute w-full left-0 shadow-2xl">
          <div className="px-4 py-6">
            <div className="relative w-full group">
              <Search
                onClick={handleSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors cursor-pointer hover:text-primary"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for your pet's happiness..."
                className="w-full bg-white/5 border border-white/5 rounded-full py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/10 focus:border-primary/30 transition-all placeholder:text-zinc-600 text-zinc-200"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden glass border-t border-white/5 animate-fade-in absolute w-full left-0 shadow-2xl">
          <div className="px-4 py-8 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <Link to="/favorites" onClick={() => setIsOpen(false)} className="flex items-center p-5 bg-white/5 rounded-2xl border border-white/5 relative">
                <Heart className="w-5 h-5 text-primary-coral mr-3" />
                <span className="text-xs font-bold uppercase tracking-widest">Saved</span>
                {favorites.length > 0 && (
                  <span className="ml-auto bg-primary-coral text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center p-5 bg-white/5 rounded-2xl border border-white/5">
                <ShoppingBag className="w-5 h-5 text-primary mr-3" />
                <span className="text-xs font-bold uppercase tracking-widest">Cart</span>
              </Link>
            </div>
            <div className="space-y-4">
              <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center py-4 rounded-2xl aura-btn text-white text-xs font-black tracking-widest uppercase">
                {user ? 'View Profile' : 'Login / Register'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;