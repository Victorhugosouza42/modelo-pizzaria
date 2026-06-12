import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, AlertTriangle, Settings, LogOut, Pizza, Menu, X, Home } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

export default function AdminSidebar() {
  const { logout, lowStockProducts, settings } = useApp();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
    { to: '/admin/produtos', label: 'Produtos', icon: Package },
    { to: '/admin/estoque', label: 'Estoque', icon: AlertTriangle, badge: lowStockProducts.length },
    { to: '/admin/configuracoes', label: 'Configurações', icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Pizza className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm text-white truncate">Painel Admin</h2>
            <p className="text-xs text-slate-400 truncate">{settings.name}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 space-y-1">
        {links.map(link => {
          const isActive = location.pathname === link.to;
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{link.label}</span>
              {link.badge !== undefined && link.badge > 0 && (
                <span className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 sm:p-4 border-t border-slate-700/50 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          <span>Ver Loja</span>
        </Link>
        <Link
          to="/"
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>Sair</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white flex-col z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-slate-900 text-white flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <Pizza className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm">Painel Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fade-in">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 text-white flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
