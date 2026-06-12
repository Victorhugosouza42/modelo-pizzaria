import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Products from './pages/admin/Products';
import Stock from './pages/admin/Stock';
import Settings from './pages/admin/Settings';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useApp();
  if (!isAdmin) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
      <Route path="/cardapio" element={<CustomerLayout><Menu /></CustomerLayout>} />
      <Route path="/carrinho" element={<CustomerLayout><Cart /></CustomerLayout>} />
      <Route path="/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<Login />} />
      <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/admin/pedidos" element={<AdminRoute><Orders /></AdminRoute>} />
      <Route path="/admin/produtos" element={<AdminRoute><Products /></AdminRoute>} />
      <Route path="/admin/estoque" element={<AdminRoute><Stock /></AdminRoute>} />
      <Route path="/admin/configuracoes" element={<AdminRoute><Settings /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
