import { Suspense } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import DeleteProductButton from '../../components/DeleteProductButton';
import { Plus, Edit, Shield, Loader2 } from 'lucide-react';

// 1. Componente principal envuelto en Suspense
export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center font-serif text-stone-700 py-20">
          <Loader2 className="w-8 h-8 text-amber-700 animate-spin mb-4" />
          <p className="text-sm font-medium">Cargando panel de administración...</p>
        </div>
      }
    >
      <AsyncAdminProductsPage />
    </Suspense>
  );
}

// 2. Componente asíncrono con validación de Clerk y Prisma
async function AsyncAdminProductsPage() {
  const clerkUser = await currentUser();
  const role = (clerkUser?.publicMetadata as { role?: string })?.role;

  // Redirigir si no es admin
  if (!clerkUser || role !== 'admin') {
    redirect('/');
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-[#fdfbf7] pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-amber-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200/80 mb-2 shadow-2xs">
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              <span className="text-[10px] uppercase tracking-widest text-amber-900 font-semibold">
                Panel de Administración
              </span>
            </div>
            <h1 className="text-3xl font-serif text-stone-900 font-medium">Gestión de Catálogo</h1>
            <p className="text-xs text-stone-500 font-light uppercase tracking-wider mt-1">
              Administra las fragancias y decants publicados en TIVI Parfum CR.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-amber-900 text-amber-100 px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all shadow-md border border-amber-500/30"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Agregar Perfume</span>
          </Link>
        </div>

        {/* Tabla de Productos */}
        <div className="bg-white border border-amber-200/80 shadow-2xs rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="bg-amber-50/60 uppercase text-[10px] tracking-widest text-amber-950 font-semibold border-b border-amber-200/80">
                <tr>
                  <th className="p-4 pl-6">Imagen</th>
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Precio</th>
                  <th className="p-4 pr-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100/80">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-stone-500 font-light text-xs uppercase tracking-wider">
                      No hay fragancias registradas aún.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="relative w-12 h-12 bg-white border border-amber-200/80 rounded-xl overflow-hidden p-1 shadow-2xs">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="100px"
                            className="object-contain"
                          />
                        </div>
                      </td>
                      <td className="p-4 font-serif text-stone-900 font-medium text-base">
                        {product.name}
                      </td>
                      <td className="p-4">
                        <span className="inline-block bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 font-serif text-stone-900 font-semibold">
                        ₡{product.price.toLocaleString('es-CR')}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-stone-700 hover:text-amber-900 bg-amber-50/80 hover:bg-amber-100/80 px-3 py-1.5 rounded-lg transition-all border border-amber-200/80 font-medium"
                          >
                            <Edit className="w-3.5 h-3.5 text-amber-700" />
                            <span>Editar</span>
                          </Link>
                          <DeleteProductButton id={product.id} productName={product.name} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}