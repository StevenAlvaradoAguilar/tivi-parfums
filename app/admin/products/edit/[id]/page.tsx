import { Suspense } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import EditProductForm from './EditProductForm';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditPageProps) {
  return (
    <Suspense fallback={<p className="p-8 text-center font-serif">Cargando formulario...</p>}>
      <AsyncEditProductPage params={params} />
    </Suspense>
  );
}

async function AsyncEditProductPage({ params }: EditPageProps) {
  const clerkUser = await currentUser();
  const role = (clerkUser?.publicMetadata as { role?: string })?.role;

  if (!clerkUser || role !== 'admin') {
    redirect('/');
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    redirect('/admin/products');
  }

  return (
    <main className="min-h-screen bg-[#fdfbf7] pb-20">
      <div className="max-w-2xl mx-auto px-6 pt-12">
        <h1 className="text-3xl font-serif text-stone-900 mb-2">Editar Perfume</h1>
        <p className="text-xs uppercase tracking-widest text-stone-500 mb-8">
          Modifica las especificaciones de {product.name}
        </p>
        <EditProductForm product={product} />
      </div>
    </main>
  );
}