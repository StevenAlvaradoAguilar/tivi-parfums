import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import HomeClientContent from './components/HomeClientContent';
import ProductCatalog from './components/ProductCatalog';

async function AsyncProductCatalog() {
  const productsFromDb = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const formattedProducts = productsFromDb.map((product) => ({
    id: product.id,
    name: product.name,
    quantity: 1,
    category: product.category, // Asegura que coincida con las categorías del filtro ('Amaderado', 'Floral', 'Cítrico', 'Oriental')
    price: product.price,
    image: product.image,
    size: product.size,
    subtitle: product.description || 'Alta Perfumería de Autor',
    description: product.description || '',
    notes: { 
      top: product.description || 'Esencias selectas de alta gama', 
      heart: product.category, 
      base: product.size 
    },
  }));

  return (
    <HomeClientContent products={formattedProducts}>
      <ProductCatalog initialProducts={formattedProducts} />
    </HomeClientContent>
  );
}

function CatalogSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-stone-200 h-96 rounded-sm"></div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <AsyncProductCatalog />
    </Suspense>
  );
}