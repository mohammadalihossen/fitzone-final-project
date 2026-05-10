'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const formatPrice = (p) => `৳${p?.toLocaleString('en-BD')}`;

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const items = useCartStore(s => s.items);
  const removeItem = useCartStore(s => s.removeItem);
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const clearCart = useCartStore(s => s.clearCart);

  const subtotal = items.reduce((sum, i) => sum + (i.discountPrice || i.price) * i.quantity, 0);
  const shippingCost = subtotal >= 5000 ? 0 : 120;
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      router.push('/auth/login?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h1 className="font-heading font-900 uppercase text-5xl mb-4">YOUR CART IS EMPTY</h1>
        <p className="text-muted mb-8">Add some gear to get started!</p>
        <Link href="/products" className="btn-primary px-8 py-4 inline-flex items-center gap-2">
          <FiShoppingBag size={18} /> START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">SHOPPING CART</h1>
        <button onClick={() => { clearCart(); toast.success('Cart cleared'); }}
          className="text-muted text-sm hover:text-red-400 transition-colors font-600">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => {
            const price = item.discountPrice || item.price;
            return (
              <div key={item._id} className="card p-4 flex gap-4">
                <div className="w-24 h-24 bg-dark-3 shrink-0 overflow-hidden border border-border">
                  {item.images?.[0]?.url ? (
                    <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                  ) : <div className="w-full h-full flex items-center justify-center text-2xl">💪</div>}
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item._id}`} className="font-600 text-white text-sm hover:text-primary transition-colors line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="text-muted text-xs mt-1">{item.brand}</p>
                  <p className="text-primary font-heading font-700 text-lg mt-2">{formatPrice(price)}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => { removeItem(item._id); toast.success('Item removed'); }}
                    className="text-muted hover:text-red-400 transition-colors">
                    <FiTrash2 size={16} />
                  </button>

                  <div className="flex items-center border border-border">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-muted hover:text-white hover:bg-dark-3 transition-colors">
                      <FiMinus size={12} />
                    </button>
                    <span className="w-10 text-center text-sm font-heading font-700 text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 flex items-center justify-center text-muted hover:text-white hover:bg-dark-3 transition-colors disabled:opacity-30">
                      <FiPlus size={12} />
                    </button>
                  </div>

                  <p className="font-heading font-700 text-white">{formatPrice(price * item.quantity)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="font-heading font-700 uppercase text-sm tracking-wider text-white mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Shipping</span>
                <span className={shippingCost === 0 ? 'text-primary font-600' : 'text-white'}>
                  {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-muted text-xs">Add {formatPrice(5000 - subtotal)} more for free shipping</p>
              )}
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-heading font-700 uppercase text-sm text-white">Total</span>
                <span className="font-heading font-900 text-xl text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            <button onClick={handleCheckout}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base">
              PROCEED TO CHECKOUT <FiArrowRight size={18} />
            </button>

            <Link href="/products" className="block text-center text-muted text-sm mt-4 hover:text-primary transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
