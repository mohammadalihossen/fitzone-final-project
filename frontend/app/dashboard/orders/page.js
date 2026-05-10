'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { orderAPI } from '@/services/api';
import { FiPackage } from 'react-icons/fi';

const formatPrice = (p) => `৳${p?.toLocaleString('en-BD')}`;
const STATUS_STYLES = {
  pending: 'badge-yellow', confirmed: 'badge-green', processing: 'badge-green',
  shipped: 'badge-green', delivered: 'badge-green', cancelled: 'badge-red'
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getUserOrders().then(d => { setOrders(d.orders || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-3">{Array(5).fill(0).map((_, i) => <div key={i} className="h-24 shimmer" />)}</div>;

  return (
    <div>
      <h1 className="font-heading font-900 uppercase text-3xl text-white mb-8">MY ORDERS</h1>
      {orders.length === 0 ? (
        <div className="card p-16 text-center">
          <FiPackage className="text-muted mx-auto mb-4" size={48} />
          <p className="text-muted mb-4">You haven't placed any orders yet.</p>
          <Link href="/products" className="btn-primary px-6 py-3">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order._id} href={`/dashboard/orders/${order._id}`}
              className="card p-5 block hover:border-primary/50 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-heading font-700 text-lg text-primary">{order.orderNumber}</p>
                  <p className="text-muted text-xs mt-1">{new Date(order.createdAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <span className={STATUS_STYLES[order.status]}>{order.status}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 object-cover border border-border" />}
                    <span className="text-muted text-xs">{item.name} × {item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-between">
                <span className="text-muted text-sm">{order.paymentMethod} • {order.items.length} item(s)</span>
                <span className="font-heading font-700 text-white">{formatPrice(order.totalPrice)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
