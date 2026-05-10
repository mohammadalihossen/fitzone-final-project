'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { userAPI } from '@/services/api';
import ProductCard from '@/components/product/ProductCard';
import { FiHeart } from 'react-icons/fi';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getWishlist().then(d => { setWishlist(d.wishlist || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array(6).fill(0).map((_, i) => <div key={i} className="h-64 shimmer" />)}
    </div>
  );

  return (
    <div>
      <h1 className="font-heading font-900 uppercase text-3xl text-white mb-8">MY WISHLIST</h1>
      {wishlist.length === 0 ? (
        <div className="card p-16 text-center">
          <FiHeart className="text-muted mx-auto mb-4" size={48} />
          <p className="text-muted mb-4">Your wishlist is empty.</p>
          <Link href="/products" className="btn-primary px-6 py-3">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlist.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
