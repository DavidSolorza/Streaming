import { useState, useMemo, useEffect, useCallback } from 'react';
import { Product } from '../domain/entities/Product';
import { ProductRepository } from '../infrastructure/productRepository';
import { eventBus } from '@/core/bus/eventBus';

export function useCatalogFilter() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ProductRepository.fetchProductsAsync();
      setAllProducts(data);
    } catch (err: any) {
      setError(err?.message || 'Ocurrió un error al cargar el catálogo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();

    const unsubscribe = eventBus.on('CATALOG:PRODUCTS_CHANGED', (products) => {
      setAllProducts(products);
    });
    return unsubscribe;
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // 1. Filtro por categoría (todos / cine / musica / deportes / combo / trabajo)
      const categoryMatch = 
        selectedCategory === 'all' || 
        selectedCategory === 'todos' || 
        product.category === selectedCategory;

      // 2. Búsqueda predictiva multi-campo
      if (!searchQuery.trim()) return categoryMatch;

      const query = searchQuery.toLowerCase().trim();
      const nameMatch = product.name.toLowerCase().includes(query);
      const brandMatch = product.brand.toLowerCase().includes(query);
      const tagMatch = product.searchTags?.some(t => t.toLowerCase().includes(query));
      const badgeMatch = product.badges?.some(b => b.toLowerCase().includes(query));
      const includesMatch = product.includes?.some(inc => inc.toLowerCase().includes(query));

      const coincideTexto = nameMatch || brandMatch || tagMatch || badgeMatch || includesMatch;

      return categoryMatch && coincideTexto;
    });
  }, [allProducts, selectedCategory, searchQuery]);

  return {
    products: filteredProducts,
    totalCount: allProducts.length,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    refetch: loadProducts,
    clearSearch: () => {
      setSearchQuery('');
      setSelectedCategory('all');
    },
  };
}
