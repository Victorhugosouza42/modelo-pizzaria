import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/initialData';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';

export default function Menu() {
  const { products } = useApp();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('categoria') || 'Todos';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');

  const activeProducts = products.filter(p => p.active);

  const filteredProducts = useMemo(() => {
    return activeProducts.filter(p => {
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeProducts, selectedCategory, search]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2">Nosso Cardápio</h1>
          <p className="text-gray-500 text-lg">Escolha seus favoritos e monte seu pedido</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar no cardápio..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 sm:hidden" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto pl-4 sm:pl-4 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 appearance-none cursor-pointer"
            >
              <option value="Todos">Todas Categorias</option>
              {categories.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.emoji} {cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills (desktop) */}
        <div className="hidden sm:flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('Todos')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'Todos'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.name
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500">Tente buscar por outro termo ou categoria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
