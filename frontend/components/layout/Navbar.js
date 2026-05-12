'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiHeart, FiLogOut, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const navLinks = [
  { href: '/products', label: 'All Products' },
  { href: '/products?category=Dumbbells', label: 'Dumbbells' },
  { href: '/products?category=Barbells', label: 'Barbells' },
  { href: '/products?category=Cardio', label: 'Cardio' },
  { href: '/products?category=Accessories', label: 'Kettlebells' },
  { href: '/products?category=Bundles', label: 'Yoga' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const items = useCartStore(s => s.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push('/products?search=' + searchQuery);
      setMenuOpen(false);
    }
  };

  return (
    <>
      {/* Information Modal Overlay (Ultra Low Opacity Background) */}
      {activeModal && (
        <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-dark-2/20 border border-white/5 w-full max-w-md p-10 relative shadow-2xl rounded-[2.5rem] animate-in fade-in zoom-in duration-300">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 text-white/50 hover:text-primary transition-colors">
              <FiX size={22} />
            </button>

            {activeModal === 'about' ? (
              <div className="text-center">
                <h3 className="text-2xl font-black text-white mb-5 tracking-tight">About <span className="text-primary">FitZone</span></h3>
                <p className="text-white text-sm leading-relaxed font-medium">FitZone is Bangladesh's premium fitness destination. Since 2020, we have been providing high-quality gym equipment.</p>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-2xl font-black text-white mb-8 tracking-tight">Contact <span className="text-primary">Us</span></h3>
                <div className="space-y-5">
                  <div className="flex items-center justify-center gap-4 text-white font-medium hover:text-primary transition-colors cursor-pointer">
                    <FiPhone size={18} className="text-primary" /> <span>+880 1540-594974</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-white font-medium hover:text-primary transition-colors cursor-pointer">
                    <FiMail size={18} className="text-primary" /> <span>support@fitzone.com</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-white font-medium">
                    <FiMapPin size={18} className="text-primary" /> <span>Gazipur, Dhaka</span>
                  </div>
                </div>
              </div>
            )}
            <button onClick={() => setActiveModal(null)} className="mt-10 w-full py-3 bg-primary text-black text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white transition-all">Dismiss</button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-dark-2 border-b border-border py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-muted text-xs font-medium">Free shipping on orders over BDT 5,000</p>
          <div className="flex items-center gap-6">
            <button onClick={() => setActiveModal('about')} className="text-white text-xs hover:text-primary transition-colors">About Us</button>
            <button onClick={() => setActiveModal('contact')} className="text-white text-xs hover:text-primary transition-colors">Contact Support</button>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-dark border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black text-sm font-black">💪</div>
              <span className="font-black text-xl text-white">Fit<span className="text-primary">Zone</span></span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 hidden md:block">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input type="text" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-dark-3 border border-border text-white placeholder-muted pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
            </form>

            {/* Icons Section */}
            <div className="flex items-center gap-4 shrink-0">
              {isAuthenticated && (
                <Link href="/dashboard/wishlist" className="text-muted hover:text-primary transition-colors hidden md:block">
                  <FiHeart size={20} />
                </Link>
              )}
              <Link href="/cart" className="relative text-muted hover:text-white transition-colors">
                <FiShoppingCart size={20} />
                {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-primary text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>}
              </Link>
              
              {/* User Dropdown (Icon Based) */}
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="text-muted hover:text-white transition-colors flex items-center">
                  <FiUser size={22} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-10 w-48 bg-dark-2 border border-border shadow-2xl z-[60] rounded-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {isAuthenticated ? (
                      <>
                        <div className="p-3 border-b border-border bg-dark-3/50">
                          <p className="text-white font-bold text-sm truncate">{user?.name}</p>
                          <p className="text-muted text-[10px] truncate">{user?.email}</p>
                        </div>
                        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 text-white/80 hover:text-primary hover:bg-dark-3 text-sm transition-all" onClick={() => setUserMenuOpen(false)}>
                          <FiUser size={14} /> Dashboard
                        </Link>
                        <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 text-sm text-left transition-all">
                          <FiLogOut size={14} /> Logout
                        </button>
                      </>
                    ) : (
                      <Link href="/auth/login" className="flex items-center gap-3 px-4 py-4 text-white hover:bg-dark-3 text-sm font-bold transition-all" onClick={() => setUserMenuOpen(false)}>
                        <FiUser size={16} className="text-primary" /> Login / Register
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Icon */}
              <button className="md:hidden text-muted hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FiX size={26} className="text-primary" /> : <FiMenu size={26} />}
              </button>
            </div>
          </div>

          {/* Desktop Links (Hover Styled) */}
          <div className="hidden md:flex items-center gap-8 py-2.5 border-t border-border/50">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className={`text-sm transition-all duration-300 hover:text-primary hover:translate-x-0.5 ${pathname === link.href ? 'text-primary font-black' : 'text-muted font-medium'}`}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`md:hidden fixed inset-x-0 top-[64px] bg-dark-2/95 backdrop-blur-xl border-b border-border shadow-2xl transition-all duration-300 ${menuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'}`}>
          <div className="p-6 flex flex-col gap-6">
            <nav className="flex flex-col gap-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-3 px-1">Categories</p>
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`px-4 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${pathname === link.href ? 'bg-primary text-black' : 'text-white hover:bg-dark-3 hover:text-primary'}`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { setActiveModal('about'); setMenuOpen(false); }} className="flex items-center justify-center p-3 bg-dark-3 border border-border rounded-xl text-white font-bold text-xs uppercase tracking-widest hover:border-primary transition-all">
                About
              </button>
              <button onClick={() => { setActiveModal('contact'); setMenuOpen(false); }} className="flex items-center justify-center p-3 bg-dark-3 border border-border rounded-xl text-white font-bold text-xs uppercase tracking-widest hover:border-primary transition-all">
                Support
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
