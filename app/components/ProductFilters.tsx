'use client';

import { Search } from 'lucide-react';

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
}

const CATEGORIES = ['Todas', 'Amaderado', 'Floral', 'Cítrico', 'Oriental'];

export default function ProductFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col items-center space-y-6 mb-12 max-w-2xl mx-auto">
      {/* Buscador minimalista */}
      <div className="relative w-full">
        <input
          id="input-buscador"
          type="text"
          placeholder="Buscar perfume o nota olfativa (ej. Rosa, Oud)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-transparent border-b border-stone-300 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:border-stone-900 transition-colors text-center font-light"
        />
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 text-xs tracking-widest uppercase transition-all border-b cursor-pointer ${
              selectedCategory === cat
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}