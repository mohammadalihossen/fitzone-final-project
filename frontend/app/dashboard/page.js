'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import { orderAPI, userAPI } from '@/services/api';
import { FiPackage, FiHeart, FiClock, FiCheckCircle } from 'react-icons/fi';

const formatPrice = (p) => `৳${p?.toLocaleString('en-BD')}`;

const STATUS_COLORS = {
  pending: 'badge-yellow', confirmed: 'badge-green', processing: 'badge-green',
  shipped: 'badge-green', delivered: 'badge-green', cancelled: 'badge-red'
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, wishData] = await Promise.all([
          orderAPI.getUserOrders({ limit: 5 }),
          userAPI.getWishlist()
        ]);
        setOrders(ordersData.orders || []);
        setWishlist(wishData.wishlist || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const stats = [
    { icon: FiPackage, label: 'Total Orders', value: orders.length },
    { icon: FiHeart, label: 'Wishlist Items', value: wishlist.length },
    { icon: FiCheckCircle, label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length },
    { icon: FiClock, label: 'Pending', value: orders.filter(o => o.status === 'pending').length },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-900 uppercase text-3xl text-white mb-1">
          WELCOME BACK, <span className="text-primary">{user?.name?.split(' ')[0].toUpperCase()}</span>
        </h1>
        <p className="text-muted text-sm">Here's what's happening with your account</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-5">
            <Icon className="text-primary mb-3" size={20} />
            <p className="font-heading font-900 text-2xl text-white">{value}</p>
            <p className="text-muted text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-700 uppercase text-sm tracking-wider text-white">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-primary text-xs font-600 hover:text-primary-dark">View All</Link>
        </div>

        {loading ? (
          <div className="space-y-3">{Array(3).fill(0).map((_, i) => <div key={i} className="h-14 shimmer" />)}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted text-sm mb-3">No orders yet</p>
            <Link href="/products" className="btn-primary text-xs px-4 py-2">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <Link key={order._id} href={`/dashboard/orders/${order._id}`}
                className="flex items-center justify-between p-4 bg-dark-3 hover:bg-dark-4 transition-colors">
                <div>
                  <p className="font-heading font-700 text-sm text-primary">{order.orderNumber}</p>
                  <p className="text-muted text-xs">{order.items.length} item(s) • {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading font-700 text-white">{formatPrice(order.totalPrice)}</p>
                  <span className={`${STATUS_COLORS[order.status]} text-xs`}>{order.status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
