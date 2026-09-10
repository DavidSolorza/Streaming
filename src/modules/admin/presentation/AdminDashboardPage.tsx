import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Tv, 
  CreditCard, 
  Key, 
  LogOut, 
  ArrowLeft, 
  Plus, 
  RotateCcw, 
  Check, 
  Eye, 
  EyeOff, 
  Edit3, 
  Trash2, 
  DollarSign, 
  Tag, 
  Phone, 
  MessageCircle, 
  Building2, 
  Wallet, 
  Save, 
  Lock
} from 'lucide-react';
import { Icon } from '@iconify/react';
import { Product } from '../../catalog/domain/entities/Product';
import { ProductRepository } from '../../catalog/infrastructure/productRepository';
import { PaymentConfig } from '../domain/entities/AdminConfig';
import { AdminRepository } from '../infrastructure/adminRepository';

interface AdminDashboardPageProps {
  onLogout: () => void;
  onGoToStore: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onLogout, onGoToStore }) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'payments' | 'security'>('catalog');
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(() => AdminRepository.getPaymentConfig());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Catalog Form States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
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

  // Password Form States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setProducts(ProductRepository.getProducts());
  }, []);

  const handleNotify = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleToggleAvailability = (id: number) => {
    const updated = ProductRepository.toggleAvailability(id);
    if (updated) {
      setProducts(ProductRepository.getProducts());
      handleNotify(`Disponibilidad de "${updated.name}" actualizada`);
    }
  };

  const handleDeleteProduct = (id: number, name: string) => {
    if (window.confirm(`¿Deseas eliminar permanentemente "${name}" del catálogo?`)) {
      ProductRepository.deleteProduct(id);
      setProducts(ProductRepository.getProducts());
      handleNotify(`Producto "${name}" eliminado`);
    }
  };

  const handleResetCatalog = () => {
    if (window.confirm('¿Restablecer todo el catálogo de productos por defecto?')) {
      const defaults = ProductRepository.resetToDefaults();
      setProducts(defaults);
      handleNotify('Catálogo de productos restablecido');
    }
  };

  const handleStartCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
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
      includes: ['Acceso al catálogo completo sin restricciones', 'Soporte técnico directo']
    });
    setIsFormOpen(true);
  };

  const handleStartEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({ ...prod });
    setIsFormOpen(true);
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.brand) {
      alert('Completa el nombre y la marca del producto.');
      return;
    }

    if (editingProduct) {
      ProductRepository.updateProduct(editingProduct.id, productForm);
      handleNotify(`Producto "${productForm.name}" modificado con éxito`);
    } else {
      ProductRepository.addProduct(productForm as Omit<Product, 'id'>);
      handleNotify(`Nuevo producto "${productForm.name}" agregado con éxito`);
    }

    setProducts(ProductRepository.getProducts());
    setIsFormOpen(false);
  };

  const handleSavePaymentConfig = (e: React.FormEvent) => {
    e.preventDefault();
    AdminRepository.savePaymentConfig(paymentConfig);
    handleNotify('Métodos de pago y números de contacto actualizados correctamente');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    AdminRepository.setAdminPassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
    handleNotify('Contraseña de administración actualizada correctamente');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Status */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm shadow-md text-white">
              4S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white leading-none">Mundo Admin</span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                  Sesión Activa
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Control Centralizado Cuentas Stream</span>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onGoToStore}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl transition font-extrabold flex items-center gap-1.5 border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4 text-blue-400" />
              Ver Tienda Pública
            </button>

            <button
              onClick={onLogout}
              className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl transition font-extrabold flex items-center gap-1.5 shadow-md shadow-rose-600/20"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>

        </div>
      </header>

      {/* Success Floating Notification */}
      {successMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-fadeIn border border-emerald-500/40">
          <Check className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="md:col-span-1 space-y-2">
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`w-full px-4 py-3 rounded-xl text-xs font-extrabold transition flex items-center gap-2.5 ${
                activeTab === 'catalog'
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Tv className="w-4 h-4" />
              Catálogo & Precios ({products.length})
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full px-4 py-3 rounded-xl text-xs font-extrabold transition flex items-center gap-2.5 ${
                activeTab === 'payments'
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Métodos de Pago & Contacto
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full px-4 py-3 rounded-xl text-xs font-extrabold transition flex items-center gap-2.5 ${
                activeTab === 'security'
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Key className="w-4 h-4" />
              Seguridad & Clave
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200/60 p-4 rounded-2xl text-xs text-blue-900 space-y-1">
            <h5 className="font-extrabold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              Modo Administrador
            </h5>
            <p className="text-[11px] text-blue-700/80 font-medium">
              Todos los cambios que realices aquí se guardan localmente y se actualizan al instante en la tienda pública del cliente.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="md:col-span-3 space-y-6">
          
          {/* TAB 1: CATALOG MANAGEMENT */}
          {activeTab === 'catalog' && (
            <div className="space-y-6">
              
              {/* Header & Controls */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Gestión del Catálogo de Productos</h3>
                  <p className="text-xs text-slate-500 font-medium">Edita precios por mes, disponibilidad (stock) o crea nuevos servicios.</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleStartCreateProduct}
                    className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-700/20 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Nuevo Producto
                  </button>

                  <button
                    onClick={handleResetCatalog}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-extrabold px-3 py-2.5 rounded-xl transition border border-slate-200 flex items-center gap-1.5"
                    title="Restablecer los 6 productos originales por defecto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restablecer
                  </button>
                </div>
              </div>

              {/* Product Form Modal / Section */}
              {isFormOpen && (
                <div className="bg-white p-6 rounded-3xl border-2 border-blue-600 shadow-xl space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <Tag className="w-5 h-5 text-blue-700" />
                      {editingProduct ? `Editando Servicio: ${editingProduct.name}` : 'Crear Nuevo Servicio de Streaming'}
                    </h4>
                    <button
                      onClick={() => setIsFormOpen(false)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-700"
                    >
                      Cancelar
                    </button>
                  </div>

                  <form onSubmit={handleSaveProductForm} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Comercial</label>
                        <input
                          type="text"
                          value={productForm.name || ''}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          placeholder="Ej. Netflix Ultra HD 4K"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Marca Principal</label>
                        <input
                          type="text"
                          value={productForm.brand || ''}
                          onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                          placeholder="Ej. Netflix"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Categoría</label>
                        <select
                          value={productForm.category || 'cine'}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value as 'cine' | 'musica' })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                        >
                          <option value="cine">Cine y Series (Películas / TV Shows)</option>
                          <option value="musica">Música y Audio Streaming</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Icono Iconify ID</label>
                        <input
                          type="text"
                          value={productForm.iconName || ''}
                          onChange={(e) => setProductForm({ ...productForm, iconName: e.target.value })}
                          placeholder="Ej. logos:netflix-icon"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-600 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.available ?? true}
                          onChange={(e) => setProductForm({ ...productForm, available: e.target.checked })}
                          className="w-4 h-4 rounded text-blue-700 focus:ring-blue-600"
                        />
                        <span className="text-xs font-bold text-slate-800">Disponible (En Stock)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.bestseller ?? false}
                          onChange={(e) => setProductForm({ ...productForm, bestseller: e.target.checked })}
                          className="w-4 h-4 rounded text-blue-700 focus:ring-blue-600"
                        />
                        <span className="text-xs font-bold text-slate-800">Etiqueta Más Vendido</span>
                      </label>
                    </div>

                    {/* Prices: Pantalla */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <h5 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        Precios Modalidad 1: Pantalla (Perfil con PIN)
                      </h5>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">1 Mes ($ COP)</label>
                          <input
                            type="number"
                            value={productForm.modes?.pantalla.prices['1m'] || 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setProductForm({
                                ...productForm,
                                modes: {
                                  ...productForm.modes!,
                                  pantalla: {
                                    ...productForm.modes!.pantalla,
                                    prices: { ...productForm.modes!.pantalla.prices, '1m': val }
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
                            value={productForm.modes?.pantalla.prices['3m'] || 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setProductForm({
                                ...productForm,
                                modes: {
                                  ...productForm.modes!,
                                  pantalla: {
                                    ...productForm.modes!.pantalla,
                                    prices: { ...productForm.modes!.pantalla.prices, '3m': val }
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
                            value={productForm.modes?.pantalla.prices['6m'] || 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setProductForm({
                                ...productForm,
                                modes: {
                                  ...productForm.modes!,
                                  pantalla: {
                                    ...productForm.modes!.pantalla,
                                    prices: { ...productForm.modes!.pantalla.prices, '6m': val }
                                  }
                                }
                              });
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Prices: Cuenta */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <h5 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        Precios Modalidad 2: Cuenta Completa (Hogar)
                      </h5>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">1 Mes ($ COP)</label>
                          <input
                            type="number"
                            value={productForm.modes?.cuenta.prices['1m'] || 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setProductForm({
                                ...productForm,
                                modes: {
                                  ...productForm.modes!,
                                  cuenta: {
                                    ...productForm.modes!.cuenta,
                                    prices: { ...productForm.modes!.cuenta.prices, '1m': val }
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
                            value={productForm.modes?.cuenta.prices['3m'] || 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setProductForm({
                                ...productForm,
                                modes: {
                                  ...productForm.modes!,
                                  cuenta: {
                                    ...productForm.modes!.cuenta,
                                    prices: { ...productForm.modes!.cuenta.prices, '3m': val }
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
                            value={productForm.modes?.cuenta.prices['6m'] || 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setProductForm({
                                ...productForm,
                                modes: {
                                  ...productForm.modes!,
                                  cuenta: {
                                    ...productForm.modes!.cuenta,
                                    prices: { ...productForm.modes!.cuenta.prices, '6m': val }
                                  }
                                }
                              });
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="px-4 py-2 rounded-xl text-xs font-extrabold text-slate-600 bg-slate-100 hover:bg-slate-200"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl text-xs font-extrabold text-white bg-blue-700 hover:bg-blue-800 shadow-md shadow-blue-700/20"
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Product List Grid */}
              <div className="space-y-3">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
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
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-600">
                          <div>
                            <span className="text-slate-400 font-medium">Pantalla 1m:</span>{' '}
                            <span className="font-bold text-slate-900">${prod.modes.pantalla.prices['1m'].toLocaleString('es-CO')}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">Cuenta 1m:</span>{' '}
                            <span className="font-bold text-slate-900">${prod.modes.cuenta.prices['1m'].toLocaleString('es-CO')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

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
                        onClick={() => handleStartEditProduct(prod)}
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
          )}

          {/* TAB 2: PAYMENT METHODS & CONTACT */}
          {activeTab === 'payments' && (
            <form onSubmit={handleSavePaymentConfig} className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                <h3 className="text-xl font-black text-slate-900">Métodos de Pago & Teléfono de Soporte</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Actualiza las cuentas bancarias, números de billeteras digitales y el WhatsApp de soporte oficial.
                </p>
              </div>

              {/* Support Phone */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  WhatsApp Oficial de Soporte y Pedidos
                </h4>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Número de WhatsApp (con código de país 57)</label>
                  <input
                    type="text"
                    value={paymentConfig.whatsappNumber}
                    onChange={(e) => setPaymentConfig({ ...paymentConfig, whatsappNumber: e.target.value })}
                    placeholder="Ej. 573214465418"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                    required
                  />
                  <p className="text-[10px] text-slate-400 font-medium mt-1">* Se usa para los botones de ayuda y el envío de pedidos directo.</p>
                </div>
              </div>

              {/* Nequi */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-fuchsia-600" />
                  Billetera Nequi
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Número de Nequi</label>
                    <input
                      type="text"
                      value={paymentConfig.nequiNumber}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, nequiNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Titular de la Cuenta</label>
                    <input
                      type="text"
                      value={paymentConfig.nequiHolder}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, nequiHolder: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Bancolombia */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  Bancolombia (Ahorros / Convenio)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Número de Cuenta</label>
                    <input
                      type="text"
                      value={paymentConfig.bancolombiaAccount}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, bancolombiaAccount: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Titular de la Cuenta</label>
                    <input
                      type="text"
                      value={paymentConfig.bancolombiaHolder}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, bancolombiaHolder: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Daviplata */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4 text-rose-600" />
                  Daviplata
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Número Daviplata</label>
                    <input
                      type="text"
                      value={paymentConfig.daviplataNumber}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, daviplataNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Titular</label>
                    <input
                      type="text"
                      value={paymentConfig.daviplataHolder}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, daviplataHolder: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-lg shadow-blue-700/20 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Guardar Métodos de Pago
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-black text-slate-900">Seguridad & Contraseña de Administración</h3>
                <p className="text-xs text-slate-500 font-medium">Cambia la clave genérica de acceso para mayor seguridad.</p>
              </div>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nueva Contraseña de Acceso</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 4 caracteres"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirmar Nueva Contraseña</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite la contraseña"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-lg shadow-blue-700/20 flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Actualizar Contraseña
                </button>
              </div>
            </form>
          )}

        </main>

      </div>
    </div>
  );
};
