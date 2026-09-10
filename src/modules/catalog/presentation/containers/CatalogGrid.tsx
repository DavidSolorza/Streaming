import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { FilterBar } from '../components/FilterBar';
import { useCatalogFilter } from '../../application/useCatalogFilter';
import { Button } from '@/shared/components/Button';

export const CatalogGrid: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    clearSearch,
  } = useCatalogFilter();

  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Sticky Filter Bar */}
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={clearSearch}
      />

      {/* Grid de Productos */}
      {products.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-900/[0.08] shadow-luxury rounded-3xl p-8 max-w-xl mx-auto">
          <span className="text-4xl block mb-3">🔍</span>
          <h3 className="text-base font-bold text-slate-900 mb-1">No se encontraron productos</h3>
          <p className="text-xs text-slate-500 mb-4">Prueba buscando otro servicio como "Netflix", "Disney" o "Anime".</p>
          <Button variant="primary" size="sm" onClick={clearSearch}>
            Mostrar Todos los Servicios
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
