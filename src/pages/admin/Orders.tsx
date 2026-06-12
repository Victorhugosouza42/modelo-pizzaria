import { useState } from 'react';
import { Clock, CheckCircle, XCircle, Truck, TrendingUp, Search, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AdminSidebar from '../../components/AdminSidebar';
import { Order } from '../../types';

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock; nextStatus?: string }> = {
  pending: { label: 'Pendente', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, nextStatus: 'preparing' },
  preparing: { label: 'Preparando', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: TrendingUp, nextStatus: 'delivering' },
  delivering: { label: 'Entregando', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Truck, nextStatus: 'delivered' },
  delivered: { label: 'Entregue', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

const nextStatusLabel: Record<string, string> = {
  pending: 'Preparar',
  preparing: 'Saiu p/ entrega',
  delivering: 'Entregue',
};

export default function Orders() {
  const { orders, updateOrderStatus, deleteOrder } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'all' || o.status === filter;
    const matchesSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Pedidos</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Gerencie todos os pedidos</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente ou ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {[
                { value: 'all', label: 'Todos' },
                { value: 'pending', label: '⏳ Pendentes' },
                { value: 'preparing', label: '👨‍🍳 Preparando' },
                { value: 'delivering', label: '🚚 Entregando' },
                { value: 'delivered', label: '✅ Entregues' },
                { value: 'cancelled', label: '❌ Cancelados' },
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    filter === f.value
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-sm border border-gray-100">
              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-200" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-400 text-sm">Os pedidos aparecerão aqui quando os clientes fizerem seus pedidos</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredOrders.map(order => {
                const config = statusConfig[order.status];
                const StatusIcon = config.icon;
                const isExpanded = selectedOrder?.id === order.id;
                return (
                  <div key={order.id} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className={`w-10 h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
                            <StatusIcon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-gray-800 text-sm sm:text-base">{order.customerName}</h3>
                              <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border ${config.color}`}>
                                {config.label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">
                              #{order.id.slice(-6)} • {new Date(order.date).toLocaleDateString('pt-BR')} às {new Date(order.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {order.items.slice(0, 3).map((item, idx) => (
                                <span key={idx} className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                                  {item.quantity}x {item.productName}
                                </span>
                              ))}
                              {order.items.length > 3 && (
                                <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
                                  +{order.items.length - 3} mais
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-primary-600 text-sm sm:text-lg">R$ {order.total.toFixed(2).replace('.', ',')}</p>
                          <p className="text-[10px] sm:text-xs text-gray-400">💳 {order.paymentMethod}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        {config.nextStatus && (
                          <button
                            onClick={() => updateOrderStatus(order.id, config.nextStatus as Order['status'])}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm"
                          >
                            ✅ {nextStatusLabel[order.status]}
                          </button>
                        )}
                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            Cancelar
                          </button>
                        )}
                        <div className="flex-1" />
                        <button
                          onClick={() => setSelectedOrder(isExpanded ? null : order)}
                          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 animate-fade-in">
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-400 text-xs">📱 Telefone:</span>
                              <p className="text-gray-700 font-medium">{order.customerPhone}</p>
                            </div>
                            <div>
                              <span className="text-gray-400 text-xs">🏘️ Bairro:</span>
                              <p className="text-gray-700 font-medium">{order.customerNeighborhood}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="text-gray-400 text-xs">📍 Endereço:</span>
                              <p className="text-gray-700 font-medium">{order.customerAddress}{order.customerComplement ? ` - ${order.customerComplement}` : ''}</p>
                            </div>
                            <div>
                              <span className="text-gray-400 text-xs">🏙️ Cidade:</span>
                              <p className="text-gray-700 font-medium">{order.customerCity}</p>
                            </div>
                            {order.observations && (
                              <div className="sm:col-span-2">
                                <span className="text-gray-400 text-xs">📝 Observações:</span>
                                <p className="text-gray-700 font-medium">{order.observations}</p>
                              </div>
                            )}
                          </div>
                          <div className="border-t border-gray-200 pt-3">
                            <p className="text-xs font-semibold text-gray-500 mb-2">ITENS DO PEDIDO</p>
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm py-1">
                                <span className="text-gray-700">{item.quantity}x {item.productName}</span>
                                <span className="text-gray-700 font-medium">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
