import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/initialData';

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, settings, clearCart } = useApp();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Seu carrinho está vazio</h2>
          <p className="text-gray-500 mb-8">Adicione itens deliciosos do nosso cardápio!</p>
          <Link
            to="/cardapio"
            className="btn-primary text-white px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
          >
            Ver Cardápio <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Seu Carrinho</h1>
            <p className="text-gray-500 mt-1">{cart.length} {cart.length === 1 ? 'item' : 'itens'}</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            Limpar tudo
          </button>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {cart.map(item => {
            const catInfo = categories.find(c => c.name === item.product.category);
            return (
              <div key={item.product.id} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex items-center gap-4 animate-fade-in">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br ${catInfo?.gradient || 'from-gray-400 to-gray-500'} flex items-center justify-center flex-shrink-0`}>
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span className="text-2xl sm:text-3xl">{catInfo?.emoji || '🍕'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">{item.product.name}</h3>
                  <p className="text-primary-600 font-semibold">R$ {item.product.price.toFixed(2).replace('.', ',')} cada</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <span className="font-bold text-gray-800 w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg btn-primary text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="font-bold text-gray-800">R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-gray-600">
              <span>Subtotal</span>
              <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Taxa de entrega</span>
              <span>R$ {settings.deliveryFee.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-lg font-bold text-primary-600">
                  R$ {(cartTotal + settings.deliveryFee).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>
          {cartTotal < settings.minOrder && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-700">
              ⚠️ Pedido mínimo de R$ {settings.minOrder.toFixed(2).replace('.', ',')} para delivery
            </div>
          )}
          <Link
            to="/checkout"
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all ${
              cartTotal < settings.minOrder
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none'
                : 'btn-primary text-white'
            }`}
          >
            Finalizar Pedido
          </Link>
          <Link
            to="/cardapio"
            className="w-full flex items-center justify-center gap-2 py-3 mt-2 text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
