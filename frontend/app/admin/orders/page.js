'use client';
import { useEffect, useState, useCallback } from 'react';
import { orderAPI } from '@/services/api';
import { toast } from 'react-hot-toast';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const formatPrice = (p) => `৳${Number(p || 0).toLocaleString('en-BD')}`;

const STATUS_STYLES = {
  pending:    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed:  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped:    'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered:  'bg-primary/20 text-primary border-primary/30',
  cancelled:  'bg-red-500/20 text-red-400 border-red-500/30',
};

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

function OrderRow({ order, onStatusUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await orderAPI.updateStatus(order._id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      onStatusUpdate();
    } catch (err) { toast.error(err.message); }
    finally { setUpdating(false); }
  };

  return (
    <>
      <tr className="border-b border-border hover:bg-dark-3/50 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}>
        <td className="px-5 py-4">
          <p className="font-heading font-700 text-sm text-primary">{order.orderNumber}</p>
          <p className="text-muted text-xs">{new Date(order.createdAt).toLocaleDateString('en-BD')}</p>
        </td>
        <td className="px-5 py-4">
          <p className="text-white text-sm font-600">{order.user?.name}</p>
          <p className="text-muted text-xs">{order.user?.email}</p>
        </td>
        <td className="px-5 py-4">
          <p className="text-white text-sm">{order.items?.length} item(s)</p>
          <p className="text-muted text-xs">{order.paymentMethod}</p>
        </td>
        <td className="px-5 py-4">
          <p className="font-heading font-700 text-white">{formatPrice(order.totalPrice)}</p>
        </td>
        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
          <select
            value={order.status}
            onChange={e => handleStatus(e.target.value)}
            disabled={updating || order.status === 'cancelled' || order.status === 'delivered'}
            className={`text-xs font-heading font-700 uppercase border px-2 py-1.5 bg-dark-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none ${STATUS_STYLES[order.status]}`}
          >
            {ORDER_STATUSES.map(s => (
              <option key={s} value={s} className="text-white bg-dark-3">{s}</option>
            ))}
          </select>
        </td>
        <td className="px-5 py-4 text-muted">
          {expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-dark-3/40 border-b border-border">
          <td colSpan={6} className="px-5 py-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Items */}
              <div className="md:col-span-2">
                <p className="text-muted text-xs uppercase tracking-widest font-600 mb-3">Order Items</p>
                <div className="space-y-2">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 object-cover border border-border" />}
                      <div className="flex-1">
                        <p className="text-white text-sm">{item.name}</p>
                        <p className="text-muted text-xs">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                      <p className="text-primary font-heading font-700 text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Shipping */}
              <div>
                <p className="text-muted text-xs uppercase tracking-widest font-600 mb-3">Shipping Address</p>
                <div className="text-sm text-muted space-y-1">
                  <p className="text-white font-600">{order.shippingAddress?.fullName}</p>
                  <p>{order.shippingAddress?.phone}</p>
                  <p>{order.shippingAddress?.street}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.zip}</p>
                  <p>{order.shippingAddress?.country}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-border space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="text-white">{formatPrice(order.itemsTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Shipping</span>
                    <span className="text-white">{order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between font-700">
                    <span className="text-white text-sm">Total</span>
                    <span className="text-primary font-heading">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      const data = await orderAPI.getAll(params);
      setOrders(data.orders || []);
      setPagination(data.pagination || {});
    } catch (e) { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-900 uppercase text-3xl text-white">ORDERS</h1>
          <p className="text-muted text-sm mt-1">{pagination.total || 0} total orders</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {['', ...ORDER_STATUSES].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`font-heading font-600 uppercase text-xs px-4 py-2 border transition-all ${
              statusFilter === s ? 'bg-primary text-black border-primary' : 'border-border text-muted hover:border-primary/50 hover:text-white'
            }`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-3 border-b border-border">
              <tr>
                {['Order #', 'Customer', 'Items', 'Total', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-muted text-xs uppercase tracking-widest font-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(8).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array(6).fill(0).map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 shimmer" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-muted">No orders found</td></tr>
              ) : orders.map(order => (
                <OrderRow key={order._id} order={order} onStatusUpdate={fetchOrders} />
              ))}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-border">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 font-heading font-700 text-sm border transition-all ${
                  page === p ? 'bg-primary text-black border-primary' : 'border-border text-muted hover:border-primary hover:text-primary'
                }`}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
