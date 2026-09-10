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
  Lock,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp
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

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onLogout, onGoToStore }) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'payments' | 'security'>('catalog');
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(() => AdminRepository.getPaymentConfig());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Catalog Form States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [creationKind, setCreationKind] = useState<'single' | 'combo'>('single');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Simplified Form Inputs
  const [simpleName, setSimpleName] = useState<string>('');
  const [simpleCategory, setSimpleCategory] = useState<'cine' | 'musica' | 'deportes'>('cine');
  const [simplePrice1M, setSimplePrice1M] = useState<number>(15000);
  
  // Combo Form Inputs
  const [comboName, setComboName] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Netflix', 'Disney+']);
  const [comboPrice1M, setComboPrice1M] = useState<number>(32000);

  // Raw Product Form State (for Advanced edits)
  const [productForm, setProductForm] = useState<Partial<Product>>({});

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
    setCreationKind('single');
    setSimpleName('');
    setSimpleCategory('cine');
    setSimplePrice1M(15000);
    setComboName('');
    setSelectedPlatforms(['Netflix', 'Disney+']);
    setComboPrice1M(32000);
    setShowAdvanced(false);
    setIsFormOpen(true);
  };

  const handleStartEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({ ...prod });
    setShowAdvanced(true);
    setIsFormOpen(true);
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

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      // Editing existing product
      if (!productForm.name) {
        alert('Ingresa el nombre del producto.');
        return;
      }
      ProductRepository.updateProduct(editingProduct.id, productForm);
      handleNotify(`Producto "${productForm.name}" modificado con éxito`);
    } else {
      // Creating NEW product using simple / combo mode
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
              },
              regularPrices: {
                '1m': price1M + 10000,
                '3m': Math.round((price1M * 4) / 1000) * 1000,
                '6m': Math.round((price1M * 7.5) / 1000) * 1000,
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
              },
              regularPrices: {
                '1m': Math.round((price1M * 3.5) / 1000) * 1000,
                '3m': Math.round((price1M * 9) / 1000) * 1000,
                '6m': Math.round((price1M * 16) / 1000) * 1000,
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
        // Combo Creation
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
              },
              regularPrices: {
                '1m': price1M + 15000,
                '3m': Math.round((price1M * 4) / 1000) * 1000,
                '6m': Math.round((price1M * 7.5) / 1000) * 1000,
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
              },
              regularPrices: {
                '1m': Math.round((price1M * 3) / 1000) * 1000,
                '3m': Math.round((price1M * 8) / 1000) * 1000,
                '6m': Math.round((price1M * 15) / 1000) * 1000,
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
              Todos los cambios que realices aquí se guardan localmente y se actualizan al instante en la tienda pública.
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
                  <p className="text-xs text-slate-500 font-medium">Crea nuevos servicios individuales o combos multi-plataforma en 3 pasos.</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleStartCreateProduct}
                    className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-700/20 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Nuevo Producto / Combo
                  </button>

                  <button
                    onClick={handleResetCatalog}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-extrabold px-3 py-2.5 rounded-xl transition border border-slate-200 flex items-center gap-1.5"
                    title="Restablecer los productos originales por defecto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restablecer
                  </button>
                </div>
              </div>

              {/* SIMPLIFIED PRODUCT / COMBO CREATION FORM */}
              {isFormOpen && (
                <div className="bg-white p-6 rounded-3xl border-2 border-blue-600 shadow-xl space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-700" />
                      {editingProduct ? `Editando Servicio: ${editingProduct.name}` : 'Crear Producto / Combo Express'}
                    </h4>
                    <button
                      onClick={() => setIsFormOpen(false)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-700"
                    >
                      Cancelar
                    </button>
                  </div>

                  {!editingProduct && (
                    /* Switcher: Servicio Individual vs Combo */
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

                  <form onSubmit={handleSaveProductForm} className="space-y-6">

                    {/* FORM FOR SINGLE PRODUCT */}
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
                              onChange={(e) => setSimpleCategory(e.target.value as 'cine' | 'musica' | 'deportes')}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                            >
                              <option value="cine">Cine y Series (Películas / Shows)</option>
                              <option value="musica">Música y Podcasts</option>
                              <option value="deportes">Deportes en Vivo (ESPN / F1)</option>
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
                          <span>Calcularemos automáticamente precios para 3m, 6m y Cuentas Completas para que no tengas que llenar más campos.</span>
                        </div>
                      </div>
                    )}

                    {/* FORM FOR COMBO CREATION */}
                    {!editingProduct && creationKind === 'combo' && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Combo</label>
                            <input
                              type="text"
                              value={comboName}
                              onChange={(e) => setComboName(e.target.value)}
                              placeholder="Ej. Combo Tríada (Netflix + Disney + Max)"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">* Si se deja vacío se generará con los nombres elegidos.</p>
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

                        {/* Platform Selection Badges */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2">
                            Selecciona las Plataformas que incluye este Combo:
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

                    {/* EDITING EXISTING PRODUCT FORM */}
                    {editingProduct && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Comercial</label>
                            <input
                              type="text"
                              value={productForm.name || ''}
                              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Categoría</label>
                            <select
                              value={productForm.category || 'cine'}
                              onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                            >
                              <option value="cine">Cine y Series</option>
                              <option value="musica">Música</option>
                              <option value="deportes">Deportes</option>
                              <option value="combo">Combo Multi-Plataforma</option>
                            </select>
                          </div>
                        </div>

                        {/* Prices: Pantalla */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                          <h5 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                            Precios Modalidad Pantalla (PIN)
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
                            Precios Modalidad Cuenta Completa
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
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-slate-600 bg-slate-100 hover:bg-slate-200"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-blue-700 hover:bg-blue-800 shadow-md shadow-blue-700/20 flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        {editingProduct ? 'Guardar Cambios' : 'Crear Producto / Combo'}
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
                          {prod.category === 'combo' && (
                            <span className="text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                              Combo
                            </span>
                          )}
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
