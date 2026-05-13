'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers,
  FiPlus, FiLogOut, FiMenu, FiX, FiActivity,
  FiBell, FiExternalLink, FiFileText, FiLayers
} from 'react-icons/fi';

// সাইডবার মেনু আইটেমসমূহ
const navItems = [
  { href: '/admin/products', label: 'Product Inventory', icon: FiShoppingBag },
  { href: '/admin/products/new', label: 'Add New Product', icon: FiPlus },
  { href: '/admin/orders', label: 'Order Management', icon: FiPackage },
  { href: '/admin/users', label: 'User Analytics', icon: FiUsers },
  { href: '/admin/reports', label: 'Sales Reports', icon: FiFileText },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
  if (!isAuthenticated) {
    router.push('/auth/login');
    return;
  }
  if (user?.role !== 'admin') {
    router.push('/dashboard');
    return;
  }
}, [isAuthenticated, user, router]);

if (!isAuthenticated || !user) return (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#1a1f2e' }}>
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

if (user?.role !== 'admin') return null;

  return (
    <>
      {/* Google Sans Font Import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:opsz,wght@17..18,400..700&display=swap');
        
        :root {
          --font-google-sans: 'Google Sans', sans-serif;
        }

        body {
          font-family: var(--font-google-sans);
        }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ffaa00; }
      `}</style>

      <div className="min-h-screen bg-[#080808] flex antialiased text-slate-200" style={{ fontFamily: 'var(--font-google-sans)' }}>
        
        {/* ── SIDEBAR ── */}
        <aside className={`
          fixed top-0 left-0 h-full z-50 w-72 bg-[#111] border-r border-white/5
          flex flex-col transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:flex
        `}>
          <div className="p-8">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FiActivity size={20} className="text-black" />
              </div>
              <div>
                <p className="text-white font-bold text-xl uppercase tracking-tight">FitZone</p>
                <p className="text-primary text-[10px] uppercase font-bold tracking-widest">Control Panel</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
            <p className="px-4 text-[10px] uppercase text-white/20 font-bold mb-4 tracking-widest">Management</p>
            {navItems.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link key={href} href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-all rounded-xl border ${
                    active
                      ? 'bg-primary/10 text-primary border-primary/20 font-bold'
                      : 'text-white/40 hover:text-white hover:bg-white/5 border-transparent'
                  }`}>
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-white/5">
            <div className="bg-[#181818] rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold border border-primary/20">
                  {user?.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate font-bold">{user?.name}</p>
                  <p className="text-white/20 text-[9px] uppercase font-bold tracking-tighter">System Admin</p>
                </div>
              </div>
              <button 
                onClick={logout} 
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all rounded-lg text-[10px] font-bold uppercase"
              >
                <FiLogOut size={14} /> Logout Session
              </button>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <header className="h-20 bg-[#080808] border-b border-white/5 px-8 flex items-center justify-between z-40">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="lg:hidden text-white/50 p-2 bg-white/5 rounded-lg"
            >
              {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
            
            <div className="flex items-center gap-4 ml-auto">
              <Link 
                href="/" 
                target="_blank" 
                className="text-[10px] font-bold text-white/40 hover:text-primary transition-all border border-white/10 px-4 py-2 rounded-lg uppercase tracking-widest"
              >
                View Site <FiExternalLink size={12} className="inline ml-1" />
              </Link>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <button className="p-2 text-white/50 bg-white/5 rounded-lg relative">
                <FiBell size={20} />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full" />
              </button>
            </div>
          </header>

          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}