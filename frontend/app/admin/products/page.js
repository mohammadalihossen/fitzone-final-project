'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { productAPI } from '@/services/api';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiAlertTriangle, FiPackage } from 'react-icons/fi';

const formatPrice = (p) => `৳${Number(p || 0).toLocaleString('en-BD')}`;
const CATEGORIES = ['', 'Dumbbells', 'Barbells', 'Machines', 'Cardio', 'Accessories', 'Benches', 'Racks', 'Cables', 'Bundles'];

function DeleteModal({ product, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
      <div className="bg-dark-2 border border-border p-8 max-w-sm w-full">
        <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-5">
          <FiAlertTriangle className="text-red-400" size={28} />
        </div>
        <h3 className="font-black uppercase text-xl text-white mb-2">Delete Product?</h3>
        <p className="text-muted text-sm mb-6 leading-relaxed">
          Are you sure you want to delete <span className="text-white font-semibold">"{product?.name}"</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onConfirm}
            className="flex-1 bg-red-500 text-white font-bold uppercase py-3 text-sm hover:bg-red-600 transition-colors">
            Delete
          </button>
          <button onClick={onCancel}
            className="flex-1 border border-border text-muted font-bold uppercase py-3 text-sm hover:border-white hover:text-white transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (category) params.category = category;
      const data = await productAPI.getAll(params);
      setProducts(data.products || []);
      setPagination(data.pagination || {});
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, [page, search, category]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async () => {
    try {
      await productAPI.delete(deleteTarget._id);
      toast.success('Product deleted');
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6">
      {deleteTarget && <DeleteModal product={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase">Products</h1>
          <p className="text-muted text-sm mt-1">{pagination.total || 0} total products</p>
        </div>
        <Link href="/admin/products/new"
          className="bg-primary text-black font-bold uppercase text-sm px-5 py-2.5 hover:bg-primary-dark transition-colors flex items-center gap-2">
          <FiPlus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input type="text" placeholder="Search products..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-10 py-2.5" />
        </div>
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
          className="input-field w-44 py-2.5 cursor-pointer">
          {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-dark-2 border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-3 border-b border-border">
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
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
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20">
                    <FiPackage className="mx-auto text-muted mb-3" size={40} />
                    <p className="text-muted font-semibold">No products found</p>
                  </td>
                </tr>
              ) : products.map(product => (
                <tr key={product._id} className="border-b border-border hover:bg-dark-3/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-dark-3 border border-border shrink-0 overflow-hidden">
                        {product.images?.[0]?.url
                          ? <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-xl">💪</div>
                        }
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm line-clamp-1 max-w-[180px]">{product.name}</p>
                        <p className="text-muted text-xs mt-0.5">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-muted text-sm">{product.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-primary font-black text-sm">{formatPrice(product.discountPrice || product.price)}</p>
                    {product.discountPrice && (
                      <p className="text-muted text-xs line-through">{formatPrice(product.price)}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-black text-lg ${
                      product.stock === 0 ? 'text-red-400'
                      : product.stock <= 10 ? 'text-yellow-400'
                      : 'text-primary'
                    }`}>{product.stock}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      {product.isFeatured && <span className="bg-primary/20 text-primary border border-primary/30 text-[10px] font-bold uppercase px-2 py-0.5 w-fit">Featured</span>}
                      {product.isTrending && <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase px-2 py-0.5 w-fit">Trending</span>}
                      {product.stock === 0 && <span className="bg-dark-5 text-muted text-[10px] font-bold uppercase px-2 py-0.5 w-fit">Out of Stock</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={'/admin/products/' + product._id + '/edit'}
                        className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-all">
                        <FiEdit2 size={14} />
                      </Link>
                      <button onClick={() => setDeleteTarget(product)}
                        className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-red-400 hover:text-red-400 transition-all">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
