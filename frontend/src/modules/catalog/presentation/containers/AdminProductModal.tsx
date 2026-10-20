import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Plus, RotateCcw, Tv } from 'lucide-react';
import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../infrastructure/productRepository';
import { eventBus } from '@/core/bus/eventBus';
import { toast } from '@/core/utils/toast';
import { AdminProductList } from './AdminProductList';
import { AdminProductForm } from './AdminProductForm';

export const AdminProductModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'edit'>('list');
  const [simpleName, setSimpleName] = useState('');
  const [simpleCategory, setSimpleCategory] = useState<'cine' | 'musica' | 'deportes' | 'trabajo'>('cine');
  const [simplePrice1M, setSimplePrice1M] = useState(15000);

  const refreshProducts = () => setProducts(ProductRepository.getProducts());

  useEffect(() => {
    const unSubOpen = eventBus.on('ADMIN:OPEN_MODAL', () => { refreshProducts(); setIsOpen(true); });
    const unSubClose = eventBus.on('ADMIN:CLOSE_MODAL', () => setIsOpen(false));
    const unSubProducts = eventBus.on('CATALOG:PRODUCTS_CHANGED', (newProds) => setProducts(newProds));
    return () => { unSubOpen(); unSubClose(); unSubProducts(); };
  }, []);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simpleName.trim()) return;
    ProductRepository.addProduct({
      name: simpleName.trim(), brand: simpleName.trim(), category: simpleCategory, brandGlow: 'brand-glow-netflix', iconName: 'logos:netflix-icon', logoBg: 'bg-blue-500/10 text-blue-600', available: true, bestseller: false, badges: ['4K UHD', 'Entrega Inmediata'], searchTags: [simpleName.toLowerCase()],
      modes: { pantalla: { label: '1 Pantalla', devices: '1 Dispositivo', quality: '4K', access: 'PIN', prices: { '1m': simplePrice1M, '3m': simplePrice1M * 3, '6m': simplePrice1M * 6, '12m': simplePrice1M * 12 }, regularPrices: { '1m': simplePrice1M + 10000, '3m': simplePrice1M * 4, '6m': simplePrice1M * 8, '12m': simplePrice1M * 14 } }, cuenta: { label: 'Cuenta Completa', devices: '4 Dispositivos', quality: '4K', access: 'Correo', prices: { '1m': simplePrice1M * 2, '3m': simplePrice1M * 5, '6m': simplePrice1M * 10, '12m': simplePrice1M * 18 }, regularPrices: { '1m': simplePrice1M * 3, '3m': simplePrice1M * 7, '6m': simplePrice1M * 13, '12m': simplePrice1M * 22 } } },
      includes: [`Catálogo de ${simpleName.trim()}`, '4K UHD', 'Garantía']
    });
    toast.success(`Servicio "${simpleName}" creado correctamente`);
    setActiveTab('list');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-luxury w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shadow-sm"><ShieldCheck className="w-5 h-5" /></div>
            <div><h3 className="font-extrabold text-slate-900 text-lg">Panel de Administración Express</h3><p className="text-xs text-slate-500 font-medium">Gestión de catálogo y precios</p></div>
          </div>
          <button onClick={() => setIsOpen(false)} className="w-9 h-9 rounded-xl bg-white hover:bg-slate-200/60 text-slate-500 transition flex items-center justify-center border border-slate-200"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex space-x-2">
            <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${activeTab === 'list' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}`}><Tv className="w-4 h-4" />Lista ({products.length})</button>
            <button onClick={() => { setEditingProduct(null); setSimpleName(''); setActiveTab('edit'); }} className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${activeTab === 'edit' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}`}><Plus className="w-4 h-4" />Crear Producto</button>
          </div>
          <button onClick={() => { ProductRepository.resetToDefaults(); refreshProducts(); }} className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 transition border border-slate-200 flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" />Restablecer</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'list' ? (
            <AdminProductList products={products} onToggleAvailability={(id) => { ProductRepository.toggleAvailability(id); refreshProducts(); }} onEdit={(p) => { setEditingProduct(p); setSimpleName(p.name); setActiveTab('edit'); }} onDelete={(id) => { ProductRepository.deleteProduct(id); refreshProducts(); }} />
          ) : (
            <AdminProductForm simpleName={simpleName} setSimpleName={setSimpleName} simpleCategory={simpleCategory} setSimpleCategory={setSimpleCategory} simplePrice1M={simplePrice1M} setSimplePrice1M={setSimplePrice1M} onSubmit={handleSave} onCancel={() => setActiveTab('list')} />
          )}
        </div>
      </div>
    </div>
  );
};
