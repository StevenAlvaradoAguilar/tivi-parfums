'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function NewProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    size: '100 ml',
    category: 'Floral',
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
    if (!file) {
      alert('Por favor selecciona una imagen para el perfume.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('size', formData.size);
      data.append('category', formData.category);
      data.append('image', file);

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        alert('✨ Perfume publicado con éxito');

        setFormData({
          name: '',
          description: '',
          price: '',
          size: '100 ml',
          category: 'Floral',
        });
        setFile(null);
        setPreview(null);

        router.refresh();
        router.push('/admin/products');
      } else {
        alert(result.error || 'Error al guardar el perfume.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col py-8">
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enlace para volver */}
        <div className="mb-6">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-600 hover:text-amber-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Gestión de Catálogo
          </Link>
        </div>

        {/* Contenedor principal de lujo */}
        <div className="bg-white border border-amber-200/80 p-8 sm:p-10 shadow-2xs rounded-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200/80 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[10px] uppercase tracking-widest text-amber-900 font-semibold">
              Panel Administrativo
            </span>
          </div>

          <h1 className="text-3xl font-serif text-stone-900 mb-1 font-medium">Agregar Nuevo Perfume</h1>
          <p className="text-stone-500 text-xs font-light mb-8 uppercase tracking-wider">
            Ingresa las especificaciones y sube la imagen en alta calidad para el catálogo.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-amber-950 font-semibold mb-2">
                Nombre de la Fragancia *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Baccarat Rouge 540"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-amber-50/30 border border-amber-200/80 text-stone-900 text-sm rounded-xl focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Categoría y Tamaño */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-amber-950 font-semibold mb-2">
                  Familia Olfativa
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-amber-50/30 border border-amber-200/80 text-stone-900 text-sm rounded-xl focus:outline-none focus:border-amber-400 transition-colors"
                >
                  <option value="Oriental">Oriental</option>
                  <option value="Amaderado">Amaderado</option>
                  <option value="Floral">Floral</option>
                  <option value="Cítrico">Cítrico</option>
                  <option value="Gourmand">Gourmand</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-amber-950 font-semibold mb-2">
                  Presentación
                </label>
                <input
                  type="text"
                  placeholder="Ej. 100 ml / 3.4 fl. oz."
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-3 bg-amber-50/30 border border-amber-200/80 text-stone-900 text-sm rounded-xl focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* Precio y Descripción */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-amber-950 font-semibold mb-2">
                  Precio (₡ CRC) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="32000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 bg-amber-50/30 border border-amber-200/80 text-stone-900 text-sm rounded-xl focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-amber-950 font-semibold mb-2">
                  Notas / Descripción
                </label>
                <input
                  type="text"
                  placeholder="Ej. Azafrán, jazmín, madera de ámbar..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-amber-50/30 border border-amber-200/80 text-stone-900 text-sm rounded-xl focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* Subida de Imagen */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-amber-950 font-semibold mb-2">
                Fotografía del Producto *
              </label>
              <div className="border-2 border-dashed border-amber-300/80 rounded-2xl p-6 text-center bg-amber-50/20 hover:bg-amber-50/40 transition-colors">
                {preview ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-28 h-28 bg-white border border-amber-200 rounded-xl overflow-hidden p-1 shadow-2xs">
                      <Image src={preview} alt="Vista previa" fill unoptimized className="object-contain" />
                    </div>
                    <button
                      type="button"
                      onClick={() => { setFile(null); setPreview(null); }}
                      className="text-xs text-amber-900 hover:text-stone-900 underline font-medium cursor-pointer"
                    >
                      Cambiar imagen
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-amber-700/60" />
                    <span className="text-xs text-stone-700 font-serif">Selecciona una imagen en JPG, PNG o WebP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Botón Publicar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 hover:bg-amber-900 text-amber-100 py-4 uppercase text-xs tracking-widest transition-all font-semibold rounded-full flex justify-center items-center gap-2 disabled:opacity-50 shadow-md border border-amber-500/30 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  Guardando y Subiendo Imagen...
                </>
              ) : (
                'Publicar Perfume'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}