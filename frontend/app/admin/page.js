'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { productAPI } from '@/services/api';
import ProductCard from '@/components/product/ProductCard';
import { FiArrowRight, FiShield, FiTruck, FiStar, FiHeadphones } from 'react-icons/fi';

const categories = [
  { name: 'Barbells', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop', slug: 'Barbells' },
  { name: 'Benches', image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=300&fit=crop', slug: 'Benches' },
  { name: 'Cardio', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop', slug: 'Cardio' },
  { name: 'Dumbbells', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop', slug: 'Dumbbells' },
  // আরও যতগুলো চাও রাখতে পারো
];

const features = [
  { icon: FiTruck, title: 'Free Shipping', desc: 'Orders over BDT 5,000' },
  { icon: FiShield, title: '2 Year Warranty', desc: 'All products' },
  { icon: FiHeadphones, title: '24/7 Support', desc: 'Expert help' },
  { icon: FiStar, title: 'Secure Payment', desc: '100% Safe' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [f, t] = await Promise.all([
          productAPI.getAll({ featured: true, limit: 4 }),
          productAPI.getAll({ trending: true, limit: 4 }),
        ]);
        setFeatured(f.products || []);
        setTrending(t.products || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      {/* HERO SECTION - Improved Mobile */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C8FF00_1px,transparent_1px)] [background-size:40px_40px]" />
        
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full">
                <span className="text-primary text-sm font-semibold">🔥 NEW 2026 COLLECTION</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tighter">
                BUILD YOUR<br />
                <span className="text-primary">DREAM GYM</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-400 max-w-md">
                Premium fitness equipment for home & commercial gyms in Bangladesh.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="btn-primary text-center text-base py-4 px-10">
                  Shop Now
                </Link>
                <Link href="/products?featured=true" className="btn-outline text-center text-base py-4 px-10">
                  Browse Featured
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-6">
                {[['500+', 'Products'], ['10K+', 'Customers'], ['4.9', 'Rating']].map(([num, label]) => (
                  <div key={label}>
                    <p className="text-3xl font-black text-primary">{num}</p>
                    <p className="text-xs uppercase tracking-widest text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image - Mobile Friendly */}
            <div className="relative flex justify-center md:justify-end">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center text-[180px] md:text-[220px] drop-shadow-2xl">
                  🏋️
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES - Better Mobile Grid */}
      <section className="max-w-7xl mx-auto px-5 py-12 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="section-title text-3xl md:text-4xl">Shop by Category</h2>
          <p className="text-gray-400 mt-2">Find equipment for every fitness goal</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-square shadow-lg"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white font-semibold text-sm md:text-base tracking-wide">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-5 py-8 md:py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="section-title text-3xl md:text-4xl">Featured Products</h2>
            <p className="text-gray-400">Premium picks for serious lifters</p>
          </div>
          <Link href="/products?featured=true" className="hidden md:flex items-center gap-2 text-primary hover:text-white transition-colors">
            View All <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-80 bg-dark-2 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* FEATURES */}
      <section className="bg-dark-2 border-y border-border py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="space-y-3">
                <div className="w-14 h-14 mx-auto bg-dark-3 border border-border rounded-2xl flex items-center justify-center">
                  <Icon className="text-primary" size={28} />
                </div>
                <p className="font-semibold text-white">{title}</p>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING PRODUCTS */}
      {trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 py-12 md:py-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="section-title text-3xl md:text-4xl">🔥 Trending Now</h2>
              <p className="text-gray-400">Most loved by our customers</p>
            </div>
            <Link href="/products?trending=true" className="text-primary hover:text-white flex items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {trending.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <section className="py-16 bg-dark-2 border-t border-border">
        <div className="max-w-md mx-auto px-5 text-center">
          <h2 className="text-3xl font-black mb-3">Stay in the Loop</h2>
          <p className="text-gray-400 mb-8">Get exclusive offers and fitness tips</p>
          
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="input-field flex-1"
            />
            <button className="btn-primary whitespace-nowrap px-8">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}