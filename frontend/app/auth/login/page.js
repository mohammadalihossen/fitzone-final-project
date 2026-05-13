'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login, isLoading } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result.success) {
      toast.success('Welcome back! 💪');
      if (result.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      toast.error(result.error);
    }
  };

  const inputStyle = (key) => ({
    background: 'rgba(255,255,255,0.07)',
    border: focused === key ? '1px solid #C8FF00' : '1px solid rgba(255,255,255,0.08)',
    boxShadow: focused === key ? '0 0 0 3px rgba(200,255,0,0.08)' : 'none',
    transition: 'all 0.2s',
    borderRadius: '12px',
  });

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&auto=format&fit=crop&q=80"
          alt="bg"
          className="w-full h-full object-cover"
          style={{ filter: 'blur(6px)', transform: 'scale(1.05)' }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="p-8 md:p-10"
          style={{
            background: 'rgba(10,10,10,0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
          }}>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #C8FF00, transparent)' }} />

          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black font-black text-lg">💪</div>
              <span className="font-black text-2xl text-white">Fit<span className="text-primary">Zone</span></span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Welcome Back!</h1>
            <p className="text-muted text-sm">Sign in to continue your fitness journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/70 text-sm font-medium block mb-2">Email Address</label>
              <div className="flex items-center gap-3 px-4 py-3.5" style={inputStyle('email')}>
                <FiMail className={`shrink-0 transition-colors ${focused === 'email' ? 'text-primary' : 'text-muted'}`} size={18} />
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent text-white placeholder-muted text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white/70 text-sm font-medium">Password</label>
                <button type="button" className="text-primary text-xs hover:underline">
                  Forgot Password?
                </button>
              </div>
              <div className="flex items-center gap-3 px-4 py-3.5" style={inputStyle('password')}>
                <FiLock className={`shrink-0 transition-colors ${focused === 'password' ? 'text-primary' : 'text-muted'}`} size={18} />
                <input
                  type={showPass ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-white placeholder-muted text-sm focus:outline-none"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="text-muted hover:text-white transition-colors shrink-0">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full py-4 font-bold text-black text-base transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              style={{
                background: 'linear-gradient(135deg, #C8FF00 0%, #A8D900 100%)',
                borderRadius: '12px',
              }}>
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>Sign In <FiArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center text-muted text-sm mt-7">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-primary font-semibold hover:underline">
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}