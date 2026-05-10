'use client';
import { useState, useEffect, useCallback, Suspense } from 'react'; 
import { useSearchParams, useRouter } from 'next/navigation';
import { productAPI } from '@/services/api';
import ProductCard from '@/components/product/ProductCard';
import { FiFilter, FiSearch, FiX, FiChevronDown } from 'react-icons/fi';

const CATEGORIES = ['Dumbbells', 'Barbells', 'Machines', 'Cardio', 'Accessories', 'Benches', 'Racks', 'Cables', 'Bundles'];
const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-rating', label: 'Top Rated' },
  { value: '-totalSold', label: 'Best Selling' },
];

function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-56 shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-3 shimmer w-1/3" />
        <div className="h-4 shimmer w-3/4" />
        <div className="h-6 shimmer w-1/2" />
      </div>
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sort: '-createdAt',
    page: 1,
  });

 
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      brand: searchParams.get('brand') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sort: searchParams.get('sort') || '-createdAt',
      page: 1,
    });
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '' && v !== null)
      );
      const data = await productAPI.getAll(cleanFilters);
      setProducts(data.products || []);
      setPagination(data.pagination || {});
      if (data.filters?.brands) setBrands(data.filters.brands);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { 
    fetchProducts(); 
  }, [fetchProducts]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', brand: '', minPrice: '', maxPrice: '', sort: '-createdAt', page: 1 });
  };

  const activeFiltersCount = [filters.category, filters.brand, filters.minPrice, filters.maxPrice]
    .filter(Boolean).length;

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-2">ALL PRODUCTS</h1>
        {pagination.total && (
          <p className="text-muted text-sm">{pagination.total} products found</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            type="text"
            placeholder="Search products, brands..."
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
            className="input-field pl-12"
          />
        </div>

        <select
          value={filters.sort}
          onChange={e => updateFilter('sort', e.target.value)}
          className="input-field md:w-56 cursor-pointer"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className={`flex items-center gap-2 px-5 py-3 border font-heading font-600 uppercase text-sm tracking-wider transition-all ${
            filterOpen || activeFiltersCount > 0
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border text-muted hover:border-primary hover:text-primary'
          }`}
        >
          <FiFilter size={16} />
          Filters {activeFiltersCount > 0 && <span className="bg-primary text-black text-xs w-5 h-5 flex items-center justify-center font-700">{activeFiltersCount}</span>}
        </button>
      </div>

      <div className="flex gap-8">
        <aside className={`${filterOpen ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0`}>
          <div className="card p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-700 uppercase text-sm tracking-wider text-white">Filters</h3>
              {activeFiltersCount > 0 && (
                <button onClick={clearFilters} className="text-primary text-xs font-600 flex items-center gap-1 hover:text-primary-dark">
                  <FiX size={12} /> Clear all
                </button>
              )}
            </div>

            <div className="mb-6">
              <h4 className="text-muted text-xs uppercase tracking-widest font-600 mb-3">Category</h4>
              <div className="space-y-2">
                <button
                  onClick={() => updateFilter('category', '')}
                  className={`w-full text-left text-sm px-3 py-2 transition-colors ${!filters.category ? 'text-primary bg-primary/10' : 'text-muted hover:text-white'}`}
                >
                  All Categories
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', cat)}
                    className={`w-full text-left text-sm px-3 py-2 transition-colors ${filters.category === cat ? 'text-primary bg-primary/10' : 'text-muted hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {brands.length > 0 && (
              <div className="mb-6">
                <h4 className="text-muted text-xs uppercase tracking-widest font-600 mb-3">Brand</h4>
                <div className="space-y-2">
                  <button onClick={() => updateFilter('brand', '')} className={`w-full text-left text-sm px-3 py-2 transition-colors ${!filters.brand ? 'text-primary bg-primary/10' : 'text-muted hover:text-white'}`}>All Brands</button>
                  {brands.map(b => (
                    <button key={b} onClick={() => updateFilter('brand', b)}
                      className={`w-full text-left text-sm px-3 py-2 transition-colors ${filters.brand === b ? 'text-primary bg-primary/10' : 'text-muted hover:text-white'}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-muted text-xs uppercase tracking-widest font-600 mb-3">Price Range (৳)</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={e => updateFilter('minPrice', e.target.value)}
                  className="input-field text-sm py-2 px-3"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={e => updateFilter('maxPrice', e.target.value)}
                  className="input-field text-sm py-2 px-3"
                />
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-heading text-4xl text-muted mb-3">NO PRODUCTS FOUND</p>
              <p className="text-muted text-sm mb-6">Try adjusting your filters</p>
              <button onClick={clearFilters} className="btn-outline text-sm px-6 py-2">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setFilters(f => ({ ...f, page }))}
                      className={`w-10 h-10 font-heading font-600 text-sm border transition-all ${
                        filters.page === page
                          ? 'bg-primary text-black border-primary'
                          : 'border-border text-muted hover:border-primary hover:text-primary'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center text-white">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}