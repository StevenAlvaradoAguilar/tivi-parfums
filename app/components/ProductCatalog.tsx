'use client';

import { useState, type ComponentProps } from 'react';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';

interface ProductCatalogProps {
  initialProducts: ComponentProps<typeof ProductCard>['product'][];
}

export default function ProductCatalog({ initialProducts }: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [maxPrice, setMaxPrice] = useState(300);

  // Filtrado dinámico flexible
  const filteredProducts = initialProducts.filter((product) => {
    // 1. Normalizar búsqueda por texto
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Normalizar categoría (Soporta 'Todas', 'TODAS', 'Woody', 'Fresh', etc.)
    const selectedCat = selectedCategory.toLowerCase();
    const prodCat =
      'category' in product && typeof product.category === 'string'
        ? product.category.toLowerCase()
        : '';

    const isAll = selectedCat === 'todas' || selectedCat === 'all' || selectedCat === '';

    const matchesCategory =
      isAll ||
      prodCat === selectedCat ||
      (selectedCat === 'amaderado' && prodCat === 'woody') ||
      (selectedCat === 'cítrico' && prodCat === 'fresh') ||
      (selectedCat === 'citrico' && prodCat === 'fresh') ||
      (selectedCat === 'oriental' && prodCat === 'oriental') ||
      (selectedCat === 'floral' && prodCat === 'floral');

    return matchesSearch && matchesCategory;
  });

  return (
    /* 📌 AQUÍ VA EL ID Y EL SCROLL MARGIN PARA QUE EL BOTÓN APUNTE A ESTA SECCIÓN */
    <section className="max-w-7xl mx-auto px-6 scroll-mt-24" id="catalogo">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-3">
          Colección de Autor
        </h2>
        <p className="text-stone-500 font-light text-sm max-w-md mx-auto">
          Explora por familia olfativa, notas o precio.
        </p>
      </div>

      {/* Componente de Filtros */}
      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />

      {/* Grid de Productos Filtrados */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-stone-200">
          <p className="text-stone-500 font-light text-sm">
            No se encontraron fragancias con los criterios seleccionados.
          </p>
        </div>
      )}
    </section>
  );
}