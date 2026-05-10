'use client';
import { useState } from 'react';
import useAuthStore from '@/store/authStore';
import { authAPI } from '@/services/api';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    zip: user?.address?.zip || '',
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNew: '' });
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await authAPI.updateProfile({
        name: form.name,
        phone: form.phone,
        address: { street: form.street, city: form.city, zip: form.zip }
      });
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNew) { toast.error('Passwords do not match'); return; }
    setChangingPass(true);
    try {
      await authAPI.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirmNew: '' });
    } catch (err) { toast.error(err.message); }
    finally { setChangingPass(false); }
  };

  return (
    <div className="space-y-8">
      <h1 className="font-heading font-900 uppercase text-3xl text-white">PROFILE SETTINGS</h1>

      {/* Profile Form */}
      <div className="card p-6">
        <h2 className="font-heading font-700 uppercase text-sm tracking-wider text-white mb-6">Personal Information</h2>
        <form onSubmit={handleProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-muted text-xs uppercase tracking-wider block mb-2">Full Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="text-muted text-xs uppercase tracking-wider block mb-2">Phone</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" placeholder="01712345678" />
            </div>
            <div>
              <label className="text-muted text-xs uppercase tracking-wider block mb-2">Email</label>
              <input value={user?.email} disabled className="input-field opacity-50 cursor-not-allowed" />
            </div>
            <div>
              <label className="text-muted text-xs uppercase tracking-wider block mb-2">City</label>
              <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="input-field" placeholder="Dhaka" />
            </div>
            <div className="md:col-span-2">
              <label className="text-muted text-xs uppercase tracking-wider block mb-2">Street Address</label>
              <input value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} className="input-field" placeholder="House/Road/Area" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary px-8 py-3">
            {saving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card p-6">
        <h2 className="font-heading font-700 uppercase text-sm tracking-wider text-white mb-6">Change Password</h2>
        <form onSubmit={handlePassword} className="space-y-4 max-w-md">
          {['currentPassword', 'newPassword', 'confirmNew'].map((key, i) => (
            <div key={key}>
              <label className="text-muted text-xs uppercase tracking-wider block mb-2">
                {['Current Password', 'New Password', 'Confirm New Password'][i]}
              </label>
              <input type="password" value={passwords[key]} onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))} className="input-field" required />
            </div>
          ))}
          <button type="submit" disabled={changingPass} className="btn-outline px-8 py-3">
            {changingPass ? 'CHANGING...' : 'CHANGE PASSWORD'}
          </button>
        </form>
      </div>
    </div>
  );
}
