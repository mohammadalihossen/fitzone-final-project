'use client';
import { useEffect, useState, useCallback } from 'react';
import { adminAPI } from '@/services/api';
import { toast } from 'react-hot-toast';
import { FiSearch, FiUser, FiShield, FiUsers } from 'react-icons/fi';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [togglingId, setTogglingId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getUsers({ page, limit: 20, search });
      setUsers(data.users || []);
      setPagination(data.pagination || {});
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggle = async (userId) => {
    setTogglingId(userId);
    try {
      const data = await adminAPI.toggleUser(userId);
      toast.success(data.message);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: !u.isActive } : u));
    } catch (err) { toast.error(err.message); }
    finally { setTogglingId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase">Users</h1>
          <p className="text-muted text-sm mt-1">{pagination.total || 0} registered users</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
        <input type="text" placeholder="Search by name or email..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="input-field pl-10 py-2.5" />
      </div>

      <div className="bg-dark-2 border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-3 border-b border-border">
                {['User', 'Email', 'Role', 'Joined', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-muted text-xs uppercase tracking-widest font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array(6).fill(0).map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-dark-3 animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16">
                  <FiUsers className="mx-auto text-muted mb-3" size={40} />
                  <p className="text-muted">No users found</p>
                </td></tr>
              ) : users.map(user => (
                <tr key={user._id} className="border-b border-border hover:bg-dark-3/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-primary font-black text-sm uppercase">{user.name?.charAt(0)}</span>
                      </div>
                      <span className="text-white font-semibold text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className="text-muted text-sm">{user.email}</span></td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase ${user.role === 'admin' ? 'text-primary' : 'text-muted'}`}>
                      {user.role === 'admin' ? <FiShield size={12} /> : <FiUser size={12} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-muted text-sm">
                      {new Date(user.createdAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold uppercase px-2 py-1 border ${
                      user.isActive
                        ? 'bg-primary/10 text-primary border-primary/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}>
                      {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {user.role !== 'admin' ? (
                      <button onClick={() => handleToggle(user._id)} disabled={togglingId === user._id}
                        className={`text-xs font-bold uppercase px-3 py-1.5 border transition-all disabled:opacity-50 ${
                          user.isActive
                            ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                            : 'border-primary/30 text-primary hover:bg-primary/10'
                        }`}>
                        {togglingId === user._id ? '...' : user.isActive ? 'Suspend' : 'Activate'}
                      </button>
                    ) : (
                      <span className="text-muted text-xs italic">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 p-5 border-t border-border">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 font-bold text-sm border transition-all ${
                  page === p ? 'bg-primary text-black border-primary' : 'border-border text-muted hover:border-primary hover:text-primary'
                }`}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
