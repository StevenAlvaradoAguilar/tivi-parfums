import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import DecantDetailClient from './DecantDetailClient';
import { notFound } from 'next/navigation';

// 1. Componente de página principal (Sincrónico)
export default function DecantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center font-serif text-stone-600">
          Cargando detalles de la fragancia...
        </div>
      }
    >
      <AsyncDecantDetail params={params} />
    </Suspense>
  );
}

// 2. Componente interno que resuelve la promesa de `params` y consulta Prisma dentro de Suspense
async function AsyncDecantDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fdfbf7] pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <DecantDetailClient product={product} />
      </div>
    </main>
  );
}