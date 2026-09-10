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
  AlertCircle
} from 'lucide-react';
import { Icon } from '@iconify/react';
import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../infrastructure/productRepository';
import { eventBus } from '@/core/bus/eventBus';

export const AdminProductModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'edit'>('list');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states for adding/editing product
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    brand: '',
    category: 'cine',
    brandGlow: 'brand-glow-netflix',
    iconName: 'logos:netflix-icon',
    logoBg: 'bg-red-500/10 text-red-500 border-red-500/20',
    available: true,
    bestseller: false,
    badges: ['4K UHD', 'Entrega Inmediata'],
    searchTags: [],
    modes: {
      pantalla: {
        label: '1 Pantalla (Perfil con PIN)',
        devices: '1 Dispositivo simultáneo',
        quality: '4K Ultra HD',
        access: 'Perfil privado con PIN',
        prices: { '1m': 15000, '3m': 40000, '6m': 75000 },
        regularPrices: { '1m': 25000, '3m': 65000, '6m': 120000 }
      },
      cuenta: {
        label: 'Cuenta Completa (Hogar)',
        devices: '4 Dispositivos simultáneos',
        quality: '4K Ultra HD + Dolby',
        access: 'Correo propio renovable',
        prices: { '1m': 40000, '3m': 110000, '6m': 200000 },
        regularPrices: { '1m': 60000, '3m': 150000, '6m': 280000 }
      }
    },
    includes: [
      'Acceso al catálogo completo sin restricciones',
      'Soporte técnico directo vía WhatsApp'
    ]
  });

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

    return () => {
      unSubOpen();
      unSubClose();
      unSubProducts();
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
    setFormData({
      name: '',
      brand: '',
      category: 'cine',
      brandGlow: 'brand-glow-netflix',
      iconName: 'logos:netflix-icon',
      logoBg: 'bg-red-500/10 text-red-500 border-red-500/20',
      available: true,
      bestseller: false,
      badges: ['4K UHD', 'Entrega Inmediata'],
      searchTags: [],
      modes: {
        pantalla: {
          label: '1 Pantalla (Perfil con PIN)',
          devices: '1 Dispositivo simultáneo',
          quality: '4K Ultra HD',
          access: 'Perfil privado con PIN',
          prices: { '1m': 15000, '3m': 40000, '6m': 75000 },
          regularPrices: { '1m': 25000, '3m': 65000, '6m': 120000 }
        },
        cuenta: {
          label: 'Cuenta Completa (Hogar)',
          devices: '4 Dispositivos simultáneos',
          quality: '4K Ultra HD + Dolby',
          access: 'Correo propio renovable',
          prices: { '1m': 40000, '3m': 110000, '6m': 200000 },
          regularPrices: { '1m': 60000, '3m': 150000, '6m': 280000 }
        }
      },
      includes: [
        'Acceso al catálogo completo sin restricciones',
        'Soporte técnico directo vía WhatsApp'
      ]
    });
    setActiveTab('edit');
  };

  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setActiveTab('edit');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.brand) {
      alert('Por favor completa el nombre y la marca del producto.');
      return;
    }

    if (editingProduct) {
      ProductRepository.updateProduct(editingProduct.id, formData);
      handleNotify(`Producto "${formData.name}" actualizado con éxito`);
    } else {
      ProductRepository.addProduct(formData as Omit<Product, 'id'>);
      handleNotify(`Nuevo producto "${formData.name}" añadido con éxito`);
    }

    setActiveTab('list');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow- luxury w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                Panel de Administración de Catálogo
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Gestión en tiempo real de productos, precios y disponibilidad
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
              {editingProduct ? `Editando: ${editingProduct.name}` : 'Añadir Nuevo Producto'}
            </button>
          </div>

          <button
            onClick={handleResetDefaults}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition border border-slate-200 flex items-center gap-1.5 ml-auto"
            title="Restablecer los 6 productos originales"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer Valores
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
                          {prod.bestseller && (
                            <span className="text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                              Más Vendido
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
                            ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
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
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-700" />
                  Información Principal
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Servicio</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej. Netflix Ultra HD 4K"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Marca Principal</label>
                    <input
                      type="text"
                      value={formData.brand || ''}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Ej. Netflix"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Categoría</label>
                    <select
                      value={formData.category || 'cine'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as 'cine' | 'musica' })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                      <option value="cine">Cine y Series (Películas / Shows)</option>
                      <option value="musica">Música y Audio Streaming</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Icono (Iconify ID)</label>
                    <input
                      type="text"
                      value={formData.iconName || ''}
                      onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                      placeholder="Ej. logos:netflix-icon"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.available ?? true}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-700 focus:ring-blue-600"
                    />
                    <span className="text-xs font-bold text-slate-800">Disponible (En Stock)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.bestseller ?? false}
                      onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-700 focus:ring-blue-600"
                    />
                    <span className="text-xs font-bold text-slate-800">Destacar como Más Vendido</span>
                  </label>
                </div>
              </div>

              {/* Prices Section: Pantalla */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Precios Modalidad 1: Pantalla (Perfil con PIN)
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">1 Mes ($ COP)</label>
                    <input
                      type="number"
                      value={formData.modes?.pantalla.prices['1m'] || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData({
                          ...formData,
                          modes: {
                            ...formData.modes!,
                            pantalla: {
                              ...formData.modes!.pantalla,
                              prices: { ...formData.modes!.pantalla.prices, '1m': val }
                            }
                          }
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">3 Meses ($ COP)</label>
                    <input
                      type="number"
                      value={formData.modes?.pantalla.prices['3m'] || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData({
                          ...formData,
                          modes: {
                            ...formData.modes!,
                            pantalla: {
                              ...formData.modes!.pantalla,
                              prices: { ...formData.modes!.pantalla.prices, '3m': val }
                            }
                          }
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">6 Meses ($ COP)</label>
                    <input
                      type="number"
                      value={formData.modes?.pantalla.prices['6m'] || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData({
                          ...formData,
                          modes: {
                            ...formData.modes!,
                            pantalla: {
                              ...formData.modes!.pantalla,
                              prices: { ...formData.modes!.pantalla.prices, '6m': val }
                            }
                          }
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Prices Section: Cuenta Completa */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  Precios Modalidad 2: Cuenta Completa (Hogar)
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">1 Mes ($ COP)</label>
                    <input
                      type="number"
                      value={formData.modes?.cuenta.prices['1m'] || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData({
                          ...formData,
                          modes: {
                            ...formData.modes!,
                            cuenta: {
                              ...formData.modes!.cuenta,
                              prices: { ...formData.modes!.cuenta.prices, '1m': val }
                            }
                          }
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">3 Meses ($ COP)</label>
                    <input
                      type="number"
                      value={formData.modes?.cuenta.prices['3m'] || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData({
                          ...formData,
                          modes: {
                            ...formData.modes!,
                            cuenta: {
                              ...formData.modes!.cuenta,
                              prices: { ...formData.modes!.cuenta.prices, '3m': val }
                            }
                          }
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">6 Meses ($ COP)</label>
                    <input
                      type="number"
                      value={formData.modes?.cuenta.prices['6m'] || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData({
                          ...formData,
                          modes: {
                            ...formData.modes!,
                            cuenta: {
                              ...formData.modes!.cuenta,
                              prices: { ...formData.modes!.cuenta.prices, '6m': val }
                            }
                          }
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

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
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
