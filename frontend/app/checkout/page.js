'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { orderAPI } from '@/services/api';
import { toast } from 'react-hot-toast';
import { FiCheckCircle } from 'react-icons/fi';

const formatPrice = (p) => `৳${p?.toLocaleString('en-BD')}`;

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const items = useCartStore(s => s.items);
  const clearCart = useCartStore(s => s.clearCart);

  const subtotal = items.reduce((sum, i) => sum + (i.discountPrice || i.price) * i.quantity, 0);
  const shippingCost = subtotal >= 5000 ? 0 : 120;
  const total = subtotal + shippingCost;

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: 'Bangladesh',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Cart is empty'); return; }
    setPlacing(true);
    try {
      const data = await orderAPI.create({
        items: items.map(i => ({ productId: i._id, quantity: i.quantity })),
        shippingAddress: form,
        paymentMethod,
      });
      clearCart();
      setSuccess(data.order);
      toast.success('Order placed successfully! 🎉');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (success) {
    return (
      <div className="pt-24 max-w-lg mx-auto px-4 py-16 text-center">
        <div className="card p-10">
          <FiCheckCircle className="text-primary mx-auto mb-4" size={64} />
          <h1 className="font-heading font-900 uppercase text-4xl mb-3">ORDER PLACED!</h1>
          <p className="text-muted mb-2">Order Number: <span className="text-primary font-heading font-700">{success.orderNumber}</span></p>
          <p className="text-muted text-sm mb-8">We'll confirm your order shortly. Thank you for shopping with FitZone!</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push('/dashboard/orders')} className="btn-primary px-6 py-3">View Orders</button>
            <button onClick={() => router.push('/products')} className="btn-outline px-6 py-3">Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 py-10">
      <h1 className="section-title mb-8">CHECKOUT</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="font-heading font-700 uppercase text-sm tracking-wider text-white mb-6">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-muted text-xs uppercase tracking-wider block mb-2">Full Name *</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} required className="input-field" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-muted text-xs uppercase tracking-wider block mb-2">Phone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required className="input-field" placeholder="01712345678" />
              </div>
              <div className="md:col-span-2">
                <label className="text-muted text-xs uppercase tracking-wider block mb-2">Street Address *</label>
                <input name="street" value={form.street} onChange={handleChange} required className="input-field" placeholder="House/Road/Area" />
              </div>
              <div>
                <label className="text-muted text-xs uppercase tracking-wider block mb-2">City *</label>
                <input name="city" value={form.city} onChange={handleChange} required className="input-field" placeholder="Dhaka" />
              </div>
              <div>
                <label className="text-muted text-xs uppercase tracking-wider block mb-2">ZIP Code *</label>
                <input name="zip" value={form.zip} onChange={handleChange} required className="input-field" placeholder="1212" />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card p-6">
            <h2 className="font-heading font-700 uppercase text-sm tracking-wider text-white mb-6">Payment Method</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['COD', 'bKash', 'Nagad', 'Card'].map(method => (
                <button
                  key={method} type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`p-4 border text-center font-heading font-600 uppercase text-sm transition-all ${
                    paymentMethod === method ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:border-primary/50'
                  }`}
                >
                  {method === 'COD' ? '💵 Cash on Delivery' : method === 'bKash' ? '📱 bKash' : method === 'Nagad' ? '💳 Nagad' : '🏦 Card'}
                </button>
              ))}
            </div>
            {paymentMethod === 'COD' && (
              <p className="text-muted text-sm mt-3">Pay cash when your order is delivered.</p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="font-heading font-700 uppercase text-sm tracking-wider text-white mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {items.map(item => (
                <div key={item._id} className="flex justify-between text-sm gap-2">
                  <span className="text-muted line-clamp-1 flex-1">{item.name} x{item.quantity}</span>
                  <span className="text-white shrink-0">{formatPrice((item.discountPrice || item.price) * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span className={shippingCost === 0 ? 'text-primary' : 'text-white'}>
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-heading font-700 uppercase text-sm text-white">Total</span>
                  <span className="font-heading font-900 text-xl text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <button type="submit" disabled={placing}
              className="btn-primary w-full py-4 text-base disabled:opacity-50">
              {placing ? 'PLACING ORDER...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
