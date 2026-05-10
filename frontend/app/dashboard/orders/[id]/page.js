'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { orderAPI } from '@/services/api';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiCheckCircle, FiClock, FiTruck, FiPackage, FiX } from 'react-icons/fi';

const formatPrice = (p) => `৳${Number(p || 0).toLocaleString('en-BD')}`;

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const STATUS_ICONS = { pending: FiClock, confirmed: FiCheckCircle, processing: FiPackage, shipped: FiTruck, delivered: FiCheckCircle };

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    orderAPI.getOne(id)
      .then(d => { setOrder(d.order); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const data = await orderAPI.cancel(id, 'Cancelled by customer');
      setOrder(data.order);
      toast.success('Order cancelled.');
    } catch (err) { toast.error(err.message); }
    finally { setCancelling(false); }
  };

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 shimmer w-48" />
      <div className="h-32 shimmer" />
      <div className="h-64 shimmer" />
    </div>
  );

  if (!order) return <p className="text-muted">Order not found.</p>;

  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/orders" className="text-muted hover:text-primary transition-colors">
          <FiArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-heading font-900 uppercase text-2xl text-white">{order.orderNumber}</h1>
          <p className="text-muted text-xs">{new Date(order.createdAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Status Tracker */}
      {order.status !== 'cancelled' && (
        <div className="card p-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-px bg-border" />
            <div className="absolute top-5 left-0 h-px bg-primary transition-all duration-500"
              style={{ width: `${(stepIndex / (STATUS_STEPS.length - 1)) * 100}%` }} />
            {STATUS_STEPS.map((step, i) => {
              const Icon = STATUS_ICONS[step] || FiCheckCircle;
              const done = i <= stepIndex;
              return (
                <div key={step} className="relative flex flex-col items-center gap-2 z-10">
                  <div className={`w-10 h-10 flex items-center justify-center border-2 transition-all duration-300 ${
                    done ? 'bg-primary border-primary text-black' : 'bg-dark border-border text-muted'
                  }`}>
                    <Icon size={16} />
                  </div>
                  <span className={`text-xs font-heading font-600 uppercase hidden md:block ${done ? 'text-primary' : 'text-muted'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {order.status === 'cancelled' && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 p-4">
          <FiX className="text-red-400" size={20} />
          <div>
            <p className="text-red-400 font-600">Order Cancelled</p>
            {order.cancellationReason && <p className="text-muted text-xs">{order.cancellationReason}</p>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 card p-6">
          <h2 className="font-heading font-700 uppercase text-sm tracking-wider text-white mb-5">Order Items</h2>
          <div className="space-y-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="w-16 h-16 border border-border bg-dark-3 shrink-0 overflow-hidden">
                  {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-xl">💪</div>}
                </div>
                <div className="flex-1">
                  <p className="text-white font-600 text-sm">{item.name}</p>
                  <p className="text-muted text-xs mt-1">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <p className="text-primary font-heading font-700">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-5 pt-5 border-t border-border space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="text-white">{formatPrice(order.itemsTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Shipping</span>
              <span className={order.shippingCost === 0 ? 'text-primary' : 'text-white'}>
                {order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-border">
              <span className="font-heading font-700 uppercase text-sm text-white">Total</span>
              <span className="font-heading font-900 text-xl text-primary">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Shipping */}
          <div className="card p-5">
            <h3 className="font-heading font-700 uppercase text-xs tracking-wider text-white mb-4">Shipping Address</h3>
            <div className="text-sm space-y-1">
              <p className="text-white font-600">{order.shippingAddress?.fullName}</p>
              <p className="text-muted">{order.shippingAddress?.phone}</p>
              <p className="text-muted">{order.shippingAddress?.street}</p>
              <p className="text-muted">{order.shippingAddress?.city}, {order.shippingAddress?.zip}</p>
              <p className="text-muted">{order.shippingAddress?.country}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-5">
            <h3 className="font-heading font-700 uppercase text-xs tracking-wider text-white mb-3">Payment</h3>
            <p className="text-white font-600 text-sm">{order.paymentMethod}</p>
            <span className={`badge text-[10px] mt-2 ${order.paymentStatus === 'paid' ? 'badge-green' : 'badge-yellow'}`}>
              {order.paymentStatus}
            </span>
          </div>

          {/* Cancel button */}
          {['pending', 'confirmed'].includes(order.status) && (
            <button onClick={handleCancel} disabled={cancelling}
              className="w-full border border-red-500/50 text-red-400 font-heading font-600 uppercase text-sm py-3 hover:bg-red-500/10 transition-colors disabled:opacity-50">
              {cancelling ? 'CANCELLING...' : 'CANCEL ORDER'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
