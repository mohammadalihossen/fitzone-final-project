'use client';
import Link from 'next/link';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { userAPI } from '@/services/api';

const formatPrice = (price) => `BDT ${Number(price).toLocaleString('en-BD')}`;

export default function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem);
  const { isAuthenticated } = useAuthStore();

  const price = product.discountPrice || product.price;
  const discount = product.discountPrice
    ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addItem(product, 1);
    toast.success('Added to cart!');
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login'); return; }
    try {
      await userAPI.toggleWishlist(product._id);
      toast.success('Wishlist updated!');
    } catch { toast.error('Failed'); }
  };

  return (
    <Link href={'/products/' + product._id} className="group block bg-dark-2 border border-border hover:border-primary/30 transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-dark-3">
        {product.images?.[0]?.url ? (
          <img src={product.images[0].url} alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">💪</div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isFeatured && <span className="bg-primary text-black text-xs font-bold px-2 py-0.5 uppercase">Featured</span>}
          {product.isTrending && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 uppercase">Trending</span>}
          {product.stock === 0 && <span className="bg-dark-5 text-muted text-xs font-bold px-2 py-0.5 uppercase">Out of Stock</span>}
          {discount > 0 && <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5">-{discount}%</span>}
        </div>

        {/* Wishlist */}
        <button onClick={handleWishlist}
          className="absolute top-2 right-2 w-8 h-8 bg-dark/80 flex items-center justify-center text-muted hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
          <FiHeart size={14} />
        </button>

        {/* Add to cart overlay */}
        {product.stock > 0 && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button onClick={handleAddToCart}
              className="w-full bg-primary text-black font-bold uppercase text-xs py-3 flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors">
              <FiShoppingCart size={14} /> Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-muted text-xs uppercase tracking-wider mb-1">{product.brand}</p>
        <h3 className="text-white text-sm font-semibold leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.numReviews > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map(s => (
              <FiStar key={s} size={10} className={s <= Math.round(product.rating) ? 'text-primary fill-primary' : 'text-border'} />
            ))}
            <span className="text-muted text-xs ml-1">({product.numReviews})</span>
          </div>
        )}

        {/* Stock warning */}
        {product.stock > 0 && product.stock <= 10 && (
          <p className="text-red-400 text-xs mb-2 font-semibold">Hot stuff! Only {product.stock} left</p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-primary font-black text-lg">
            {formatPrice(price)}
          </span>
          {product.discountPrice && (
            <span className="text-muted text-xs line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
