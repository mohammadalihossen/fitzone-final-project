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
  {
    name: "Barbells",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop",
    slug: "Barbells",
  },
  {
    name: "Benches",
    image:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=300&h=200&fit=crop",
    slug: "Benches",
  },
  {
    name: "Cardio Equipment",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=200&fit=crop",
    slug: "Cardio",
  },
  {
    name: "Dumbbells",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=200&fit=crop",
    slug: "Dumbbells",
  },
  {
    name: "Kettlebells",
    image:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=300&h=200&fit=crop",
    slug: "Accessories",
  },
  {
    name: "Resistance Bands",
    image:
      "https://images.unsplash.com/photo-1620188526357-8f8b5a5e8b5a?w=300&h=200&fit=crop",
    slug: "Accessories",
  },
  {
    name: "Weight Plates",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=300&h=200&fit=crop",
    slug: "Barbells",
  },
  {
    name: "Yoga & Pilates",
    image:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=300&h=200&fit=crop",
    slug: "Accessories",
  },
];

const features = [
  {
    icon: FiTruck,
    title: "Free Shipping",
    desc: "Free delivery on orders over BDT 5,000 across Bangladesh.",
  },
  {
    icon: FiShield,
    title: "2 Year Warranty",
    desc: "All products come with manufacturer warranty for peace of mind.",
  },
  {
    icon: FiHeadphones,
    title: "24/7 Support",
    desc: "Expert customer support available round the clock.",
  },
  {
    icon: FiStar,
    title: "Secure Payment",
    desc: "Multiple payment options with 100% secure transactions.",
  },
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
    <div className="bg-dark">
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #C8FF00 0%, transparent 50%), radial-gradient(circle at 80% 50%, #C8FF00 0%, transparent 50%)`,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 border border-primary/40 bg-primary/5 px-4 py-1.5 mb-6">
                <span className="text-primary text-xs font-semibold uppercase tracking-widest">
                  🔥 New Collection 2024
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-none mb-6 text-white">
                Build Your
                <br />
                <span className="text-primary">Perfect Gym</span>
              </h1>
              <p className="text-muted text-lg leading-relaxed mb-8 max-w-md">
                Premium fitness equipment for home and commercial gyms. From
                dumbbells to full gym setups, we have everything you need to
                achieve your fitness goals.
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  href="/products"
                  className="bg-primary text-black font-bold uppercase tracking-wider px-8 py-3 hover:bg-primary-dark transition-all inline-flex items-center gap-2"
                >
                  Shop Now <FiArrowRight size={18} />
                </Link>
                <Link
                  href="/products?featured=true"
                  className="border border-border text-white font-semibold uppercase tracking-wider px-8 py-3 hover:border-primary hover:text-primary transition-all"
                >
                  View Featured
                </Link>
              </div>
              {/* Stats */}
              <div className="flex gap-10 pt-8 border-t border-border">
                {[
                  ["500+", "Products"],
                  ["10K+", "Happy Customers"],
                  ["5 Star", "Reviews"],
                ].map(([num, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-black text-primary">{num}</p>
                    <p className="text-muted text-xs uppercase tracking-wider mt-1">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-muted text-xs mt-4">
                Free shipping on orders over BDT 5,000
              </p>
            </div>

            {/* Hero Right */}
            <div className="relative hidden md:flex items-center justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                <div className="absolute inset-8 bg-primary/20 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-9xl">🏋️</span>
                </div>
              </div>
              {/* Floating cards */}
              <div className="absolute top-4 right-0 bg-dark-2 border border-border px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <FiShield className="text-primary" size={16} />
                  <div>
                    <p className="text-white text-xs font-semibold">
                      2 Year Warranty
                    </p>
                    <p className="text-muted text-xs">On all products</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-8 left-0 bg-dark-2 border border-border px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <FiTruck className="text-primary" size={16} />
                  <div>
                    <p className="text-white text-xs font-semibold">
                      Free Delivery
                    </p>
                    <p className="text-muted text-xs">Orders over BDT 5,000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-2">
            Shop by Category
          </h2>
          <p className="text-muted">
            Browse our wide selection of premium fitness equipment across all
            categories
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={"/products?category=" + cat.slug}
              className="group relative overflow-hidden aspect-square"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-white text-xs font-semibold text-center leading-tight">
                  {cat.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-1">
              Handpicked premium equipment for serious fitness enthusiasts
            </p>
            <h2 className="text-3xl font-black text-white">
              Featured Products
            </h2>
          </div>
          <Link
            href="/products?featured=true"
            className="hidden md:flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all"
          >
            View All <FiArrowRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-64 bg-dark-2 animate-pulse" />
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ── FEATURES STRIP ── */}
      <section className="border-y border-border bg-dark-2 py-10 my-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 bg-dark-3 border border-border rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon className="text-primary" size={22} />
                </div>
                <p className="text-white font-semibold text-sm mb-1">{title}</p>
                <p className="text-muted text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING ── */}
      {trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8 mb-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-1">
                🔥 HOT RIGHT NOW
              </p>
              <h2 className="text-3xl font-black text-white">
                Trending Products
              </h2>
              <p className="text-muted text-sm mt-1">
                Most popular equipment our customers are buying
              </p>
            </div>
            <Link
              href="/products?trending=true"
              className="hidden md:flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all"
            >
              View All Trending <FiArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trending.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── NEWSLETTER ── */}
      <section className="bg-dark-2 border-t border-border py-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-3">Stay Updated</h2>
          <p className="text-muted text-sm mb-8">
            Subscribe to our newsletter for exclusive deals, fitness tips, and
            new product launches.
          </p>

          {/* পরিবর্তন এখানে: মোবাইলে flex-col এবং বড় স্ক্রিনে flex-row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full flex-1 bg-dark-3 border border-border text-white placeholder-muted px-4 py-3 text-sm focus:outline-none focus:border-primary"
            />
            <button className="w-full sm:w-auto bg-primary text-black font-bold uppercase tracking-wider px-6 py-3 hover:bg-primary-dark transition-colors whitespace-nowrap flex items-center justify-center gap-2">
              Subscribe ✓
            </button>
          </div>

          <p className="text-muted text-xs mt-3">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates.
          </p>
        </div>
      </section>
    </div>
  );
}
