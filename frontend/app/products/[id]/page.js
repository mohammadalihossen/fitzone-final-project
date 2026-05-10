'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { productAPI, userAPI } from '@/services/api';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { toast } from 'react-hot-toast';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiStar, FiArrowLeft, FiPackage, FiShield } from 'react-icons/fi';

const formatPrice = (p) => `৳${p?.toLocaleString('en-BD')}`;

function Skeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-16 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="h-[500px] shimmer" />
        <div className="space-y-4">
          <div className="h-4 shimmer w-1/4" />
          <div className="h-10 shimmer w-3/4" />
          <div className="h-8 shimmer w-1/3" />
          <div className="h-32 shimmer" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const addItem = useCartStore(s => s.addItem);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await productAPI.getOne(id);
        setProduct(data.product);
      } catch { toast.error('Product not found'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return <Skeleton />;
  if (!product) return (
    <div className="pt-24 text-center py-20">
      <p className="font-heading text-4xl text-muted">PRODUCT NOT FOUND</p>
      <Link href="/products" className="btn-primary mt-6 inline-block">Back to Shop</Link>
    </div>
  );

  const price = product.discountPrice || product.price;
  const discount = product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success('Added to cart!');
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login'); return; }
    try {
      await userAPI.toggleWishlist(product._id);
      toast.success('Wishlist updated!');
    } catch { toast.error('Error updating wishlist'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to review'); return; }
    setSubmittingReview(true);
    try {
      await productAPI.addReview(product._id, { rating: reviewRating, comment: reviewText });
      toast.success('Review submitted!');
      setReviewText('');
      const updated = await productAPI.getOne(id);
      setProduct(updated.product);
    } catch (err) { toast.error(err.message); }
    finally { setSubmittingReview(false); }
  };

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 py-10">
      <Link href="/products" className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8 font-heading font-600 uppercase text-sm tracking-wider">
        <FiArrowLeft size={16} /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div>
          <div className="relative h-[480px] bg-dark-2 border border-border overflow-hidden mb-4">
            {product.images?.[selectedImage]?.url ? (
              <img src={product.images[selectedImage].url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">💪</div>
            )}
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-primary text-black font-heading font-700 px-3 py-1 text-sm uppercase">-{discount}%</span>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 border-2 overflow-hidden transition-all ${i === selectedImage ? 'border-primary' : 'border-border hover:border-primary/50'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-primary font-heading font-600 uppercase text-sm tracking-wider">{product.brand}</span>
            <span className="text-border">|</span>
            <span className="text-muted text-sm">{product.category}</span>
          </div>

          <h1 className="font-heading font-800 uppercase text-3xl md:text-4xl leading-tight mb-4 text-white">{product.name}</h1>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <FiStar key={s} size={14} className={s <= Math.round(product.rating) ? 'text-primary fill-primary' : 'text-muted'} />
                ))}
              </div>
              <span className="text-muted text-sm">({product.numReviews} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-heading font-900 text-4xl text-primary">{formatPrice(price)}</span>
            {product.discountPrice && (
              <span className="text-muted text-xl line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.stock === 0 ? (
              <span className="badge-red">Out of Stock</span>
            ) : product.stock <= 10 ? (
              <span className="badge-yellow">Only {product.stock} left in stock!</span>
            ) : (
              <span className="badge-green">In Stock ({product.stock} available)</span>
            )}
          </div>

          <p className="text-muted leading-relaxed mb-8">{product.description}</p>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {product.weight?.value > 0 && (
              <div className="bg-dark-3 border border-border p-3">
                <p className="text-muted text-xs uppercase tracking-wider mb-1">Weight</p>
                <p className="text-white font-600">{product.weight.value} {product.weight.unit}</p>
              </div>
            )}
            {product.material && (
              <div className="bg-dark-3 border border-border p-3">
                <p className="text-muted text-xs uppercase tracking-wider mb-1">Material</p>
                <p className="text-white font-600">{product.material}</p>
              </div>
            )}
          </div>

          {/* Quantity + Cart */}
          {product.stock > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-12 h-12 flex items-center justify-center text-muted hover:text-white hover:bg-dark-3 transition-colors">
                    <FiMinus size={16} />
                  </button>
                  <span className="w-16 text-center font-heading font-700 text-lg text-white">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="w-12 h-12 flex items-center justify-center text-muted hover:text-white hover:bg-dark-3 transition-colors">
                    <FiPlus size={16} />
                  </button>
                </div>
                <span className="text-muted text-sm">Max: {product.stock}</span>
              </div>

              <div className="flex gap-3">
                <button onClick={handleAddToCart}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-4">
                  <FiShoppingCart size={18} /> ADD TO CART
                </button>
                <button onClick={handleWishlist}
                  className="w-14 h-14 border border-border flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-all">
                  <FiHeart size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Trust badges */}
          <div className="flex gap-6 mt-8 pt-8 border-t border-border">
            <div className="flex items-center gap-2 text-muted text-xs">
              <FiShield className="text-primary" size={16} />
              <span>Genuine Product Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-muted text-xs">
              <FiPackage className="text-primary" size={16} />
              <span>Free shipping over ৳5,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t border-border pt-12">
        <h2 className="section-title text-3xl mb-8">CUSTOMER REVIEWS</h2>

        {/* Add review */}
        {isAuthenticated && (
          <div className="card p-6 mb-8">
            <h3 className="font-heading font-700 uppercase text-sm tracking-wider mb-4">Write a Review</h3>
            <form onSubmit={handleReview} className="space-y-4">
              <div className="flex gap-2">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setReviewRating(s)}>
                    <FiStar size={24} className={s <= reviewRating ? 'text-primary fill-primary' : 'text-border'} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                className="input-field resize-none"
                required
              />
              <button type="submit" disabled={submittingReview} className="btn-primary px-6 py-2 text-sm">
                {submittingReview ? 'Submitting...' : 'SUBMIT REVIEW'}
              </button>
            </form>
          </div>
        )}

        {product.reviews?.length === 0 ? (
          <p className="text-muted">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {product.reviews?.map((r, i) => (
              <div key={i} className="card p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-heading font-700 text-sm">
                      {r.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-600 text-white text-sm">{r.name}</span>
                  </div>
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <FiStar key={s} size={12} className={s <= r.rating ? 'text-primary fill-primary' : 'text-border'} />
                    ))}
                  </div>
                </div>
                <p className="text-muted text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
