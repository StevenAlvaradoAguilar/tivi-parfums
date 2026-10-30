'use client';

import { useState } from 'react';
import Hero from './Hero';
import PerfumeQuiz from './PerfumeQuiz';
import { Sparkles } from 'lucide-react';

interface HomeClientContentProps {
  children: React.ReactNode;
  products: React.ComponentProps<typeof PerfumeQuiz>['products'];
}

export default function HomeClientContent({ children, products }: HomeClientContentProps) {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <div className="pb-20">
      {/* Ya no requerimos <Navbar /> aquí porque layout.tsx lo maneja globalmente */}
      <Hero />

      {/* Banner promocional del Quiz Olfativo */}
      <section className="relative overflow-hidden bg-white border-y border-amber-200/80 py-16 px-6 my-16 shadow-2xs">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-amber-100/30 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-amber-50 px-3.5 py-1.5 rounded-full text-[11px] text-amber-900 font-semibold uppercase tracking-widest border border-amber-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Asistente Personal de Fragancias</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 font-medium">
            ¿No sabes cuál elegir? Encuentra tu aroma firma
          </h2>

          <p className="text-stone-600 font-light text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Responde 4 breves preguntas sobre tus gustos y te recomendaremos la fragancia de autor ideal para ti.
          </p>

          <div>
            <button
              onClick={() => setIsQuizOpen(true)}
              className="mt-2 bg-stone-900 hover:bg-amber-900 text-amber-100 px-8 py-4 rounded-full uppercase text-xs tracking-widest font-semibold transition-all duration-300 shadow-md border border-amber-500/30 hover:border-amber-400 cursor-pointer inline-block"
            >
              Iniciar Test Olfativo
            </button>
          </div>
        </div>
      </section>

      {/* Catálogo con Suspense */}
      {children}

      {/* Modal del Quiz con los productos reales */}
      <PerfumeQuiz products={products} isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
}