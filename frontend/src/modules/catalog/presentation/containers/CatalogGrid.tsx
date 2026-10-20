import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { FilterBar } from '../components/FilterBar';
import { useCatalogFilter } from '../../application/useCatalogFilter';
import { Button } from '@/shared/components/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const CatalogGrid: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    refetch,
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

      {/* 1. Estado de Carga (Loading Skeleton) */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="bg-white border border-slate-900/[0.08] rounded-3xl p-6 shadow-sm animate-pulse space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-slate-200 rounded-2xl"></div>
                <div className="w-24 h-6 bg-slate-200 rounded-full"></div>
              </div>
              <div className="w-3/4 h-6 bg-slate-200 rounded-lg"></div>
              <div className="w-1/2 h-4 bg-slate-200 rounded-lg"></div>
              <div className="h-10 bg-slate-100 rounded-xl"></div>
              <div className="h-20 bg-slate-50 rounded-2xl"></div>
              <div className="h-12 bg-slate-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* 2. Estado de Error con Botón Reintentar */
        <div className="py-16 text-center bg-white border border-rose-100 shadow-luxury rounded-3xl p-8 max-w-xl mx-auto flex flex-col items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">Fallo al cargar el catálogo</h3>
          <p className="text-xs text-slate-500 mb-5">{error}</p>
          <Button variant="primary" size="sm" onClick={refetch}>
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5" />
              Reintentar Carga
            </span>
          </Button>
        </div>
      ) : products.length === 0 ? (
        /* 3. Estado Vacío por Búsqueda */
        <div className="py-16 text-center bg-white border border-slate-900/[0.08] shadow-luxury rounded-3xl p-8 max-w-xl mx-auto flex flex-col items-center justify-center">
          <span className="text-4xl block mb-3">🔍</span>
          <h3 className="text-base font-bold text-slate-900 mb-1">No se encontraron productos</h3>
          <p className="text-xs text-slate-500 mb-4">
            Prueba buscando otro servicio como "Netflix", "Disney+", "Pantalla" o "Combo".
          </p>
          <Button variant="primary" size="sm" onClick={clearSearch}>
            Mostrar Todos los Servicios
          </Button>
        </div>
      ) : (
        /* 4. Lista de Productos Renderizada */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
