import { DollarSign, ShoppingBag, TrendingUp, AlertTriangle, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AdminSidebar from '../../components/AdminSidebar';

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  preparing: { label: 'Preparando', color: 'bg-blue-100 text-blue-700', icon: TrendingUp },
  delivering: { label: 'Entregando', color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered: { label: 'Entregue', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function Dashboard() {
  const { orders, products, lowStockProducts } = useApp();

  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.date).toDateString() === today);
  const todayRevenue = todayOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const activeProducts = products.filter(p => p.active);

  const stats = [
    { label: 'Vendas Hoje', value: `R$ ${todayRevenue.toFixed(2).replace('.', ',')}`, icon: DollarSign, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Pedidos Hoje', value: todayOrders.length, icon: ShoppingBag, color: 'from-blue-500 to-blue-600' },
    { label: 'Pendentes', value: pendingOrders.length, icon: Clock, color: 'from-amber-500 to-amber-600' },
    { label: 'Receita Total', value: `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`, icon: TrendingUp, color: 'from-primary-500 to-primary-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Visão geral do seu negócio</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            {stats.map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg mb-3 sm:mb-4`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">{stat.label}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <h2 className="text-base sm:text-lg font-bold text-gray-800">Pedidos Recentes</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Nenhum pedido ainda</p>
                  </div>
                ) : (
                  orders.slice(0, 8).map(order => {
                    const config = statusConfig[order.status];
                    const StatusIcon = config.icon;
                    return (
                      <div key={order.id} className="p-3 sm:p-4 lg:p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
                            <StatusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">{order.customerName}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(order.date).toLocaleDateString('pt-BR')} {new Date(order.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <p className="font-bold text-gray-800 text-sm">R$ {order.total.toFixed(2).replace('.', ',')}</p>
                          <span className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h2 className="text-base sm:text-lg font-bold text-gray-800">Estoque Baixo</h2>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {lowStockProducts.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Tudo em dia!</p>
                    <p className="text-xs mt-1">Nenhum produto com estoque baixo</p>
                  </div>
                ) : (
                  lowStockProducts.map(product => (
                    <div key={product.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="font-semibold text-gray-800 text-sm truncate mr-2">{product.name}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          product.stockQuantity === 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {product.stockQuantity === 0 ? 'Esgotado' : `${product.stockQuantity} un.`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            product.stockQuantity === 0 ? 'bg-red-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, (product.stockQuantity / product.minStock) * 50)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Mínimo: {product.minStock} un.</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-4 sm:mt-6">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 text-center">
              <p className="text-xl sm:text-3xl font-bold text-gray-800">{activeProducts.length}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Produtos Ativos</p>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 text-center">
              <p className="text-xl sm:text-3xl font-bold text-gray-800">{orders.length}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Total Pedidos</p>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 text-center">
              <p className="text-xl sm:text-3xl font-bold text-amber-500">{lowStockProducts.length}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Alertas Estoque</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
