import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Truck, Sparkles, Star } from 'lucide-react';
import AddToCartButtonClient from '../../components/AddToCartButtonClient';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 1. Componente principal envuelto en Suspense
export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fdfbf7]">
          <div className="max-w-7xl mx-auto px-6 pt-20 text-center font-serif text-stone-600">
            Cargando detalles de la fragancia...
          </div>
        </main>
      }
    >
      <AsyncProductDetail params={params} />
    </Suspense>
  );
}

// 2. Componente interno que maneja los datos y la promesa de params
async function AsyncProductDetail({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return (
      <main className="min-h-screen bg-[#fdfbf7]">
        <div className="max-w-7xl mx-auto px-6 pt-20 text-center">
          <h1 className="text-2xl font-serif mb-4 text-stone-900">Producto no encontrado</h1>
          <Link href="/" className="text-xs uppercase tracking-widest underline text-stone-600">
            Volver al catálogo
          </Link>
        </div>
      </main>
    );
  }

  const formattedProduct = {
    id: product.id,
    name: product.name,
    category: product.category as 'Amaderado' | 'Floral' | 'Cítrico' | 'Oriental',
    price: product.price,
    quantity: 1,
    image: product.image,
    size: product.size,
    subtitle: product.description || '',
    description: product.description || '',
    notes: {
      top: 'Esencias selectas de alta gama',
      heart: product.category,
      base: product.size
    },
  };

  return (
    <main className="min-h-screen bg-[#fdfbf7] pb-20">

      <div className="max-w-7xl mx-auto px-6 pt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la colección
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="relative w-full h-125 lg:h-150 bg-white border border-stone-200 shadow-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>

          <div className="space-y-8">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-amber-700 font-medium block mb-2">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4 font-normal">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 text-amber-600 text-xs mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-stone-500 font-sans ml-1">(24 valoraciones)</span>
              </div>
              <p className="text-3xl font-serif text-stone-900 font-semibold">
                ₡{product.price.toLocaleString('es-CR')} <span className="text-xs text-stone-400 font-sans font-normal">/ {product.size}</span>
              </p>
            </div>

            <p className="text-stone-600 font-light text-base leading-relaxed border-t border-stone-200 pt-6">
              {product.description || 'Una fragancia de autor excepcional elaborada con los más altos estándares de la alta perfumería.'}
            </p>

            <div className="bg-white border border-stone-200 p-6 space-y-4">
              <h3 className="text-sm font-serif text-stone-900 uppercase tracking-wider flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sparkles className="w-4 h-4 text-amber-600" /> Perfil de la Fragancia
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-stone-50 p-3 border border-stone-100">
                  <span className="text-stone-400 block uppercase tracking-widest text-[10px] mb-1">Categoría</span>
                  <p className="text-stone-900 font-medium">{product.category}</p>
                </div>
                <div className="bg-stone-50 p-3 border border-stone-100">
                  <span className="text-stone-400 block uppercase tracking-widest text-[10px] mb-1">Presentación</span>
                  <p className="text-stone-900 font-medium">{product.size}</p>
                </div>
                <div className="bg-stone-50 p-3 border border-stone-100">
                  <span className="text-stone-400 block uppercase tracking-widest text-[10px] mb-1">Disponibilidad</span>
                  <p className="text-emerald-700 font-medium">En Stock</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <AddToCartButtonClient product={formattedProduct} />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-stone-200 pt-6 text-xs text-stone-600">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-stone-700 shrink-0" />
                <span>Envío express dependiendo de tu ubicación</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-stone-700 shrink-0" />
                <span>Muestra sorpresa gratis incluida</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}