import { Suspense } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import NewProductForm from './NewProductForm';

// 1. Componente principal envuelto en Suspense
export default function NewProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center font-serif text-stone-600">
          Verificando permisos de administración...
        </div>
      }
    >
      <AsyncNewProductPage />
    </Suspense>
  );
}

// 2. Componente asíncrono interno que realiza la validación con Clerk
async function AsyncNewProductPage() {
  const clerkUser = await currentUser();
  const role = (clerkUser?.publicMetadata as { role?: string })?.role;

  // Validación Server-Side: Si no es admin, lo expulsamos inmediatamente al inicio
  if (!clerkUser || role !== 'admin') {
    redirect('/');
  }

  // Si es admin, renderizamos el formulario interactivo
  return <NewProductForm />;
}