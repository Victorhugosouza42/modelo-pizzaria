import { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AdminSidebar from '../../components/AdminSidebar';
import { defaultSettings } from '../../data/initialData';
import { BusinessSettings } from '../../types';

export default function Settings() {
  const { settings, updateSettings, showToast } = useApp();
  const [form, setForm] = useState<BusinessSettings>({ ...settings });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'deliveryFee' || name === 'minOrder' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    showToast('Configurações salvas com sucesso!');
  };

  const handleReset = () => {
    if (confirm('Deseja restaurar as configurações padrão?')) {
      setForm({ ...defaultSettings });
      updateSettings(defaultSettings);
      showToast('Configurações restauradas!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Configurações</h1>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">Configure as informações do seu negócio</p>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2 self-start"
            >
              <RotateCcw className="w-4 h-4" /> Restaurar Padrão
            </button>
          </div>

          <form onSubmit={handleSave} className="max-w-2xl space-y-4 sm:space-y-6">
            {/* Business Info */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Informações do Negócio</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome do Negócio</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Seu Negócio"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Endereço</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Seu Endereço, 123 - Centro - Sua Cidade/UF"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone</label>
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="11999999999"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">Apenas números, com DDD</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Número WhatsApp</label>
                    <input
                      type="text"
                      name="whatsappNumber"
                      value={form.whatsappNumber}
                      onChange={handleChange}
                      placeholder="5511999999999"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">Código país + DDD + número</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Horário de Funcionamento</label>
                  <input
                    type="text"
                    name="openingHours"
                    value={form.openingHours}
                    onChange={handleChange}
                    placeholder="18:00 às 23:00"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Settings */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Configurações de Delivery</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Taxa de Entrega (R$)</label>
                  <input
                    type="number"
                    name="deliveryFee"
                    value={form.deliveryFee || ''}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="5.00"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Pedido Mínimo (R$)</label>
                  <input
                    type="number"
                    name="minOrder"
                    value={form.minOrder || ''}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="20.00"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Pré-visualização WhatsApp</h2>
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    🍕
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{form.name || 'Seu Negócio'}</p>
                    <p className="text-xs text-gray-500">Pedidos serão enviados para este número</p>
                  </div>
                </div>
                <p className="text-sm text-emerald-700 font-mono bg-white rounded-lg p-3 mt-2 break-all">
                  wa.me/{form.whatsappNumber || '5511999999999'}
                </p>
              </div>
            </div>

            {/* Save */}
            <button
              type="submit"
              className="btn-primary text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg flex items-center gap-2 w-full justify-center"
            >
              <Save className="w-5 h-5" /> Salvar Configurações
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
