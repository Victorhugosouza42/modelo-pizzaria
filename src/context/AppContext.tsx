import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, CartItem, Order, BusinessSettings } from '../types';
import { initialProducts, defaultSettings } from '../data/initialData';

interface AppContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
  settings: BusinessSettings;
  updateSettings: (settings: BusinessSettings) => void;
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  lowStockProducts: Product[];
  toast: string;
  showToast: (message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    return fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage('pizzaria_products', initialProducts));
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage('pizzaria_cart', []));
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage('pizzaria_orders', []));
  const [settings, setSettings] = useState<BusinessSettings>(() => loadFromStorage('pizzaria_settings', defaultSettings));
  const [isAdmin, setIsAdmin] = useState<boolean>(() => loadFromStorage('pizzaria_admin', false));
  const [toast, setToast] = useState('');

  useEffect(() => { saveToStorage('pizzaria_products', products); }, [products]);
  useEffect(() => { saveToStorage('pizzaria_cart', cart); }, [cart]);
  useEffect(() => { saveToStorage('pizzaria_orders', orders); }, [orders]);
  useEffect(() => { saveToStorage('pizzaria_settings', settings); }, [settings]);
  useEffect(() => { saveToStorage('pizzaria_admin', isAdmin); }, [isAdmin]);

  const lowStockProducts = products.filter(p => p.stockQuantity <= p.minStock && p.active);

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [...prev, product]);
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCart(prev => prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      ));
    }
  }, []);

  const clearCart = useCallback(() => { setCart([]); }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev]);
    // Reduce stock
    setProducts(prev => prev.map(product => {
      const orderItem = order.items.find(item => item.productName === product.name);
      if (orderItem) {
        return { ...product, stockQuantity: Math.max(0, product.stockQuantity - orderItem.quantity) };
      }
      return product;
    }));
  }, []);

  const updateOrderStatus = useCallback((id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  }, []);

  const updateSettings = useCallback((newSettings: BusinessSettings) => {
    setSettings(newSettings);
  }, []);

  const login = useCallback((password: string) => {
    if (password === '12345') {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  }, []);

  return (
    <AppContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount,
      orders, addOrder, updateOrderStatus, deleteOrder,
      settings, updateSettings,
      isAdmin, login, logout,
      lowStockProducts,
      toast, showToast,
    }}>
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-medium">
            <span>✓</span> {toast}
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
