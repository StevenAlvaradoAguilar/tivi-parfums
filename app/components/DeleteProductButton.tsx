'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteProductButton({
  id,
  productName,
}: {
  id: string;
  productName: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar la fragancia "${productName}"? Esta acción no se puede deshacer.`
    );

    if (!confirmDelete) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || 'No se pudo eliminar'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error de red al intentar eliminar el producto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 transition-colors border border-red-200 cursor-pointer disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
      Eliminar
    </button>
  );
}