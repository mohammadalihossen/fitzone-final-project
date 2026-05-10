'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { FiPackage, FiHeart, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: FiUser, exact: true },
  { href: '/dashboard/orders', label: 'My Orders', icon: FiPackage },
  { href: '/dashboard/wishlist', label: 'Wishlist', icon: FiHeart },
  { href: '/dashboard/profile', label: 'Profile', icon: FiSettings },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="card p-6">
            <div className="text-center mb-6 pb-6 border-b border-border">
              <div className="w-16 h-16 bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-heading font-900 text-2xl uppercase">{user?.name?.charAt(0)}</span>
              </div>
              <p className="font-600 text-white">{user?.name}</p>
              <p className="text-muted text-xs mt-1 truncate">{user?.email}</p>
            </div>

            <nav className="space-y-1">
              {navItems.map(({ href, label, icon: Icon, exact }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);
                return (
                  <Link key={href} href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-600 transition-all ${
                      active ? 'text-primary bg-primary/10 border-l-2 border-primary' : 'text-muted hover:text-white'
                    }`}>
                    <Icon size={16} /> {label}
                  </Link>
                );
              })}
              <button onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-600 text-red-400 hover:text-red-300 transition-colors mt-4">
                <FiLogOut size={16} /> Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
