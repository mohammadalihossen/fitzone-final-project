'use client';
import { useState, useRef } from 'react';
import useAuthStore from '@/store/authStore';
import { authAPI } from '@/services/api';
import { toast } from 'react-hot-toast';
import { FiCamera, FiUser } from 'react-icons/fi'; // আইকন ইমপোর্ট

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef(null); // ইমেজ আপলোডের জন্য রেফারেন্স

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    zip: user?.address?.zip || '',
    avatar: user?.avatar || '', // প্রোফাইল পিকচারের জন্য
  });

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNew: '' });
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  // প্রোফাইল পিকচার হ্যান্ডলার (আপাতত শুধু প্রিভিউ দেখাবে, পরে ব্যাকএন্ডে পাঠাতে পারবেন)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await authAPI.updateProfile({
        name: form.name,
        phone: form.phone,
        address: { street: form.street, city: form.city, zip: form.zip },
        avatar: form.avatar // ইমেজ ডাটা পাঠানো
      });
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNew) {
      toast.error('Passwords do not match');
      return;
    }
    setChangingPass(true);
    try {
      await authAPI.changePassword({ 
        currentPassword: passwords.currentPassword, 
        newPassword: passwords.newPassword 
      });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirmNew: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-10 px-4">
      {/* ফুটারে ব্যবহৃত ফন্ট স্টাইলের সাথে মিল রেখে হেডিং */}
      <h1 className="font-black italic uppercase text-4xl text-white tracking-tighter">
        Profile <span className="text-primary">Settings</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Profile Picture Section */}
        <div className="lg:col-span-1">
          <div className="bg-dark-2 border border-border p-8 flex flex-col items-center text-center rounded-sm">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <div className="w-32 h-32 rounded-full border-4 border-primary/20 overflow-hidden bg-dark-3 flex items-center justify-center">
                {form.avatar ? (
                  <img src={form.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="text-muted text-5xl" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <FiCamera className="text-primary text-2xl" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
            <h3 className="text-white font-bold mt-4 text-lg uppercase tracking-tight">{user?.name}</h3>
            <p className="text-muted text-xs uppercase tracking-widest">{user?.role || 'Fitness Member'}</p>
          </div>
        </div>

        {/* Right Side: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Form */}
          <div className="bg-dark-2 border border-border p-6 rounded-sm">
            <h2 className="font-bold uppercase text-xs tracking-[0.2em] text-primary mb-8 border-b border-border pb-4">
              Personal Information
            </h2>
            <form onSubmit={handleProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-muted text-[10px] uppercase font-bold tracking-widest block">Full Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-dark-3 border border-border text-white px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-muted text-[10px] uppercase font-bold tracking-widest block">Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full bg-dark-3 border border-border text-white px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all" placeholder="017XXXXXXXX" />
                </div>
                <div className="space-y-2">
                  <label className="text-muted text-[10px] uppercase font-bold tracking-widest block">Email Address</label>
                  <input value={user?.email} disabled className="w-full bg-dark-3 border border-border text-white/40 px-4 py-3 text-sm cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="text-muted text-[10px] uppercase font-bold tracking-widest block">City</label>
                  <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="w-full bg-dark-3 border border-border text-white px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-muted text-[10px] uppercase font-bold tracking-widest block">Street Address</label>
                  <input value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} className="w-full bg-dark-3 border border-border text-white px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all" />
                </div>
              </div>
              <button type="submit" disabled={saving} className="bg-primary text-black font-black uppercase tracking-wider px-10 py-3 hover:bg-white transition-all text-xs">
                {saving ? 'UPDATING...' : 'SAVE CHANGES'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-dark-2 border border-border p-6 rounded-sm">
            <h2 className="font-bold uppercase text-xs tracking-[0.2em] text-primary mb-8 border-b border-border pb-4">
              Security Settings
            </h2>
            <form onSubmit={handlePassword} className="space-y-6 max-w-md">
              {['currentPassword', 'newPassword', 'confirmNew'].map((key, i) => (
                <div key={key} className="space-y-2">
                  <label className="text-muted text-[10px] uppercase font-bold tracking-widest block">
                    {['Current Password', 'New Password', 'Confirm New Password'][i]}
                  </label>
                  <input type="password" value={passwords[key]} onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))} className="w-full bg-dark-3 border border-border text-white px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all" required />
                </div>
              ))}
              <button type="submit" disabled={changingPass} className="border border-primary text-primary hover:bg-primary hover:text-black font-black uppercase tracking-wider px-10 py-3 transition-all text-xs">
                {changingPass ? 'CHANGING...' : 'UPDATE PASSWORD'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}