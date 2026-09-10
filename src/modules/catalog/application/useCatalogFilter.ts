import { useState, useMemo, useEffect } from 'react';
import { Product } from '../domain/entities/Product';
import { ProductRepository } from '../infrastructure/productRepository';
import { eventBus } from '@/core/bus/eventBus';

export function useCatalogFilter() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allProducts, setAllProducts] = useState<Product[]>(() => ProductRepository.getProducts());

  useEffect(() => {
    const unsubscribe = eventBus.on('CATALOG:PRODUCTS_CHANGED', (products) => {
      setAllProducts(products);
    });
    return unsubscribe;
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Category Filter
      const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;

      // Predictive Search Query Filter
      if (!searchQuery.trim()) return categoryMatch;

      const query = searchQuery.toLowerCase().trim();
      const nameMatch = product.name.toLowerCase().includes(query);
      const brandMatch = product.brand.toLowerCase().includes(query);
      const tagMatch = product.searchTags?.some(t => t.toLowerCase().includes(query));

      return categoryMatch && (nameMatch || brandMatch || tagMatch);
    });
  }, [allProducts, selectedCategory, searchQuery]);

  return {
    products: filteredProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    clearSearch: () => setSearchQuery(''),
  };
}
