'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, Sparkles } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar lista de productos para el buscador
  useEffect(() => {
    if (!isOpen) return;

    async function loadProducts() {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Error cargando catálogo para búsqueda:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtrado en tiempo real por nombre o categoría
  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-stone-900/40 backdrop-blur-md transition-all">
      <div className="bg-[#fdfbf7] border border-amber-200/80 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera del Buscador */}
        <div className="p-4 border-b border-amber-200/80 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-amber-700 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Buscar por nombre (ej. Hawas, Baccarat, Amaderado)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-stone-900 font-serif text-base focus:outline-none placeholder:text-stone-400 placeholder:font-sans placeholder:text-xs uppercase tracking-wider"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-amber-900 hover:bg-amber-50 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resultados de Búsqueda */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {loading ? (
            <p className="text-center py-8 text-xs font-serif text-stone-500 uppercase tracking-widest">
              Buscando en TIVI Atelier...
            </p>
          ) : query.trim() !== '' && filteredProducts.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Sparkles className="w-8 h-8 text-amber-600 mx-auto" />
              <p className="font-serif text-stone-800 text-sm">No encontramos fragancias que coincidan</p>
              <p className="text-stone-500 text-xs font-light">Prueba buscando otra familia olfativa o nombre</p>
            </div>
          ) : (
            <>
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 bg-white hover:bg-amber-50/60 border border-amber-100 rounded-xl transition-all shadow-2xs group"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 bg-stone-50 border border-amber-200/60 rounded-lg overflow-hidden p-1 shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif text-stone-900 text-sm font-medium group-hover:text-amber-900 transition-colors">
                        {product.name}
                      </h4>
                      <span className="text-[10px] uppercase tracking-widest text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <span className="font-serif text-stone-900 text-sm font-semibold pr-2">
                    ₡{product.price.toLocaleString('es-CR')}
                  </span>
                </Link>
              ))}
            </>
          )}
        </div>

      </div>
    </div>
  );
}