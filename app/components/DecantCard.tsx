'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  size: string; // <-- Añadido para poder leer el tamaño de la botella
  image: string;
}

export default function DecantCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  // 1. Extraemos el valor numérico del tamaño de la botella (ej: "50 ml" -> 50, "100ml" -> 100)
  // Por defecto usa 50 si no encuentra el valor.
  const bottleVolume = parseInt(product.size.replace(/\D/g, ''), 10) || 50;

  // 2. Calculamos el precio exacto por mililitro
  const pricePerMl = product.price / bottleVolume;

  // 3. Calculamos el precio 'Desde' basado estrictamente en el decant de 2 ml (proporcional)
  const priceFrom = Math.round(pricePerMl * 2 * 1.1); // 10% de recargo para decants pequeños

  return (
    <Link 
      href={`/discovery-sets/${product.id}`}
      className="group bg-white border border-amber-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 hover:border-amber-400"
    >
      <div>
        {/* Contenedor de la Imagen */}
        <div className="relative w-full h-64 bg-[#fcfbf9] rounded-xl overflow-hidden mb-4 flex items-center justify-center p-4 border border-amber-100/60">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Categoría y Nombre del Perfume */}
        <span className="text-[10px] uppercase tracking-widest text-amber-800 font-semibold block mb-1">
          {product.category}
        </span>
        <h3 className="text-lg font-serif text-stone-900 font-medium mb-3 line-clamp-1">
          Decant {product.name}
        </h3>
      </div>

      {/* Sección Inferior: Precio + Botón Negro */}
      <div className="pt-3 border-t border-amber-100/80 space-y-3">
        {/* Muestra del Precio Desde (Proporcional a 2ml) */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs text-stone-400 font-light">Desde</span>
          <span className="text-xl font-serif font-bold text-amber-950">
            ₡{priceFrom.toLocaleString('es-CR')}
          </span>
        </div>

        {/* Botón en color negro con acento dorado y hover en tono ámbar */}
        <button
          type="button"
          className="w-full bg-stone-900 hover:bg-amber-900 text-amber-100 py-3 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xs border border-amber-500/30 flex justify-center items-center gap-2"
        >
          Agregar
        </button>
      </div>
    </Link>
  );
}