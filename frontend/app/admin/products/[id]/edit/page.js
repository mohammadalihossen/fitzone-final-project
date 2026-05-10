'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { productAPI } from '@/services/api';
import ProductForm from '@/components/product/ProductForm';

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI.getOne(id)
      .then(d => { setProduct(d.product); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 shimmer w-48" />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 h-96 shimmer" />
        <div className="h-96 shimmer" />
      </div>
    </div>
  );

  if (!product) return <p className="text-muted">Product not found.</p>;

  return <ProductForm initial={product} isEdit />;
}
