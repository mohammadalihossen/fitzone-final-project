'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers,
  FiPlus, FiLogOut, FiMenu, FiX, FiTrendingUp,
  FiBell, FiSettings, FiChevronRight
} from 'react-icons/fi';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: FiGrid, exact: true },
  { href: '/admin/products', label: 'Products', icon: FiShoppingBag },
  { href: '/admin/orders', label: 'Orders', icon: FiPackage },
  { href: '/admin/users', label: 'Users', icon: FiUsers },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') router.push('/');
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-40 w-64 bg-dark-2 border-r border-border
        flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-black font-black text-sm">💪</div>
            <div>
              <p className="text-white font-black text-lg leading-none">FitZone</p>
              <p className="text-primary text-xs font-semibold uppercase tracking-widest">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-muted text-xs uppercase tracking-widest font-semibold px-3 mb-3">Main Menu</p>
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 text-sm font-semibold transition-all rounded-none group ${
                  active
                    ? 'bg-primary text-black'
                    : 'text-muted hover:text-white hover:bg-dark-3'
                }`}>
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                {active && <FiChevronRight size={14} />}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-border">
            <p className="text-muted text-xs uppercase tracking-widest font-semibold px-3 mb-3">Quick Actions</p>
            <Link href="/admin/products/new"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-3 text-sm font-semibold text-muted hover:text-white hover:bg-dark-3 transition-all group">
              <FiPlus size={18} />
              <span>Add New Product</span>
            </Link>
          </div>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center">
              <span className="text-primary font-black text-sm uppercase">{user?.name?.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-muted text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-semibold">
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-dark-2 border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-muted hover:text-white transition-colors">
              {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
            <div className="hidden md:block">
              <p className="text-muted text-xs uppercase tracking-wider">
                {navItems.find(n => n.exact ? pathname === n.href : pathname.startsWith(n.href))?.label || 'Admin'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank"
              className="text-xs font-semibold text-muted hover:text-primary transition-colors border border-border px-3 py-1.5 hover:border-primary">
              View Store →
            </Link>
            <div className="w-8 h-8 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center">
              <span className="text-primary font-black text-xs uppercase">{user?.name?.charAt(0)}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
