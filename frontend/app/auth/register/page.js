'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck, FiX } from 'react-icons/fi';

const passwordRules = [
  { label: 'At least 6 characters', test: (p) => p.length >= 6 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p) => /[0-9]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState('');

  const passScore = passwordRules.filter(r => r.test(form.password)).length;
  const strengthConfig = [
    { label: '', color: 'transparent' },
    { label: 'Weak', color: '#ef4444' },
    { label: 'Fair', color: '#f97316' },
    { label: 'Strong', color: '#C8FF00' },
  ][passScore] || { label: '', color: 'transparent' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match!'); return; }
    if (form.password.length < 6) { toast.error('Password too short'); return; }
    const result = await register({ name: form.name, email: form.email, password: form.password });
    if (result.success) {
      toast.success('Account created! Welcome 💪');
      router.push('/');
    } else {
      toast.error(result.error);
    }
  };

  const inputStyle = (key) => ({
    background: 'rgba(255,255,255,0.07)',
    border: focused === key ? '1px solid #C8FF00' : '1px solid rgba(255,255,255,0.1)',
    boxShadow: focused === key ? '0 0 0 3px rgba(200,255,0,0.08)' : 'none',
    transition: 'all 0.2s',
    borderRadius: '12px',
  });

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-10">

      {/* ── Blurred Background Image ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&auto=format&fit=crop&q=80"
          alt="bg"
          className="w-full h-full object-cover"
          style={{ filter: 'blur(6px)', transform: 'scale(1.05)' }}
        />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      {/* ── Glass Card ── */}
      <div className="relative z-10 w-full max-w-md">
        <div className="p-8 md:p-10"
          style={{
            background: 'rgba(10,10,10,0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,255,0,0.05)',
          }}>

          {/* Top green line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #C8FF00, transparent)' }} />

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black font-black text-lg">💪</div>
              <span className="font-black text-2xl text-white">Fit<span className="text-primary">Zone</span></span>
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
            <p className="text-muted text-sm">Join FitZone and start your fitness journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="text-white/70 text-sm font-medium block mb-2">Full Name</label>
              <div className="flex items-center gap-3 px-4 py-3.5" style={inputStyle('name')}>
                <FiUser className={`shrink-0 transition-colors ${focused === 'name' ? 'text-primary' : 'text-muted'}`} size={18} />
                <input type="text" required value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                  placeholder="John Doe"
                  className="flex-1 bg-transparent text-white placeholder-muted text-sm focus:outline-none" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-white/70 text-sm font-medium block mb-2">Email Address</label>
              <div className="flex items-center gap-3 px-4 py-3.5" style={inputStyle('email')}>
                <FiMail className={`shrink-0 transition-colors ${focused === 'email' ? 'text-primary' : 'text-muted'}`} size={18} />
                <input type="email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent text-white placeholder-muted text-sm focus:outline-none" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-white/70 text-sm font-medium block mb-2">Password</label>
              <div className="flex items-center gap-3 px-4 py-3.5" style={inputStyle('password')}>
                <FiLock className={`shrink-0 transition-colors ${focused === 'password' ? 'text-primary' : 'text-muted'}`} size={18} />
                <input type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                  placeholder="Min. 6 characters"
                  className="flex-1 bg-transparent text-white placeholder-muted text-sm focus:outline-none" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="text-muted hover:text-white transition-colors shrink-0">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>

              {/* Strength bar */}
              {form.password && (
                <div className="mt-2.5">
                  <div className="flex gap-1.5 mb-1">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: i <= passScore ? strengthConfig.color : 'rgba(255,255,255,0.08)' }} />
                    ))}
                  </div>
                  {strengthConfig.label && (
                    <p className="text-xs font-medium" style={{ color: strengthConfig.color }}>
                      {strengthConfig.label} password
                    </p>
                  )}
                </div>
              )}

              {/* Rules popup */}
              {focused === 'password' && form.password && (
                <div className="mt-2 p-3 rounded-xl space-y-1.5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {passwordRules.map((rule, i) => {
                    const ok = rule.test(form.password);
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${ok ? 'bg-primary/20' : 'bg-white/5'}`}>
                          {ok ? <FiCheck className="text-primary" size={10} /> : <FiX className="text-muted" size={10} />}
                        </div>
                        <p className={`text-xs transition-colors ${ok ? 'text-primary' : 'text-muted'}`}>{rule.label}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-white/70 text-sm font-medium block mb-2">Confirm Password</label>
              <div className="flex items-center gap-3 px-4 py-3.5" style={inputStyle('confirm')}>
                <FiLock className={`shrink-0 transition-colors ${focused === 'confirm' ? 'text-primary' : 'text-muted'}`} size={18} />
                <input type={showConfirm ? 'text' : 'password'} required value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  onFocus={() => setFocused('confirm')} onBlur={() => setFocused('')}
                  placeholder="Repeat your password"
                  className="flex-1 bg-transparent text-white placeholder-muted text-sm focus:outline-none" />
                {form.confirmPassword && (
                  form.password === form.confirmPassword
                    ? <FiCheck className="text-primary shrink-0" size={16} />
                    : <FiX className="text-red-400 shrink-0" size={16} />
                )}
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="text-muted hover:text-white transition-colors shrink-0">
                  {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading}
              className="w-full py-4 font-bold text-black text-base transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              style={{
                background: 'linear-gradient(135deg, #C8FF00 0%, #A8D900 100%)',
                borderRadius: '12px',
              }}>
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>Create Account <FiArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center text-muted text-sm mt-7">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}