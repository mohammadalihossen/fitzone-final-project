"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { productAPI } from "@/services/api";
import ProductCard from "@/components/product/ProductCard";
import {
  FiArrowRight,
  FiShield,
  FiTruck,
  FiStar,
  FiHeadphones,
} from "react-icons/fi";

const categories = [
  { name: "Barbells", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop", slug: "Barbells" },
  { name: "Benches", image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=300&h=200&fit=crop", slug: "Benches" },
  { name: "Cardio", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=200&fit=crop", slug: "Cardio" },
  { name: "Dumbbells", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=200&fit=crop", slug: "Dumbbells" },
  { name: "Kettlebells", image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=300&h=200&fit=crop", slug: "Accessories" },
  { name: "Bands", image: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop", slug: "Accessories" },
  { name: "Plates", image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=300&h=200&fit=crop", slug: "Barbells" },
  { name: "Yoga", image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=300&h=200&fit=crop", slug: "Accessories" },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [f] = await Promise.all([productAPI.getAll({ featured: true, limit: 4 })]);
        setFeatured(f.products || []);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-dark min-h-screen overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative pt-6 pb-16 md:py-32">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left order-2 md:order-1">
              <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-1 mb-6 rounded-full">
                <span className="text-primary text-[10px] font-bold uppercase tracking-widest animate-pulse">
                   New Arrival 2026
                </span>
              </div>
              <h1 className="text-3xl md:text-7xl font-black leading-tight mb-5 text-white">
                Build Your<br />
                <span className="text-primary">Perfect Gym</span>
              </h1>
              <p className="text-white/50 text-xs md:text-lg mb-8 max-w-sm mx-auto md:mx-0">
                Premium fitness equipment for home and commercial gyms. Achieve your goals with FitZone.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 mb-8 justify-center md:justify-start">
                <Link href="/products" className="bg-primary text-black font-black uppercase tracking-tighter px-6 py-3 hover:scale-105 transition-all flex items-center justify-center gap-2 text-xs rounded-lg">
                  Shop Now <FiArrowRight size={14} />
                </Link>
                <Link href="/products?featured=true" className="border border-white/10 text-white font-bold uppercase tracking-tighter px-6 py-3 hover:bg-white/5 transition-all text-xs rounded-lg flex items-center justify-center">
                  View Featured
                </Link>
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-6 pt-6 border-t border-white/5">
                {[["500+", "Products"], ["10K+", "Users"]].map(([num, label]) => (
                  <div key={label}>
                    <p className="text-lg md:text-2xl font-black text-primary leading-none">{num}</p>
                    <p className="text-white/40 text-[8px] uppercase tracking-widest mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side with Animations */}
            <div className="flex-1 order-1 md:order-2 w-full flex justify-center relative">
               {/* Animated Text 1 */}
               <div className="absolute top-0 left-10 md:left-20 animate-bounce transition-all duration-1000 hidden sm:block">
                  <span className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">PRO GEAR</span>
               </div>
               {/* Animated Text 2 */}
               <div className="absolute bottom-10 right-5 animate-pulse hidden sm:block">
                  <span className="bg-white/5 border border-white/10 text-white/60 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Limited Edition</span>
               </div>

              <div className="relative">
                <div className="w-56 h-56 md:w-80 md:h-80 bg-primary/10 rounded-full blur-[70px] absolute inset-0" />
                <div className="relative z-10 text-[100px] md:text-[180px] select-none animate-float">
                  🏋️
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl md:text-3xl font-black text-white uppercase mb-8 text-center md:text-left">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link key={cat.name} href={"/products?category=" + cat.slug} className="group relative overflow-hidden aspect-square rounded-xl bg-dark-2">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-all group-hover:scale-105 duration-500" />
              <p className="absolute bottom-2 inset-x-0 text-[9px] font-bold text-white text-center uppercase">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-3xl font-black text-white uppercase">Featured Gear</h2>
          <Link href="/products?featured=true" className="text-primary text-[10px] font-bold uppercase border-b border-primary/20">View All</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-dark-2 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── NEWSLETTER (Reduced Padding) ── */}
      <section className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="bg-dark-2/50 border border-white/5 rounded-[2rem] p-6 md:p-12 text-center relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 blur-[50px]" />
          <h2 className="text-2xl md:text-4xl font-black text-white mb-2 uppercase">Get 10% Discount</h2>
          <p className="text-white/40 text-[10px] md:text-sm max-w-xs mx-auto mb-6">Join our newsletter for exclusive offers and fitness updates.</p>
          
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={(e)=>e.preventDefault()}>
            <input type="email" placeholder="Email address" className="flex-1 bg-dark-3 border border-white/5 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-primary" />
            <button className="bg-white text-black font-black uppercase tracking-tighter px-6 py-3 rounded-xl hover:bg-primary transition-all text-[10px]">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
