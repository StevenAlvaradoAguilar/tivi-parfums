import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import DecantCard from '../components/DecantCard';

export default function DiscoverySetsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center font-serif text-stone-600">
          Cargando colección de decants...
        </div>
      }
    >
      <AsyncDiscoverySetsContent />
    </Suspense>
  );
}

async function AsyncDiscoverySetsContent() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-[#fdfbf7] pb-24">

      <div className="max-w-7xl mx-auto px-6 pt-12">
        {/* Banner de Cabecera */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-xs inline-block mb-3">
            Atelier de Decants & Muestras
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif text-stone-900 mb-4 font-normal">
            Discovery Sets & Decants
          </h1>
          <p className="text-stone-600 text-sm font-light leading-relaxed">
            Descubre nuestra cuidada selección de fragancias nicho en atomizadores portátiles de cristal de 5ml y 10ml. Pruébalos en tu piel durante días antes de comprometerte con la botella completa.
          </p>
        </div>

        {/* Catálogo en Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <DecantCard 
              key={product.id} 
              product={product} 
              priority={index === 0} 
            />
          ))}
        </div>
      </div>
    </main>
  );
}