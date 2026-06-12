import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Checkout() {
  const { cart, cartTotal, settings, addOrder, clearCart } = useApp();
  const navigate = useNavigate();
  const [orderSent, setOrderSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    neighborhood: '',
    city: '',
    complement: '',
    paymentMethod: 'Dinheiro',
    observations: '',
  });

  const total = cartTotal + settings.deliveryFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isFormValid = form.name && form.phone && form.address && form.neighborhood && form.city && cartTotal >= settings.minOrder;

  const formatWhatsAppMessage = () => {
    const items = cart.map(item =>
      `${item.quantity}x ${item.product.name} - R$ ${(item.product.price * item.quantity).toFixed(2).replace('.', ',')}`
    ).join('\n');

    const message = `🍕 *NOVO PEDIDO - ${settings.name}*

👤 *Cliente:* ${form.name}
📱 *Telefone:* ${form.phone}
📍 *Endereço:* ${form.address}
🏘️ *Bairro:* ${form.neighborhood}
🏠 *Complemento:* ${form.complement || 'Nenhum'}
🏙️ *Cidade:* ${form.city}

📋 *Itens:*
${items}

💰 *Subtotal:* R$ ${cartTotal.toFixed(2).replace('.', ',')}
🚚 *Taxa de entrega:* R$ ${settings.deliveryFee.toFixed(2).replace('.', ',')}
💵 *Total:* R$ ${total.toFixed(2).replace('.', ',')}
💳 *Pagamento:* ${form.paymentMethod}
📝 *Observações:* ${form.observations || 'Nenhuma'}`;

    return encodeURIComponent(message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    // Create order
    const order = {
      id: Date.now().toString(),
      customerName: form.name,
      customerPhone: form.phone,
      customerAddress: form.address,
      customerNeighborhood: form.neighborhood,
      customerCity: form.city,
      customerComplement: form.complement,
      items: cart.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total,
      status: 'pending' as const,
      date: new Date().toISOString(),
      paymentMethod: form.paymentMethod,
      observations: form.observations,
    };

    addOrder(order);

    // Open WhatsApp
    const message = formatWhatsAppMessage();
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank');

    clearCart();
    setOrderSent(true);
  };

  if (orderSent) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-12">
        <div className="max-w-lg mx-auto px-4 sm:px-6 text-center py-20">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in">
            <CheckCircle className="w-14 h-14 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Pedido Enviado! 🎉</h2>
          <p className="text-gray-500 text-lg mb-2">
            Seu pedido foi enviado para nosso WhatsApp.
          </p>
          <p className="text-gray-400 mb-8">
            Em breve entraremos em contato para confirmar!
          </p>
          <div className="space-y-3">
            <Link
              to="/"
              className="btn-primary text-white px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/carrinho');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <Link to="/carrinho" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao carrinho
        </Link>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Finalizar Pedido</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Seus Dados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cidade *</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="Sua cidade"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Endereço de Entrega</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Endereço *</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="Rua, número"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bairro *</label>
                <input
                  type="text"
                  name="neighborhood"
                  value={form.neighborhood}
                  onChange={handleChange}
                  required
                  placeholder="Seu bairro"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Complemento</label>
                <input
                  type="text"
                  name="complement"
                  value={form.complement}
                  onChange={handleChange}
                  placeholder="Apto, bloco, etc."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Pagamento</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Forma de pagamento</label>
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 appearance-none cursor-pointer"
              >
                <option value="Dinheiro">💵 Dinheiro</option>
                <option value="PIX">📱 PIX</option>
                <option value="Cartão de Crédito">💳 Cartão de Crédito</option>
                <option value="Cartão de Débito">💳 Cartão de Débito</option>
              </select>
            </div>
          </div>

          {/* Observations */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Observações</h2>
            <textarea
              name="observations"
              value={form.observations}
              onChange={handleChange}
              rows={3}
              placeholder="Alguma observação? (ex: sem cebola, portão azul...)"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 resize-none"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Resumo do Pedido</h2>
            <div className="space-y-2 mb-4">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item.quantity}x {item.product.name}</span>
                  <span className="text-gray-800 font-medium">R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Taxa de entrega</span>
                <span>R$ {settings.deliveryFee.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-lg text-gray-800 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-primary-600">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all ${
              isFormValid
                ? 'btn-primary text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
            Enviar Pedido via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}
