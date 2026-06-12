import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Search, ImageIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AdminSidebar from '../../components/AdminSidebar';
import { Product } from '../../types';
import { categories } from '../../data/initialData';

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  description: '',
  price: 0,
  image: '',
  category: 'Pizzas Salgadas',
  stockQuantity: 50,
  minStock: 10,
  active: true,
};

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyProduct);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyProduct);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stockQuantity: product.stockQuantity,
      minStock: product.minStock,
      active: product.active,
    });
    setShowModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.price <= 0) return;

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...form });
    } else {
      addProduct({ id: Date.now().toString(), ...form });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(id);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, active: e.target.checked }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Produtos</h1>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">{products.length} produtos cadastrados</p>
            </div>
            <button
              onClick={openAdd}
              className="btn-primary text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary-600/20 text-sm sm:text-base"
            >
              <Plus className="w-5 h-5" /> Novo Produto
            </button>
          </div>

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

          {/* Products Grid (mobile-friendly) / Table (desktop) */}
          {/* Mobile: Cards */}
          <div className="lg:hidden space-y-3">
            {filteredProducts.map(product => {
              const catInfo = categories.find(c => c.name === product.category);
              return (
                <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${catInfo?.gradient || 'from-gray-400 to-gray-500'} flex items-center justify-center flex-shrink-0`}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <span className="text-2xl">{catInfo?.emoji || '🍕'}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-800 text-sm truncate">{product.name}</h3>
                          <p className="text-xs text-gray-400">{product.category}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          product.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {product.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <span className="font-bold text-primary-600 text-sm">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                          <span className={`text-xs ml-2 ${product.stockQuantity <= product.minStock ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                            Estoque: {product.stockQuantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(product)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
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
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Preço</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estoque</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map(product => {
                    const catInfo = categories.find(c => c.name === product.category);
                    return (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${catInfo?.gradient || 'from-gray-400 to-gray-500'} flex items-center justify-center flex-shrink-0`}>
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                              ) : (
                                <span className="text-lg">{catInfo?.emoji || '🍕'}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">{product.name}</p>
                              <p className="text-xs text-gray-400 truncate max-w-[200px]">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                        <td className="px-6 py-4 font-semibold text-gray-800 text-sm">R$ {product.price.toFixed(2).replace('.', ',')}</td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-semibold ${product.stockQuantity <= product.minStock ? 'text-red-500' : 'text-gray-800'}`}>
                            {product.stockQuantity} un.
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            product.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {product.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEdit(product)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredProducts.length === 0 && (
              <div className="p-12 text-center text-gray-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 rounded-t-2xl z-10">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto do Produto</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-36 sm:h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    form.image ? 'border-primary-300 bg-primary-50/50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                  }`}
                >
                  {form.image ? (
                    <div className="relative w-full h-full">
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setForm(prev => ({ ...prev, image: '' })); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Clique para enviar uma foto</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG até 5MB</p>
                    </>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome do Produto *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Pizza Margherita"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Descrição do produto"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 resize-none text-sm"
                />
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Preço (R$) *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price || ''}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 appearance-none cursor-pointer text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.emoji} {cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stock */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Qtd. em Estoque</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={form.stockQuantity || ''}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Estoque Mínimo</label>
                  <input
                    type="number"
                    name="minStock"
                    value={form.minStock || ''}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 text-sm"
                  />
                </div>
              </div>

              {/* Active */}
              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={handleActiveChange}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label className="text-sm font-medium text-gray-700">Produto ativo (visível no cardápio)</label>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2 pb-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-white px-6 py-3 rounded-xl font-semibold text-sm"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
