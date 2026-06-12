import { useState } from 'react';
import { AlertTriangle, Package, TrendingDown, CheckCircle, Search, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AdminSidebar from '../../components/AdminSidebar';
import { categories } from '../../data/initialData';

export default function Stock() {
  const { products, updateProduct, lowStockProducts } = useApp();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ stockQuantity: 0, minStock: 0 });

  const activeProducts = products.filter(p => p.active);
  const filteredProducts = activeProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const outOfStock = products.filter(p => p.stockQuantity === 0 && p.active);
  const lowStock = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= p.minStock && p.active);
  const goodStock = products.filter(p => p.stockQuantity > p.minStock && p.active);

  const startEdit = (id: string, stockQty: number, minStk: number) => {
    setEditingId(id);
    setEditForm({ stockQuantity: stockQty, minStock: minStk });
  };

  const saveEdit = () => {
    if (!editingId) return;
    const product = products.find(p => p.id === editingId);
    if (product) {
      updateProduct({
        ...product,
        stockQuantity: editForm.stockQuantity,
        minStock: editForm.minStock,
      });
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Controle de Estoque</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Gerencie o estoque dos seus produtos</p>
          </div>

          {/* Alert Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6">
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm border border-red-100">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">{outOfStock.length}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Esgotados</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm border border-amber-100">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-amber-600">{lowStock.length}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Estoque Baixo</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm border border-emerald-100">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-emerald-600">{goodStock.length}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Em Dia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Alerts */}
          {lowStockProducts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <h3 className="font-bold text-red-800 text-sm sm:text-base">Produtos com estoque crítico</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {lowStockProducts.map(p => (
                  <span key={p.id} className={`text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg ${
                    p.stockQuantity === 0
                      ? 'bg-red-200 text-red-800'
                      : 'bg-amber-200 text-amber-800'
                  }`}>
                    {p.name}: {p.stockQuantity} un. (mín: {p.minStock})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 text-sm"
            />
          </div>

          {/* Mobile: Cards */}
          <div className="lg:hidden space-y-3">
            {filteredProducts.map(product => {
              const isEditing = editingId === product.id;
              const percentage = product.minStock > 0 ? (product.stockQuantity / product.minStock) * 100 : 100;
              const level = product.stockQuantity === 0 ? 'empty' : percentage <= 100 ? 'low' : 'good';
              const catInfo = categories.find(c => c.name === product.category);

              return (
                <div key={product.id} className={`rounded-xl p-4 shadow-sm border ${
                  level === 'empty' ? 'bg-red-50/80 border-red-200' :
                  level === 'low' ? 'bg-amber-50/80 border-amber-200' :
                  'bg-white border-gray-100'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${catInfo?.gradient || 'from-gray-400 to-gray-500'} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-lg">{catInfo?.emoji || '📦'}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 text-sm truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.category}</p>
                      </div>
                    </div>
                    <span className="text-lg ml-2">
                      {level === 'empty' ? '⛔' : level === 'low' ? '⚠️' : '✅'}
                    </span>
                  </div>

                  {/* Stock Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        level === 'empty' ? 'bg-red-500' : level === 'low' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </div>

                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Qtd. Atual</label>
                        <input
                          type="number"
                          value={editForm.stockQuantity}
                          onChange={e => setEditForm(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) || 0 }))}
                          className="w-full text-center px-3 py-2 bg-white border border-primary-300 rounded-lg focus:outline-none text-gray-800 font-semibold text-sm"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Estoque Mín.</label>
                        <input
                          type="number"
                          value={editForm.minStock}
                          onChange={e => setEditForm(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
                          className="w-full text-center px-3 py-2 bg-white border border-primary-300 rounded-lg focus:outline-none text-gray-800 font-semibold text-sm"
                          min="0"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className={`font-bold ${level === 'empty' ? 'text-red-600' : level === 'low' ? 'text-amber-600' : 'text-gray-800'}`}>
                        {product.stockQuantity} un.
                      </span>
                      <span className="text-gray-400">Mín: {product.minStock}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button onClick={cancelEdit} className="flex-1 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                          Cancelar
                        </button>
                        <button onClick={saveEdit} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1">
                          <Save className="w-4 h-4" /> Salvar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEdit(product.id, product.stockQuantity, product.minStock)}
                        className="w-full py-2 rounded-lg text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
                      >
                        Editar Estoque
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: Table */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produto</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qtd. Atual</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estoque Mín.</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nível</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map(product => {
                    const isEditing = editingId === product.id;
                    const percentage = product.minStock > 0 ? (product.stockQuantity / product.minStock) * 100 : 100;
                    const level = product.stockQuantity === 0 ? 'empty' : percentage <= 100 ? 'low' : 'good';

                    return (
                      <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${
                        level === 'empty' ? 'bg-red-50/50' : level === 'low' ? 'bg-amber-50/50' : ''
                      }`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-4 h-4 text-gray-400" />
                            </div>
                            <span className="font-semibold text-gray-800 text-sm">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                        <td className="px-6 py-4 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editForm.stockQuantity}
                              onChange={e => setEditForm(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) || 0 }))}
                              className="w-20 text-center px-3 py-1.5 bg-white border border-primary-300 rounded-lg focus:outline-none text-gray-800 font-semibold text-sm mx-auto"
                              min="0"
                            />
                          ) : (
                            <span className={`font-bold text-sm ${
                              level === 'empty' ? 'text-red-600' : level === 'low' ? 'text-amber-600' : 'text-gray-800'
                            }`}>
                              {product.stockQuantity}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editForm.minStock}
                              onChange={e => setEditForm(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
                              className="w-20 text-center px-3 py-1.5 bg-white border border-primary-300 rounded-lg focus:outline-none text-gray-800 font-semibold text-sm mx-auto"
                              min="0"
                            />
                          ) : (
                            <span className="font-semibold text-sm text-gray-500">{product.minStock}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  level === 'empty' ? 'bg-red-500 w-0' :
                                  level === 'low' ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(100, percentage)}%` }}
                              />
                            </div>
                            <span className="ml-2 text-xs font-bold">
                              {level === 'empty' ? '⛔' : level === 'low' ? '⚠️' : '✅'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isEditing ? (
                            <button
                              onClick={saveEdit}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
                            >
                              <Save className="w-4 h-4" /> Salvar
                            </button>
                          ) : (
                            <button
                              onClick={() => startEdit(product.id, product.stockQuantity, product.minStock)}
                              className="text-sm text-primary-600 hover:text-primary-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors"
                            >
                              Editar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredProducts.length === 0 && (
              <div className="p-12 text-center text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
