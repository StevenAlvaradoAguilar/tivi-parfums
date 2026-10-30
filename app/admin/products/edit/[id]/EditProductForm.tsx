'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  size: string;
  category: string;
  image: string;
}

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(product.image);
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    size: product.size,
    category: product.category,
  });
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('size', formData.size);
      data.append('category', formData.category);
      if (file) {
        data.append('image', file);
      }

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        alert('✨ Perfume actualizado con éxito');
        router.push('/admin/products');
        router.refresh();
      } else {
        alert(result.error || 'Error al actualizar el perfume.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col">
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-800 hover:text-amber-950 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la Lista
        </Link>

        {/* Tarjeta con fondo blanco puro y sutil borde dorado */}
        <div className="bg-white border border-amber-200/60 p-8 shadow-sm rounded-sm">
          <h1 className="text-2xl font-serif text-stone-900 mb-1">Editar Perfume</h1>
          <p className="text-amber-800/80 text-xs uppercase tracking-widest font-light mb-8">
            Modifica las especificaciones de {product.name}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-2">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-amber-200 text-stone-900 text-sm rounded-xs focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all font-medium"
              />
            </div>

            {/* Categoría y Presentación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-2">
                  Familia Olfativa
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-amber-200 text-stone-900 text-sm rounded-xs focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
                >
                  <option value="Oriental">Oriental</option>
                  <option value="Amaderado">Amaderado</option>
                  <option value="Floral">Floral</option>
                  <option value="Cítrico">Cítrico</option>
                  <option value="Gourmand">Gourmand</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-2">
                  Presentación
                </label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-amber-200 text-stone-900 text-sm rounded-xs focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all font-medium"
                />
              </div>
            </div>

            {/* Precio y Descripción */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-2">
                  Precio (₡ CRC) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-amber-200 text-stone-900 text-sm rounded-xs focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-amber-200 text-stone-900 text-sm rounded-xs focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all font-medium"
                />
              </div>
            </div>

            {/* Imagen actual y carga */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-2">
                Imagen Actual
              </label>
              {preview && (
                <div className="mb-4">
                  <Image src={preview} alt="Vista previa" width={128} height={128} unoptimized className="w-32 h-32 object-cover rounded-xs border border-amber-200 shadow-xs" />
                </div>
              )}

              <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-2">
                Reemplazar Imagen (Opcional)
              </label>
              <div className="border-2 border-dashed border-amber-200 rounded-sm p-6 text-center bg-amber-50/20 hover:bg-amber-50/40 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-xs text-stone-600 file:mr-4 file:py-2 file:px-4 file:rounded-xs file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
                />
              </div>
            </div>

            {/* Botón de Guardar con acento dorado/ámbar elegante */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 hover:bg-amber-900 text-amber-100 py-4 uppercase text-xs tracking-widest transition-colors font-medium flex justify-center items-center gap-2 disabled:opacity-50 shadow-sm border border-amber-500/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
                  Guardando Cambios...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}