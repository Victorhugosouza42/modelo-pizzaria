import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu as MenuIcon, X, Pizza, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

export default function Navbar() {
  const { cartCount, settings, isAdmin } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Início' },
    { to: '/cardapio', label: 'Cardápio' },
    { to: '/carrinho', label: 'Carrinho' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Pizza className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-800">{settings.name}</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="px-4 py-2 rounded-lg text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors flex items-center gap-1.5 ml-1"
              >
                <Shield className="w-4 h-4" /> Painel Admin
              </Link>
            )}
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-2">
            <Link
              to="/carrinho"
              className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse-badge">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5 text-gray-700" /> : <MenuIcon className="w-5 h-5 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin ? (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-4 h-4" /> Painel Admin
              </Link>
            ) : (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-4 h-4" /> Área Administrativa
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
