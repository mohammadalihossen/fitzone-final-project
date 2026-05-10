'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/services/api';
import {
  FiShoppingBag, FiUsers, FiPackage, FiAlertTriangle,
  FiDollarSign, FiTrendingUp, FiArrowUp, FiArrowRight,
  FiClock, FiCheckCircle, FiTruck, FiXCircle
} from 'react-icons/fi';

const formatPrice = (p) => `৳${Number(p || 0).toLocaleString('en-BD')}`;

const STATUS_CONFIG = {
  pending:    { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  confirmed:  { color: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/30' },
  processing: { color: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/30' },
  shipped:    { color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
  delivered:  { color: 'text-primary',    bg: 'bg-primary/10',    border: 'border-primary/30' },
  cancelled:  { color: 'text-red-400',    bg: 'bg-red-400/10',    border: 'border-red-400/30' },
};

function StatCard({ icon: Icon, label, value, sub, color, bg }) {
  return (
    <div className="bg-dark-2 border border-border p-6 hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${bg} flex items-center justify-center`}>
          <Icon className={color} size={22} />
        </div>
        <FiArrowUp className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
      </div>
      <p className={`font-black text-3xl ${color} mb-1`}>{value}</p>
      <p className="text-white font-semibold text-sm">{label}</p>
      {sub && <p className="text-muted text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAnalytics()
      .then(d => { setAnalytics(d.analytics); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-dark-3 w-64" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => <div key={i} className="h-36 bg-dark-2 border border-border" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array(4).fill(0).map((_, i) => <div key={i} className="h-64 bg-dark-2 border border-border" />)}
      </div>
    </div>
  );

  const { overview, orderStats, lowStockProducts, recentOrders, topProducts, revenueByMonth } = analytics || {};

  const stats = [
    { icon: FiDollarSign, label: 'Total Revenue', value: formatPrice(overview?.totalRevenue), sub: 'All time earnings', color: 'text-primary', bg: 'bg-primary/10' },
    { icon: FiPackage, label: 'Total Orders', value: overview?.totalOrders || 0, sub: 'All orders', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { icon: FiShoppingBag, label: 'Products', value: overview?.totalProducts || 0, sub: `${overview?.outOfStock || 0} out of stock`, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { icon: FiUsers, label: 'Customers', value: overview?.totalUsers || 0, sub: 'Registered users', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase">Dashboard</h1>
          <p className="text-muted text-sm mt-1">Welcome back, {analytics ? 'here\'s your store overview' : '...'}</p>
        </div>
        <Link href="/admin/products/new"
          className="bg-primary text-black font-bold uppercase text-sm px-5 py-2.5 hover:bg-primary-dark transition-colors flex items-center gap-2">
          + Add Product
        </Link>
      </div>

      {/* Alerts */}
      {(overview?.lowStockCount > 0 || overview?.outOfStock > 0) && (
        <div className="flex flex-wrap gap-3">
          {overview?.outOfStock > 0 && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 px-4 py-3 flex-1">
              <FiAlertTriangle className="text-red-400 shrink-0" size={18} />
              <span className="text-red-400 text-sm font-semibold">{overview.outOfStock} products are out of stock</span>
              <Link href="/admin/products" className="ml-auto text-red-300 text-xs underline shrink-0">Manage →</Link>
            </div>
          )}
          {overview?.lowStockCount > 0 && (
            <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 px-4 py-3 flex-1">
              <FiAlertTriangle className="text-yellow-400 shrink-0" size={18} />
              <span className="text-yellow-400 text-sm font-semibold">{overview.lowStockCount} products are running low</span>
            </div>
          )}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Orders */}
        <div className="bg-dark-2 border border-border">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-bold text-white uppercase text-sm tracking-wider">Recent Orders</h2>
            <Link href="/admin/orders" className="text-primary text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All <FiArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentOrders?.length === 0 && (
              <p className="text-muted text-sm text-center py-8">No orders yet</p>
            )}
            {recentOrders?.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              return (
                <div key={order._id} className="flex items-center justify-between p-4 hover:bg-dark-3/50 transition-colors">
                  <div>
                    <p className="text-primary font-bold text-sm">{order.orderNumber}</p>
                    <p className="text-muted text-xs mt-0.5">{order.user?.name} • {order.items?.length} item(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-sm">{formatPrice(order.totalPrice)}</p>
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-dark-2 border border-border">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-bold text-white uppercase text-sm tracking-wider">Low Stock Alert</h2>
            <Link href="/admin/products" className="text-primary text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Manage <FiArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {lowStockProducts?.length === 0 && (
              <p className="text-primary text-sm text-center py-8">✅ All products well stocked</p>
            )}
            {lowStockProducts?.map(p => (
              <div key={p._id} className="flex items-center gap-4 p-4 hover:bg-dark-3/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold line-clamp-1">{p.name}</p>
                  <p className="text-muted text-xs">{p.brand} · {p.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`font-black text-lg ${p.stock <= 5 ? 'text-red-400' : 'text-yellow-400'}`}>
                    {p.stock}
                  </span>
                  <p className="text-muted text-xs">left</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling */}
        <div className="bg-dark-2 border border-border">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-bold text-white uppercase text-sm tracking-wider">Top Selling Products</h2>
          </div>
          <div className="divide-y divide-border">
            {topProducts?.map((p, i) => (
              <div key={p._id} className="flex items-center gap-4 p-4 hover:bg-dark-3/50 transition-colors">
                <span className="font-black text-2xl text-border w-8 shrink-0">#{i + 1}</span>
                {p.images?.[0]?.url && (
                  <img src={p.images[0].url} alt={p.name}
                    className="w-12 h-12 object-cover border border-border shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold line-clamp-1">{p.name}</p>
                  <p className="text-muted text-xs">{p.totalSold} sold</p>
                </div>
                <p className="text-primary font-black shrink-0">{formatPrice(p.price)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-dark-2 border border-border">
          <div className="p-5 border-b border-border">
            <h2 className="font-bold text-white uppercase text-sm tracking-wider">Order Status Breakdown</h2>
          </div>
          <div className="p-5 space-y-3">
            {orderStats?.map(stat => {
              const cfg = STATUS_CONFIG[stat._id] || STATUS_CONFIG.pending;
              const maxCount = Math.max(...(orderStats?.map(s => s.count) || [1]));
              const pct = Math.round((stat.count / maxCount) * 100);
              return (
                <div key={stat._id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-bold uppercase ${cfg.color}`}>{stat._id}</span>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-muted">{stat.count} orders</span>
                      <span className="text-white font-semibold">{formatPrice(stat.revenue)}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-dark-5 w-full">
                    <div className={`h-full transition-all duration-500 ${cfg.color.replace('text-', 'bg-')}`}
                      style={{ width: pct + '%' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
