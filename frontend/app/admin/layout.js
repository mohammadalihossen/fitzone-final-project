'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers,
  FiMenu, FiX, FiChevronRight, FiPlus,
  FiLogOut, FiHome, FiBell, FiSettings
} from 'react-icons/fi';

const navGroups = [
  {
    label: null,
    items: [
      { href: '/admin', label: 'Dashboard', icon: FiGrid, exact: true },
      { href: '/admin/orders', label: 'Orders', icon: FiPackage },
      { href: '/admin/products', label: 'Products', icon: FiShoppingBag },
      { href: '/admin/users', label: 'Users', icon: FiUsers },
    ]
  },
  {
    label: 'MANAGE',
    items: [
      { href: '/admin/products/new', label: 'Add Product', icon: FiPlus },
      { href: '/', label: 'View Store', icon: FiHome },
    ]
  },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [mounted, isAuthenticated, user, router]);

  // Loading state — Zustand hydrate হওয়া পর্যন্ত অপেক্ষা
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1a1f2e' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#C8FF00', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1a1f2e' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#C8FF00', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const currentPage = navGroups.flatMap(g => g.items).find(n =>
    n.exact ? pathname === n.href : (pathname.startsWith(n.href) && n.href !== '/')
  );

  return (
    <div className="min-h-screen flex" style={{ background: '#f0f2f5' }}>
      {/* SIDEBAR */}
      <aside className={`
        fixed top-0 left-0 h-full z-40 w-64 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex
      `} style={{ background: '#1a1f2e', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

        <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-black font-black text-base flex-shrink-0">💪</div>
          <div>
            <p className="text-white font-black text-lg leading-none">FitZone</p>
            <p className="text-xs mt-0.5" style={{ color: '#C8FF00', opacity: 0.7 }}>Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-gray-400 hover:text-white">
            <FiX size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navGroups.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-6' : ''}>
              {group.label && (
                <p className="text-xs font-semibold px-3 mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map(({ href, label, icon: Icon, exact }) => {
                  const active = exact ? pathname === href : (pathname.startsWith(href) && href !== '/');
                  return (
                    <Link key={href} href={href}
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                      style={{
                        background: active ? 'rgba(200,255,0,0.12)' : 'transparent',
                        color: active ? '#C8FF00' : 'rgba(255,255,255,0.6)',
                      }}>
                      <Icon size={18} className="flex-shrink-0" />
                      <span className="flex-1">{label}</span>
                      {active && <FiChevronRight size={14} />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-black text-sm uppercase">{user?.name?.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>Administrator</p>
            </div>
            <button onClick={logout} className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0">
              <FiLogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-900">
            <FiMenu size={22} />
          </button>

          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-gray-400">Admin</span>
            {currentPage && (
              <>
                <FiChevronRight size={14} className="text-gray-300" />
                <span className="text-gray-700 font-medium">{currentPage.label}</span>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100">
              <FiBell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
            <Link href="/admin" className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100">
              <FiSettings size={18} />
            </Link>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                <span className="text-primary font-black text-sm uppercase">{user?.name?.charAt(0)}</span>
              </div>
              <div className="hidden md:block">
                <p className="text-gray-800 text-sm font-semibold leading-none">{user?.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">Admin</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}