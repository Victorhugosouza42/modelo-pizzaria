import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, Phone, Star, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/initialData';

export default function Home() {
  const { settings, products } = useApp();
  const activeProducts = products.filter(p => p.active);
  const popularProducts = activeProducts.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 sm:pt-36 sm:pb-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/10">
              <span className="text-2xl">🍕</span>
              <span className="text-white/90 text-sm font-medium">A melhor pizza da cidade</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              {settings.name}
            </h1>
            <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Peça sua pizza favorita e receba no conforto da sua casa. Sabor e qualidade em cada fatia!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/cardapio"
                className="btn-primary text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 shadow-2xl shadow-primary-600/30"
              >
                Ver Cardápio <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-2xl font-bold text-lg text-white border-2 border-white/20 hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Phone className="w-5 h-5" /> Fale Conosco
              </a>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100L60 90C120 80 240 60 360 50C480 40 600 40 720 45C840 50 960 60 1080 65C1200 70 1320 70 1380 70L1440 70V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 flex items-center gap-4 border border-gray-100">
            <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-7 h-7 text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Horário</h3>
              <p className="text-sm text-gray-500">{settings.openingHours}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 flex items-center gap-4 border border-gray-100">
            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Truck className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Delivery</h3>
              <p className="text-sm text-gray-500">Taxa: R$ {settings.deliveryFee.toFixed(2).replace('.', ',')}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 flex items-center gap-4 border border-gray-100">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Endereço</h3>
              <p className="text-sm text-gray-500">{settings.address}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">Nossas Categorias</h2>
          <p className="text-gray-500 text-lg">Escolha por categoria e encontre seu sabor favorito</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.name}
              to={`/cardapio?categoria=${encodeURIComponent(cat.name)}`}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:-translate-y-1 group"
            >
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <span className="text-3xl">{cat.emoji}</span>
              </div>
              <h3 className="font-bold text-gray-800 text-sm">{cat.name}</h3>
              <p className="text-xs text-gray-400 mt-1">
                {activeProducts.filter(p => p.category === cat.name).length} itens
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2">Mais Pedidos</h2>
              <p className="text-gray-500 text-lg">Os favoritos dos nossos clientes</p>
            </div>
            <Link to="/cardapio" className="hidden sm:flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all">
              Ver todos <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all border border-gray-100 flex items-center gap-4">
                <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${categories.find(c => c.name === product.category)?.gradient || 'from-gray-400 to-gray-500'} flex items-center justify-center flex-shrink-0`}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span className="text-3xl">{categories.find(c => c.name === product.category)?.emoji || '🍕'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-accent-500 fill-accent-500" />
                    <span className="text-xs text-gray-400">Popular</span>
                  </div>
                  <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-primary-600 font-bold text-lg">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link to="/cardapio" className="btn-primary text-white px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2">
              Ver Cardápio Completo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <span className="text-5xl mb-4 block animate-float">🍕</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Bateu aquela fome?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
              Faça seu pedido agora mesmo e receba onde estiver! Pedido mínimo: R$ {settings.minOrder.toFixed(2).replace('.', ',')}
            </p>
            <Link
              to="/cardapio"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              Fazer Pedido <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-xl">🍕</span>
              </div>
              <div>
                <h3 className="font-bold">{settings.name}</h3>
                <p className="text-sm text-slate-400">{settings.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                WhatsApp
              </a>
              <span>•</span>
              <span>{settings.openingHours}</span>
              <span>•</span>
              <Link to="/admin" className="hover:text-white transition-colors">
                Área Admin
              </Link>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} {settings.name}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
