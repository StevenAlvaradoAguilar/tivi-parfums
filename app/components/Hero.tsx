'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Hero() {
  // Función para desplazar la pantalla suavemente hacia el catálogo
  const handleExploreClick = () => {
    const catalogElement = 
      document.getElementById('catalogo') || 
      document.getElementById('input-buscador') || 
      document.getElementById('catalogo-section');

    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative h-[85vh] flex items-center justify-center bg-[#fdfbf7] overflow-hidden border-b border-amber-200/60">
      {/* Sutil resplandor dorado de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-amber-100/40 via-transparent to-transparent pointer-events-none" />

      <div className="text-center z-10 px-4 max-w-3xl relative">
        {/* Subtítulo Dorado con Acento de Ícono */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200/80 mb-6 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-amber-900 font-semibold">
            Colección Exclusiva
          </span>
        </motion.div>
        
        {/* Título Principal */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-serif text-stone-900 mb-6 leading-tight font-medium"
        >
          Descubre tu aroma firma
        </motion.h1>

        {/* Descripción */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-stone-600 mb-10 max-w-lg mx-auto font-light leading-relaxed text-sm md:text-base"
        >
          Perfumes de autor elaborados con las notas esenciales más finas del mundo.
        </motion.p>

        {/* Botón Principal en Blanco, Negro & Dorado */}
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          onClick={handleExploreClick}
          className="bg-stone-900 hover:bg-amber-900 text-amber-100 px-9 py-4 rounded-full uppercase text-xs tracking-[0.2em] transition-all duration-300 font-semibold cursor-pointer border border-amber-500/40 shadow-md hover:shadow-lg hover:border-amber-400"
        >
          Explorar Catálogo
        </motion.button>
      </div>
    </section>
  );
}