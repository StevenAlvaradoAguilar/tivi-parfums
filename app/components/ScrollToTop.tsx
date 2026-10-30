'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 1. Componente interno que utiliza usePathname()
function ScrollToTopContent() {
  const [visibility, setVisibility] = useState<{ pathname: string; visible: boolean } | null>(null);
  const pathname = usePathname();
  const isVisible = visibility?.pathname === pathname && visibility.visible;

  // Muestra u oculta el botón dependiendo de cuánto se haya desplazado la página (> 300px)
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisibility({ pathname, visible: true });
      } else {
        setVisibility({ pathname, visible: false });
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [pathname]);

  // Scroll suave al cambiar de ruta automáticamente
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  // Función para volver al inicio al hacer clic
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          aria-label="Volver al inicio"
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-stone-900 hover:bg-amber-900 text-amber-100 shadow-xl border border-amber-500/40 transition-all duration-300 cursor-pointer group hover:scale-105"
        >
          <ArrowUp className="w-5 h-5 text-amber-300 group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// 2. Exportación principal protegida con Suspense para el Build de Next.js
export default function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollToTopContent />
    </Suspense>
  );
}