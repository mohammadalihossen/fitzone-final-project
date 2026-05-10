'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiHeart, FiLogOut } from 'react-icons/fi';

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
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const items = useCartStore(s => s.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push('/products?search=' + searchQuery);
  };

  return (
    <>
      <div className="bg-dark-2 border-b border-border py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-muted text-xs">Free shipping on orders over BDT 5,000</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-muted text-xs hover:text-white transition-colors">About</Link>
            <Link href="#" className="text-muted text-xs hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-50 bg-dark border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 h-16">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black text-sm font-black">💪</div>
              <span className="font-black text-xl text-white">Fit<span className="text-primary">Zone</span></span>
            </Link>
            <form onSubmit={handleSearch} className="flex-1 hidden md:block">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input type="text" placeholder="Search products..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-dark-3 border border-border text-white placeholder-muted pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
            </form>
            <div className="flex items-center gap-4 shrink-0">
              {isAuthenticated && (
                <Link href="/dashboard/wishlist" className="text-muted hover:text-primary transition-colors hidden md:block">
                  <FiHeart size={20} />
                </Link>
              )}
              <Link href="/cart" className="relative text-muted hover:text-white transition-colors">
                <FiShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>
                )}
              </Link>
              {isAuthenticated ? (
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="text-muted hover:text-white transition-colors">
                    <FiUser size={20} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-10 w-48 bg-dark-2 border border-border shadow-xl z-50">
                      <div className="p-3 border-b border-border">
                        <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                        <p className="text-muted text-xs truncate">{user?.email}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2.5 text-muted hover:text-white hover:bg-dark-3 text-sm" onClick={() => setUserMenuOpen(false)}>
                        <FiUser size={14} /> Dashboard
                      </Link>
                      {user?.role === 'admin' && (
                        <Link href="/admin" className="flex items-center gap-2 px-3 py-2.5 text-primary hover:bg-dark-3 text-sm" onClick={() => setUserMenuOpen(false)}>
                          ⚡ Admin Panel
                        </Link>
                      )}
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2.5 text-red-400 hover:bg-dark-3 text-sm">
                        <FiLogOut size={14} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/login" className="text-muted hover:text-white transition-colors">
                  <FiUser size={20} />
                </Link>
              )}
              <button className="md:hidden text-muted hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 py-2.5 border-t border-border/50">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={'text-sm transition-colors ' + (pathname === link.href ? 'text-primary font-semibold' : 'text-muted hover:text-white')}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-dark-2 py-4 px-4">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-muted hover:text-primary text-sm border-b border-border/30 last:border-0">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
