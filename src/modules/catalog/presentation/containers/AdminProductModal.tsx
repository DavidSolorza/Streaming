import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Edit3, 
  Trash2, 
  Plus, 
  RotateCcw, 
  Check, 
  Eye, 
  EyeOff, 
  DollarSign, 
  Tag, 
  Tv, 
  Layers,
  Sparkles
} from 'lucide-react';
import { Icon } from '@iconify/react';
import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../infrastructure/productRepository';
import { eventBus } from '@/core/bus/eventBus';

const AVAILABLE_PLATFORMS = [
  { name: 'Netflix', icon: 'logos:netflix-icon', bg: 'bg-red-500/10 text-red-500 border-red-500/20' },
  { name: 'Disney+', icon: 'logos:disney-plus', bg: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  { name: 'Max', icon: 'simple-icons:max', bg: 'bg-blue-600/10 text-blue-500 border-blue-600/20' },
  { name: 'Prime Video', icon: 'simple-icons:amazonprime', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { name: 'Spotify', icon: 'logos:spotify-icon', bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { name: 'Crunchyroll', icon: 'simple-icons:crunchyroll', bg: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  { name: 'YouTube Premium', icon: 'logos:youtube-icon', bg: 'bg-rose-500/10 text-rose-600 border-rose-500/20' },
  { name: 'Paramount+', icon: 'simple-icons:paramountplus', bg: 'bg-blue-800/10 text-blue-700 border-blue-800/20' },
  { name: 'Apple TV+', icon: 'logos:apple', bg: 'bg-slate-900/10 text-slate-800 border-slate-900/20' }
];

export const AdminProductModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'edit'>('list');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Simplified Form States
  const [creationKind, setCreationKind] = useState<'single' | 'combo'>('single');
  const [simpleName, setSimpleName] = useState<string>('');
  const [simpleCategory, setSimpleCategory] = useState<'cine' | 'musica' | 'deportes'>('cine');
  const [simplePrice1M, setSimplePrice1M] = useState<number>(15000);
  
  // Combo Form States
  const [comboName, setComboName] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Netflix', 'Disney+']);
  const [comboPrice1M, setComboPrice1M] = useState<number>(32000);

  // Raw Product Form State (for Advanced edits)
  const [productForm, setProductForm] = useState<Partial<Product>>({});

  const refreshProducts = () => {
    setProducts(ProductRepository.getProducts());
  };

  useEffect(() => {
    const unSubOpen = eventBus.on('ADMIN:OPEN_MODAL', () => {
      refreshProducts();
      setIsOpen(true);
    });

    const unSubClose = eventBus.on('ADMIN:CLOSE_MODAL', () => {
      setIsOpen(false);
    });

    const unSubProducts = eventBus.on('CATALOG:PRODUCTS_CHANGED', (newProducts) => {
      setProducts(newProducts);
    });

    const unSubEdit = eventBus.on('ADMIN:EDIT_PRODUCT', (prod) => {
      refreshProducts();
      setEditingProduct(prod);
      setProductForm({ ...prod });
      setActiveTab('edit');
      setIsOpen(true);
    });

    return () => {
      unSubOpen();
      unSubClose();
      unSubProducts();
      unSubEdit();
    };
  }, []);

  const handleNotify = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleToggleAvailability = (id: number) => {
    const updated = ProductRepository.toggleAvailability(id);
    if (updated) {
      handleNotify(`Estado de "${updated.name}" actualizado`);
    }
  };

  const handleDeleteProduct = (id: number, name: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar "${name}" del catálogo?`)) {
      ProductRepository.deleteProduct(id);
      handleNotify(`Producto "${name}" eliminado correctamente`);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('¿Restablecer todo el catálogo a los datos originales por defecto?')) {
      ProductRepository.resetToDefaults();
      handleNotify('Catálogo restablecido por defecto');
    }
  };

  const handleStartCreate = () => {
    setEditingProduct(null);
    setCreationKind('single');
    setSimpleName('');
    setSimpleCategory('cine');
    setSimplePrice1M(15000);
    setComboName('');
    setSelectedPlatforms(['Netflix', 'Disney+']);
    setComboPrice1M(32000);
    setActiveTab('edit');
  };

  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setProductForm({ ...product });
    setActiveTab('edit');
  };

  const handleTogglePlatformSelection = (platName: string) => {
    if (selectedPlatforms.includes(platName)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platName));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, platName]);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      if (!productForm.name) {
        alert('Ingresa el nombre del producto.');
        return;
      }
      ProductRepository.updateProduct(editingProduct.id, productForm);
      handleNotify(`Producto "${productForm.name}" modificado con éxito`);
    } else {
      if (creationKind === 'single') {
        if (!simpleName.trim()) {
          alert('Por favor ingresa el nombre del servicio.');
          return;
        }

        const price1M = Number(simplePrice1M) || 15000;
        const brandMatch = AVAILABLE_PLATFORMS.find(p => simpleName.toLowerCase().includes(p.name.toLowerCase()));

        const newSingleProduct: Omit<Product, 'id'> = {
          name: simpleName.trim(),
          brand: brandMatch ? brandMatch.name : simpleName.trim(),
          category: simpleCategory,
          brandGlow: 'brand-glow-netflix',
          iconName: brandMatch ? brandMatch.icon : 'logos:netflix-icon',
          logoBg: brandMatch ? brandMatch.bg : 'bg-blue-500/10 text-blue-600 border-blue-500/20',
          available: true,
          bestseller: false,
          badges: ['4K UHD', 'Entrega Inmediata', 'Renovable'],
          searchTags: [simpleName.toLowerCase(), simpleCategory],
          modes: {
            pantalla: {
              label: '1 Pantalla (Perfil con PIN)',
              devices: '1 Dispositivo simultáneo',
              quality: '4K Ultra HD + HDR',
              access: 'Perfil privado con PIN de 4 dígitos',
              prices: {
                '1m': price1M,
                '3m': Math.round((price1M * 2.7) / 1000) * 1000,
                '6m': Math.round((price1M * 5) / 1000) * 1000,
                '12m': Math.round((price1M * 9) / 1000) * 1000,
              },
              regularPrices: {
                '1m': price1M + 10000,
                '3m': Math.round((price1M * 4) / 1000) * 1000,
                '6m': Math.round((price1M * 7.5) / 1000) * 1000,
                '12m': Math.round((price1M * 13) / 1000) * 1000,
              }
            },
            cuenta: {
              label: 'Cuenta Completa (Hogar)',
              devices: '4 Dispositivos simultáneos',
              quality: '4K Ultra HD + Dolby Atmos',
              access: 'Correo y clave propia renovable',
              prices: {
                '1m': Math.round((price1M * 2.5) / 1000) * 1000,
                '3m': Math.round((price1M * 6.5) / 1000) * 1000,
                '6m': Math.round((price1M * 12) / 1000) * 1000,
                '12m': Math.round((price1M * 20) / 1000) * 1000,
              },
              regularPrices: {
                '1m': Math.round((price1M * 3.5) / 1000) * 1000,
                '3m': Math.round((price1M * 9) / 1000) * 1000,
                '6m': Math.round((price1M * 16) / 1000) * 1000,
                '12m': Math.round((price1M * 26) / 1000) * 1000,
              }
            }
          },
          includes: [
            `Acceso completo al catálogo oficial de ${simpleName.trim()}`,
            'Calidad Ultra HD 4K con descargas habilitadas',
            'Soporte técnico y garantía extendida por WhatsApp'
          ]
        };

        ProductRepository.addProduct(newSingleProduct);
        handleNotify(`Servicio "${simpleName.trim()}" creado correctamente`);
      } else {
        const finalComboName = comboName.trim() || `Combo Multi-Plataforma (${selectedPlatforms.join(' + ')})`;
        const price1M = Number(comboPrice1M) || 32000;

        const newComboProduct: Omit<Product, 'id'> = {
          name: finalComboName,
          brand: 'Combo VIP',
          category: 'combo',
          brandGlow: 'brand-glow-disney',
          iconName: 'logos:disney-plus',
          logoBg: 'bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 text-blue-600 border-blue-500/20',
          available: true,
          bestseller: true,
          badges: [`Combo ${selectedPlatforms.length} en 1`, 'Entrega Inmediata', 'Ahorro Especial'],
          searchTags: ['combo', ...selectedPlatforms.map(p => p.toLowerCase())],
          modes: {
            pantalla: {
              label: `Perfiles en ${selectedPlatforms.length} Plataformas`,
              devices: `${selectedPlatforms.length} Servicios Activos`,
              quality: '4K Ultra HD en todos los servicios',
              access: 'Perfiles privados con PIN de seguridad',
              prices: {
                '1m': price1M,
                '3m': Math.round((price1M * 2.7) / 1000) * 1000,
                '6m': Math.round((price1M * 5) / 1000) * 1000,
                '12m': Math.round((price1M * 9) / 1000) * 1000,
              },
              regularPrices: {
                '1m': price1M + 15000,
                '3m': Math.round((price1M * 4) / 1000) * 1000,
                '6m': Math.round((price1M * 7.5) / 1000) * 1000,
                '12m': Math.round((price1M * 12) / 1000) * 1000,
              }
            },
            cuenta: {
              label: `Cuentas Completas (${selectedPlatforms.length} Servicios)`,
              devices: 'Todos los dispositivos activados',
              quality: '4K Ultra HD + Dolby Atmos',
              access: 'Acceso total a cuentas familiares',
              prices: {
                '1m': Math.round((price1M * 2.2) / 1000) * 1000,
                '3m': Math.round((price1M * 5.8) / 1000) * 1000,
                '6m': Math.round((price1M * 11) / 1000) * 1000,
                '12m': Math.round((price1M * 18) / 1000) * 1000,
              },
              regularPrices: {
                '1m': Math.round((price1M * 3) / 1000) * 1000,
                '3m': Math.round((price1M * 8) / 1000) * 1000,
                '6m': Math.round((price1M * 15) / 1000) * 1000,
                '12m': Math.round((price1M * 24) / 1000) * 1000,
              }
            }
          },
          includes: [
            `Incluye cuentas en: ${selectedPlatforms.join(', ')}`,
            'Acceso a catálogo completo sin restricciones',
            'Soporte técnico directo vía WhatsApp'
          ]
        };

        ProductRepository.addProduct(newComboProduct);
        handleNotify(`Combo "${finalComboName}" creado con éxito`);
      }
    }

    setActiveTab('list');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-luxury w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                Panel de Administración Express
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Creación simplificada de servicios y combos multi-plataforma
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 rounded-xl bg-white hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 transition flex items-center justify-center border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center gap-2 text-emerald-800 text-xs font-bold animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600" />
            {successMessage}
          </div>
        )}

        {/* Tab Controls & Primary Actions */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                activeTab === 'list' 
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Tv className="w-4 h-4" />
              Lista de Productos ({products.length})
            </button>
            <button
              onClick={handleStartCreate}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                activeTab === 'edit' && !editingProduct 
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Plus className="w-4 h-4" />
              {editingProduct ? `Editando: ${editingProduct.name}` : 'Crear Producto / Combo'}
            </button>
          </div>

          <button
            onClick={handleResetDefaults}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition border border-slate-200 flex items-center gap-1.5 ml-auto"
            title="Restablecer el catálogo por defecto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'list' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Product Info */}
                    <div className="flex items-center space-x-3.5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shadow-sm ${prod.logoBg}`}>
                        <Icon icon={prod.iconName} className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 text-sm">{prod.name}</h4>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                            prod.available 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {prod.available ? 'Entrega Inmediata' : 'Agotado'}
                          </span>
                          {prod.category === 'combo' && (
                            <span className="text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                              Combo
                            </span>
                          )}
                        </div>

                        {/* Prices Summary */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-600">
                          <div>
                            <span className="font-semibold text-slate-400">Pantalla 1m:</span>{' '}
                            <span className="font-bold text-slate-900">${prod.modes.pantalla.prices['1m'].toLocaleString('es-CO')}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-400">Cuenta 1m:</span>{' '}
                            <span className="font-bold text-slate-900">${prod.modes.cuenta.prices['1m'].toLocaleString('es-CO')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <button
                        onClick={() => handleToggleAvailability(prod.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition border flex items-center gap-1.5 ${
                          prod.available
                            ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-amber-50 hover:text-amber-700'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                        title={prod.available ? 'Marcar como Agotado' : 'Marcar como Disponible'}
                      >
                        {prod.available ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {prod.available ? 'Pausar' : 'Activar'}
                      </button>

                      <button
                        onClick={() => handleStartEdit(prod)}
                        className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Editar
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
                        title="Eliminar del catálogo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Form Tab: Add / Edit Product */
            <form onSubmit={handleSaveProduct} className="space-y-6">
              {!editingProduct && (
                <div className="grid grid-cols-2 gap-3 bg-slate-100 p-1.5 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setCreationKind('single')}
                    className={`py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 ${
                      creationKind === 'single'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Tv className="w-4 h-4" />
                    Servicio Individual (Nombre, Tipo, Precio)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreationKind('combo')}
                    className={`py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 ${
                      creationKind === 'combo'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    Combo Multi-Plataforma (Seleccionar Plataformas)
                  </button>
                </div>
              )}

              {!editingProduct && creationKind === 'single' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Servicio</label>
                      <input
                        type="text"
                        value={simpleName}
                        onChange={(e) => setSimpleName(e.target.value)}
                        placeholder="Ej. Paramount+ Ultra HD"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Servicio</label>
                      <select
                        value={simpleCategory}
                        onChange={(e) => setSimpleCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                      >
                        <option value="cine">Cine y Series (Películas / Shows)</option>
                        <option value="musica">Música y Podcasts</option>
                        <option value="deportes">Deportes en Vivo (ESPN / F1)</option>
                        <option value="trabajo">Trabajo & Edición (Canva, Gemini, CapCut)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Precio 1 Mes ($ COP)</label>
                      <input
                        type="number"
                        value={simplePrice1M}
                        onChange={(e) => setSimplePrice1M(Number(e.target.value))}
                        placeholder="15000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none text-emerald-700 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-emerald-50/60 border border-emerald-200/80 p-3 rounded-2xl text-[11px] text-emerald-800 font-medium flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Calcularemos automáticamente precios de 3m, 6m y Cuentas Completas para mayor rapidez.</span>
                  </div>
                </div>
              )}

              {!editingProduct && creationKind === 'combo' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Combo</label>
                      <input
                        type="text"
                        value={comboName}
                        onChange={(e) => setComboName(e.target.value)}
                        placeholder="Ej. Combo Dúo (Netflix + Disney+)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Precio Combo 1 Mes ($ COP)</label>
                      <input
                        type="number"
                        value={comboPrice1M}
                        onChange={(e) => setComboPrice1M(Number(e.target.value))}
                        placeholder="32000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none text-emerald-700 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Selecciona las Plataformas que contiene el Combo:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {AVAILABLE_PLATFORMS.map((plat) => {
                        const isSelected = selectedPlatforms.includes(plat.name);
                        return (
                          <button
                            type="button"
                            key={plat.name}
                            onClick={() => handleTogglePlatformSelection(plat.name)}
                            className={`p-3 rounded-2xl border text-left transition flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-blue-50 border-blue-500 text-blue-900 font-extrabold shadow-sm'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon icon={plat.icon} className="w-5 h-5 shrink-0" />
                              <span className="text-xs">{plat.name}</span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-blue-700 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {editingProduct && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs ${productForm.logoBg || 'bg-blue-500/10'}`}>
                      <Icon icon={productForm.iconName || 'logos:netflix-icon'} className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">Detalles y Edición Completa: {editingProduct.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Modifica los precios por mes (1m, 3m, 6m, 12m), categoría, estado y beneficios.</p>
                    </div>
                  </div>

                  {/* Información Principal */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Comercial</label>
                      <input
                        type="text"
                        value={productForm.name || ''}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Marca / Proveedor</label>
                      <input
                        type="text"
                        value={productForm.brand || ''}
                        onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Categoría</label>
                      <select
                        value={productForm.category || 'cine'}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                      >
                        <option value="cine">Cine y Series</option>
                        <option value="musica">Música & Audio</option>
                        <option value="deportes">Deportes en Vivo</option>
                        <option value="trabajo">Trabajo & Edición (Canva, Gemini, CapCut)</option>
                        <option value="combo">Combo Multi-Plataforma</option>
                      </select>
                    </div>
                  </div>

                  {/* Badges & Disponibilidad */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Etiquetas / Badges (separados por coma)</label>
                      <input
                        type="text"
                        value={Array.isArray(productForm.badges) ? productForm.badges.join(', ') : ''}
                        onChange={(e) => setProductForm({ ...productForm, badges: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        placeholder="4K UHD, Entrega Inmediata, Renovable"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>

                    <div className="flex items-center space-x-6 pt-5">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!productForm.available}
                          onChange={(e) => setProductForm({ ...productForm, available: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        Disponible / Entrega Inmediata
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!productForm.bestseller}
                          onChange={(e) => setProductForm({ ...productForm, bestseller: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        Más Vendido (Bestseller)
                      </label>
                    </div>
                  </div>

                  {/* PRECIOS 1 PANTALLA POR MES */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Tv className="w-4 h-4 text-blue-600" />
                      Precios 1 Pantalla (Perfil con PIN)
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(['1m', '3m', '6m', '12m'] as const).map((durKey) => (
                        <div key={`pantalla-${durKey}`}>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">
                            {durKey === '1m' ? '1 Mes' : durKey === '3m' ? '3 Meses' : durKey === '6m' ? '6 Meses' : '12 Meses'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-2 text-slate-400 text-xs font-bold">$</span>
                            <input
                              type="number"
                              value={productForm.modes?.pantalla?.prices?.[durKey] ?? 0}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setProductForm({
                                  ...productForm,
                                  modes: {
                                    ...productForm.modes!,
                                    pantalla: {
                                      ...productForm.modes!.pantalla,
                                      prices: {
                                        ...productForm.modes!.pantalla.prices,
                                        [durKey]: val
                                      }
                                    }
                                  }
                                });
                              }}
                              className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 font-mono focus:ring-2 focus:ring-blue-600 outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PRECIOS CUENTA COMPLETA POR MES */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      Precios Cuenta Completa (Hogar)
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(['1m', '3m', '6m', '12m'] as const).map((durKey) => (
                        <div key={`cuenta-${durKey}`}>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">
                            {durKey === '1m' ? '1 Mes' : durKey === '3m' ? '3 Meses' : durKey === '6m' ? '6 Meses' : '12 Meses'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-2 text-slate-400 text-xs font-bold">$</span>
                            <input
                              type="number"
                              value={productForm.modes?.cuenta?.prices?.[durKey] ?? 0}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setProductForm({
                                  ...productForm,
                                  modes: {
                                    ...productForm.modes!,
                                    cuenta: {
                                      ...productForm.modes!.cuenta,
                                      prices: {
                                        ...productForm.modes!.cuenta.prices,
                                        [durKey]: val
                                      }
                                    }
                                  }
                                });
                              }}
                              className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 font-mono focus:ring-2 focus:ring-blue-600 outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-blue-700 hover:bg-blue-800 transition shadow-lg shadow-blue-700/20 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto / Combo'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
