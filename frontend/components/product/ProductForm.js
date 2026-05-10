'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { productAPI } from '@/services/api';
import { toast } from 'react-hot-toast';
import { FiPlus, FiX, FiArrowLeft, FiUpload, FiImage, FiLink } from 'react-icons/fi';
import Link from 'next/link';

const CATEGORIES = ['Dumbbells', 'Barbells', 'Machines', 'Cardio', 'Accessories', 'Benches', 'Racks', 'Cables', 'Bundles'];

const defaultForm = {
  name: '', brand: '', category: 'Accessories', description: '',
  price: '', discountPrice: '',
  weight: { value: '', unit: 'kg' },
  material: '', stock: '', lowStockThreshold: 10,
  images: [],
  tags: '',
  isFeatured: false, isTrending: false, isBundle: false,
};

// Convert image file to base64 or use as object URL for preview
function readFileAsDataURL(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

export default function ProductForm({ initial = null, isEdit = false }) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(initial ? {
    ...initial,
    tags: initial.tags?.join(', ') || '',
    discountPrice: initial.discountPrice || '',
    images: initial.images || [],
  } : defaultForm);

  const [saving, setSaving] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [uploadMode, setUploadMode] = useState('upload'); // 'upload' or 'url'
  const [dragging, setDragging] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Handle file upload
  const handleFileUpload = async (files) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) { toast.error('Please select image files only'); return; }

    const newImages = [];
    for (const file of validFiles) {
      if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} is too large (max 5MB)`); continue; }
      const dataUrl = await readFileAsDataURL(file);
      newImages.push({ url: dataUrl, alt: file.name.replace(/\.[^/.]+$/, ''), isLocal: true });
    }
    setForm(f => ({ ...f, images: [...f.images, ...newImages] }));
    toast.success(`${newImages.length} image(s) added`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleUrlAdd = () => {
    if (!urlInput.trim()) return;
    setForm(f => ({ ...f, images: [...f.images, { url: urlInput.trim(), alt: '' }] }));
    setUrlInput('');
  };

  const removeImage = (i) => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) { toast.error('Please add at least one product image'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        stock: Number(form.stock),
        lowStockThreshold: Number(form.lowStockThreshold) || 10,
        weight: { value: Number(form.weight?.value) || 0, unit: form.weight?.unit || 'kg' },
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        images: form.images.map(img => ({ url: img.url, alt: img.alt || '' })),
      };
      if (isEdit) {
        await productAPI.update(initial._id, payload);
        toast.success('Product updated!');
      } else {
        await productAPI.create(payload);
        toast.success('Product created!');
      }
      router.push('/admin/products');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products"
          className="w-9 h-9 border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all">
          <FiArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black uppercase text-white">
            {isEdit ? 'Edit Product' : 'New Product'}
          </h1>
          {isEdit && <p className="text-muted text-xs mt-0.5 truncate max-w-sm">{initial?.name}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — Main */}
        <div className="lg:col-span-2 space-y-6">

          {/* Basic Info */}
          <div className="bg-dark-2 border border-border p-6 space-y-5">
            <h2 className="font-bold text-white uppercase text-xs tracking-widest border-b border-border pb-3">
              Basic Information
            </h2>
            <div>
              <label className="text-muted text-xs uppercase tracking-wider block mb-2">Product Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} required
                className="input-field" placeholder="e.g. PowerFlex Adjustable Dumbbell Set" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted text-xs uppercase tracking-wider block mb-2">Brand *</label>
                <input value={form.brand} onChange={e => set('brand', e.target.value)} required
                  className="input-field" placeholder="e.g. PowerFlex" />
              </div>
              <div>
                <label className="text-muted text-xs uppercase tracking-wider block mb-2">Category *</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  className="input-field cursor-pointer" required>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-muted text-xs uppercase tracking-wider block mb-2">Description *</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                rows={5} className="input-field resize-none"
                placeholder="Detailed product description..." required />
            </div>
            <div>
              <label className="text-muted text-xs uppercase tracking-wider block mb-2">Tags (comma separated)</label>
              <input value={form.tags} onChange={e => set('tags', e.target.value)}
                className="input-field" placeholder="dumbbell, adjustable, home gym" />
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div className="bg-dark-2 border border-border p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-bold text-white uppercase text-xs tracking-widest">Product Images</h2>
              <div className="flex gap-2">
                <button type="button" onClick={() => setUploadMode('upload')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase transition-all ${
                    uploadMode === 'upload' ? 'bg-primary text-black' : 'border border-border text-muted hover:text-white'
                  }`}>
                  <FiUpload size={12} /> Upload File
                </button>
                <button type="button" onClick={() => setUploadMode('url')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase transition-all ${
                    uploadMode === 'url' ? 'bg-primary text-black' : 'border border-border text-muted hover:text-white'
                  }`}>
                  <FiLink size={12} /> URL
                </button>
              </div>
            </div>

            {/* Upload Mode */}
            {uploadMode === 'upload' ? (
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
                  dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-dark-3'
                }`}>
                <FiUpload className={`mx-auto mb-3 ${dragging ? 'text-primary' : 'text-muted'}`} size={36} />
                <p className="text-white font-semibold mb-1">
                  {dragging ? 'Drop images here!' : 'Click or drag images here'}
                </p>
                <p className="text-muted text-xs">PNG, JPG, WEBP up to 5MB each</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleFileUpload(e.target.files)}
                />
              </div>
            ) : (
              /* URL Mode */
              <div className="flex gap-3">
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleUrlAdd())}
                  className="input-field flex-1"
                />
                <button type="button" onClick={handleUrlAdd}
                  className="bg-primary text-black font-bold px-4 hover:bg-primary-dark transition-colors flex items-center gap-2">
                  <FiPlus size={16} /> Add
                </button>
              </div>
            )}

            {/* Image Preview Grid */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group aspect-square bg-dark-3 border border-border overflow-hidden">
                    <img
                      src={img.url} alt={img.alt || 'product'}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%231a1a1a"/><text x="50" y="55" font-size="30" text-anchor="middle" fill="%23666">?</text></svg>'; }}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => removeImage(i)}
                        className="w-8 h-8 bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                        <FiX size={14} />
                      </button>
                    </div>
                    {/* Main badge */}
                    {i === 0 && (
                      <div className="absolute top-1 left-1 bg-primary text-black text-xs font-bold px-1.5 py-0.5">
                        Main
                      </div>
                    )}
                    {/* Local badge */}
                    {img.isLocal && (
                      <div className="absolute bottom-1 right-1 bg-dark/80 text-primary text-xs px-1">
                        Local
                      </div>
                    )}
                  </div>
                ))}
                {/* Add more */}
                <button type="button"
                  onClick={() => uploadMode === 'upload' ? fileInputRef.current?.click() : setUploadMode('upload')}
                  className="aspect-square border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted hover:text-primary transition-all">
                  <FiPlus size={20} />
                  <span className="text-xs">Add</span>
                </button>
              </div>
            )}

            {form.images.length === 0 && (
              <p className="text-muted text-xs text-center py-2">
                <FiImage className="inline mr-1" size={14} />
                No images added yet. First image will be the main product image.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT — Sidebar */}
        <div className="space-y-5">
          {/* Pricing */}
          <div className="bg-dark-2 border border-border p-5 space-y-4">
            <h2 className="font-bold text-white uppercase text-xs tracking-widest border-b border-border pb-3">Pricing</h2>
            <div>
              <label className="text-muted text-xs uppercase tracking-wider block mb-2">Regular Price (৳) *</label>
              <input type="number" value={form.price} onChange={e => set('price', e.target.value)} required
                className="input-field" placeholder="0" min="0" />
            </div>
            <div>
              <label className="text-muted text-xs uppercase tracking-wider block mb-2">Sale Price (৳)</label>
              <input type="number" value={form.discountPrice} onChange={e => set('discountPrice', e.target.value)}
                className="input-field" placeholder="Leave empty for no discount" min="0" />
              {form.price && form.discountPrice && Number(form.discountPrice) < Number(form.price) && (
                <p className="text-primary text-xs mt-1.5 font-semibold">
                  💰 {Math.round((1 - form.discountPrice / form.price) * 100)}% discount
                </p>
              )}
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-dark-2 border border-border p-5 space-y-4">
            <h2 className="font-bold text-white uppercase text-xs tracking-widest border-b border-border pb-3">Inventory</h2>
            <div>
              <label className="text-muted text-xs uppercase tracking-wider block mb-2">Stock Quantity *</label>
              <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} required
                className="input-field" placeholder="0" min="0" />
            </div>
            <div>
              <label className="text-muted text-xs uppercase tracking-wider block mb-2">Low Stock Alert At</label>
              <input type="number" value={form.lowStockThreshold} onChange={e => set('lowStockThreshold', e.target.value)}
                className="input-field" placeholder="10" min="1" />
            </div>
          </div>

          {/* Specs */}
          <div className="bg-dark-2 border border-border p-5 space-y-4">
            <h2 className="font-bold text-white uppercase text-xs tracking-widest border-b border-border pb-3">Specifications</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-muted text-xs uppercase tracking-wider block mb-2">Weight</label>
                <input type="number" value={form.weight?.value || ''}
                  onChange={e => set('weight', { ...form.weight, value: e.target.value })}
                  className="input-field" placeholder="0" min="0" />
              </div>
              <div>
                <label className="text-muted text-xs uppercase tracking-wider block mb-2">Unit</label>
                <select value={form.weight?.unit || 'kg'}
                  onChange={e => set('weight', { ...form.weight, unit: e.target.value })}
                  className="input-field cursor-pointer">
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-muted text-xs uppercase tracking-wider block mb-2">Material</label>
              <input value={form.material} onChange={e => set('material', e.target.value)}
                className="input-field" placeholder="e.g. Rubber-coated Cast Iron" />
            </div>
          </div>

          {/* Flags */}
          <div className="bg-dark-2 border border-border p-5 space-y-4">
            <h2 className="font-bold text-white uppercase text-xs tracking-widest border-b border-border pb-3">Labels</h2>
            {[
              { key: 'isFeatured', label: 'Featured Product', desc: 'Show on homepage' },
              { key: 'isTrending', label: 'Trending / Hot', desc: 'Show in trending' },
              { key: 'isBundle', label: 'Bundle Product', desc: 'Mark as bundle' },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer group">
                <button type="button" onClick={() => set(key, !form[key])}
                  className={`w-11 h-6 relative transition-colors duration-200 flex-shrink-0 ${form[key] ? 'bg-primary' : 'bg-dark-5'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white transition-all duration-200 ${form[key] ? 'left-6' : 'left-1'}`} />
                </button>
                <div>
                  <p className={`text-sm font-semibold transition-colors ${form[key] ? 'text-primary' : 'text-white'}`}>{label}</p>
                  <p className="text-muted text-xs">{desc}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Submit */}
          <button type="submit" disabled={saving}
            className="w-full bg-primary text-black font-black uppercase py-4 text-base hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? (
              <>⏳ Saving...</>
            ) : isEdit ? (
              <>💾 Update Product</>
            ) : (
              <>✚ Create Product</>
            )}
          </button>

          <Link href="/admin/products"
            className="block text-center text-muted text-sm hover:text-white transition-colors py-2">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
