import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { categories } from '../data/initialData';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cart, updateCartQuantity } = useApp();
  const [added, setAdded] = useState(false);

  const cartItem = cart.find(item => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const categoryInfo = categories.find(c => c.name === product.category);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 600);
  };

  return (
    <div className="product-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
      {/* Image Area */}
      <div className={`relative h-48 bg-gradient-to-br ${categoryInfo?.gradient || 'from-gray-400 to-gray-500'} flex items-center justify-center overflow-hidden`}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <span className="text-7xl group-hover:scale-110 transition-transform duration-500">
            {categoryInfo?.emoji || '🍕'}
          </span>
        )}
        {product.stockQuantity <= product.minStock && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Últimas unidades
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-800 text-lg leading-tight">{product.name}</h3>
          <span className="text-primary-600 font-bold text-lg whitespace-nowrap">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>

        {/* Add to Cart */}
        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
              added
                ? 'bg-emerald-500 text-white'
                : 'btn-primary text-white'
            }`}
          >
            {added ? (
              <>
                <span>✓ Adicionado</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Adicionar</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-1">
            <button
              onClick={() => updateCartQuantity(product.id, quantity - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-100 transition-colors"
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <span className="font-bold text-gray-800 text-lg">{quantity}</span>
            <button
              onClick={() => updateCartQuantity(product.id, quantity + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg btn-primary text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
