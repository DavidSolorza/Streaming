import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Tv, 
  CreditCard, 
  LogOut, 
  ArrowLeft, 
  Plus, 
  RotateCcw, 
  Check, 
  Eye, 
  EyeOff, 
  Trash2, 
  DollarSign, 
  Tag, 
  Phone, 
  MessageCircle, 
  Building2, 
  Wallet, 
  Save, 
  Sparkles,
  Layers,
  Store,
  Flame,
  Edit3
} from 'lucide-react';
import { Icon } from '@iconify/react';
import { Product } from '../../catalog/domain/entities/Product';
import { ProductRepository } from '../../catalog/infrastructure/productRepository';
import { PaymentConfig } from '../domain/entities/AdminConfig';
import { AdminRepository } from '../infrastructure/adminRepository';
import { AdminProductModal } from '../../catalog/presentation/containers/AdminProductModal';
import { eventBus } from '@/core/bus/eventBus';

interface AdminDashboardPageProps {
  onLogout: () => void;
  onGoToStore: () => void;
}

const POPULAR_PLATFORMS = [
  { name: 'Netflix', icon: 'logos:netflix-icon', bg: 'bg-red-500/10 text-red-500 border-red-500/20' },
  { name: 'Disney+', icon: 'logos:disney-plus', bg: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  { name: 'Max', icon: 'simple-icons:max', bg: 'bg-blue-600/10 text-blue-500 border-blue-600/20' },
  { name: 'Prime Video', icon: 'simple-icons:amazonprime', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { name: 'Spotify', icon: 'logos:spotify-icon', bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { name: 'Crunchyroll', icon: 'simple-icons:crunchyroll', bg: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  { name: 'YouTube Premium', icon: 'logos:youtube-icon', bg: 'bg-rose-500/10 text-rose-600 border-rose-500/20' }
];

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onLogout, onGoToStore }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [storeConfig, setStoreConfig] = useState<PaymentConfig>(() => AdminRepository.getPaymentConfig());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fast Creation Form States (Zero friction inline)
  const [createType, setCreateType] = useState<'single' | 'combo'>('single');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'cine' | 'musica' | 'deportes' | 'trabajo'>('cine');
  const [newPrice, setNewPrice] = useState<number>(15000);
  const [comboPlatforms, setComboPlatforms] = useState<string[]>(['Netflix', 'Disney+']);

  useEffect(() => {
    setProducts(ProductRepository.getProducts());
  }, []);

  const notify = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 2800);
  };

  // Instant In-line Price Change (0 submodals)
  const handleInlinePriceChange = (id: number, mode: 'pantalla' | 'cuenta', newPriceVal: number) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    const priceNum = Math.max(0, newPriceVal);
    const updated = ProductRepository.updateProduct(id, {
      modes: {
        ...prod.modes,
        [mode]: {
          ...prod.modes[mode],
          prices: {
            ...prod.modes[mode].prices,
            '1m': priceNum
          }
        }
      }
    });

    if (updated) {
      setProducts(ProductRepository.getProducts());
      notify(`Precio de ${prod.name} actualizado`);
    }
  };

  // 1-Click Availability Toggle
  const handleToggleAvailability = (id: number) => {
    const updated = ProductRepository.toggleAvailability(id);
    if (updated) {
      setProducts(ProductRepository.getProducts());
      notify(`Estado de ${updated.name}: ${updated.available ? 'Entrega Inmediata' : 'Agotado'}`);
    }
  };

  // 1-Click Delete
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`¿Eliminar "${name}" del catálogo?`)) {
      ProductRepository.deleteProduct(id);
      setProducts(ProductRepository.getProducts());
      notify(`Producto "${name}" eliminado`);
    }
  };

  // Reset to Defaults
  const handleResetCatalog = () => {
    if (window.confirm('¿Restablecer todo el catálogo original?')) {
      const defaults = ProductRepository.resetToDefaults();
      setProducts(defaults);
      notify('Catálogo restablecido por defecto');
    }
  };

  // Save Store Branding & Payments
  const handleSaveStoreConfig = (e: React.FormEvent) => {
    e.preventDefault();
    AdminRepository.savePaymentConfig(storeConfig);
    notify('Personalización y métodos de pago guardados con éxito');
  };

  // Fast Product / Combo Creator
  const handleFastCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (createType === 'single') {
      if (!newName.trim()) {
        alert('Ingresa el nombre del servicio.');
        return;
      }

      const pVal = Number(newPrice) || 15000;
      const brandMatch = POPULAR_PLATFORMS.find(p => newName.toLowerCase().includes(p.name.toLowerCase()));

      const created = ProductRepository.addProduct({
        name: newName.trim(),
        brand: brandMatch ? brandMatch.name : newName.trim(),
        category: newCategory,
        brandGlow: 'brand-glow-netflix',
        iconName: brandMatch ? brandMatch.icon : 'logos:netflix-icon',
        logoBg: brandMatch ? brandMatch.bg : 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        available: true,
        bestseller: false,
        badges: ['4K UHD', 'Entrega Inmediata', 'Renovable'],
        searchTags: [newName.toLowerCase(), newCategory],
        modes: {
          pantalla: {
            label: '1 Pantalla (Perfil con PIN)',
            devices: '1 Dispositivo simultáneo',
            quality: '4K Ultra HD + HDR',
            access: 'Perfil privado con PIN de 4 dígitos',
            prices: { '1m': pVal, '3m': Math.round((pVal * 2.7)/1000)*1000, '6m': Math.round((pVal * 5)/1000)*1000, '12m': Math.round((pVal * 9)/1000)*1000 },
            regularPrices: { '1m': pVal + 10000, '3m': Math.round((pVal * 4)/1000)*1000, '6m': Math.round((pVal * 7.5)/1000)*1000, '12m': Math.round((pVal * 13)/1000)*1000 }
          },
          cuenta: {
            label: 'Cuenta Completa (Hogar)',
            devices: '4 Dispositivos simultáneos',
            quality: '4K Ultra HD + Dolby Atmos',
            access: 'Correo y clave propia renovable',
            prices: { '1m': Math.round((pVal * 2.5)/1000)*1000, '3m': Math.round((pVal * 6.5)/1000)*1000, '6m': Math.round((pVal * 12)/1000)*1000, '12m': Math.round((pVal * 20)/1000)*1000 },
            regularPrices: { '1m': Math.round((pVal * 3.5)/1000)*1000, '3m': Math.round((pVal * 9)/1000)*1000, '6m': Math.round((pVal * 16)/1000)*1000, '12m': Math.round((pVal * 26)/1000)*1000 }
          }
        },
        includes: [
          `Acceso completo al catálogo oficial de ${newName.trim()}`,
          'Calidad Ultra HD 4K con descargas habilitadas',
          'Soporte técnico directo vía WhatsApp'
        ]
      });

      setProducts(ProductRepository.getProducts());
      setNewName('');
      notify(`¡Servicio "${created.name}" añadido al catálogo!`);
    } else {
      // Combo Fast Creator
      const nameCombo = newName.trim() || `Combo Special (${comboPlatforms.join(' + ')})`;
      const pVal = Number(newPrice) || 30000;

      const created = ProductRepository.addProduct({
        name: nameCombo,
        brand: 'Combo VIP',
        category: 'combo',
        brandGlow: 'brand-glow-disney',
        iconName: 'logos:disney-plus',
        logoBg: 'bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 text-blue-600 border-blue-500/20',
        available: true,
        bestseller: true,
        badges: [`Combo ${comboPlatforms.length} en 1`, 'Entrega Inmediata', 'Ahorro Especial'],
        searchTags: ['combo', ...comboPlatforms.map(p => p.toLowerCase())],
        modes: {
          pantalla: {
            label: `Perfiles en ${comboPlatforms.length} Plataformas`,
            devices: `${comboPlatforms.length} Servicios Activos`,
            quality: '4K Ultra HD en todos los servicios',
            access: 'Perfiles privados con PIN de seguridad',
            prices: { '1m': pVal, '3m': Math.round((pVal * 2.7)/1000)*1000, '6m': Math.round((pVal * 5)/1000)*1000, '12m': Math.round((pVal * 9)/1000)*1000 },
            regularPrices: { '1m': pVal + 15000, '3m': Math.round((pVal * 4)/1000)*1000, '6m': Math.round((pVal * 7.5)/1000)*1000, '12m': Math.round((pVal * 12)/1000)*1000 }
          },
          cuenta: {
            label: `Cuentas Completas (${comboPlatforms.length} Servicios)`,
            devices: 'Todos los dispositivos activados',
            quality: '4K Ultra HD + Dolby Atmos',
            access: 'Acceso total a cuentas familiares',
            prices: { '1m': Math.round((pVal * 2.2)/1000)*1000, '3m': Math.round((pVal * 5.8)/1000)*1000, '6m': Math.round((pVal * 11)/1000)*1000, '12m': Math.round((pVal * 18)/1000)*1000 },
            regularPrices: { '1m': Math.round((pVal * 3)/1000)*1000, '3m': Math.round((pVal * 8)/1000)*1000, '6m': Math.round((pVal * 15)/1000)*1000, '12m': Math.round((pVal * 24)/1000)*1000 }
          }
        },
        includes: [
          `Incluye cuentas en: ${comboPlatforms.join(', ')}`,
          'Acceso a catálogo completo sin restricciones',
          'Soporte técnico directo vía WhatsApp'
        ]
      });

      setProducts(ProductRepository.getProducts());
      setNewName('');
      notify(`¡Combo "${created.name}" añadido con éxito!`);
    }
  };

  const toggleComboPlatform = (pName: string) => {
    if (comboPlatforms.includes(pName)) {
      if (comboPlatforms.length > 1) {
        setComboPlatforms(comboPlatforms.filter(p => p !== pName));
      }
    } else {
      setComboPlatforms([...comboPlatforms, pName]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 pb-16">
      
      {/* Dynamic Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm text-white shadow-md uppercase">
              {storeConfig.storeName.substring(0, 2) || '4S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base text-white leading-none tracking-tight">
                  {storeConfig.storeName} — Panel de Control 1-Click
                </h1>
              </div>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mt-0.5">
                Personalización Instantánea de tu Tienda de Streaming
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onGoToStore}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition font-extrabold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Ver Mi Tienda
            </button>
            <button
              onClick={onLogout}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl transition font-bold flex items-center gap-1.5 border border-slate-700"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Floating Notification */}
      {successMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-fadeIn border border-emerald-500/40">
          <Check className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full">
        
        {/* BLOQUE 1: PERSONALIZACIÓN DE MARCA Y TELÉFONO EN 1 SOLO CLIC */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-black text-slate-900 text-base">1. Personaliza tu Tienda de Streaming</h2>
                <p className="text-xs text-slate-500 font-medium">Cambia el nombre de tu marca, eslogan y WhatsApp de pedidos.</p>
              </div>
            </div>
            <button
              type="submit"
              form="store-form"
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition shadow-md shadow-blue-700/20 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Guardar Personalización
            </button>
          </div>

          <form id="store-form" onSubmit={handleSaveStoreConfig} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Tienda</label>
              <input
                type="text"
                value={storeConfig.storeName}
                onChange={(e) => setStoreConfig({ ...storeConfig, storeName: e.target.value })}
                placeholder="Ej. Cuentas Stream VIP"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subtítulo / Eslogan</label>
              <input
                type="text"
                value={storeConfig.storeSubtitle}
                onChange={(e) => setStoreConfig({ ...storeConfig, storeSubtitle: e.target.value })}
                placeholder="Ej. Multiplataformas Premium"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp de Pedidos</label>
              <div className="relative">
                <input
                  type="text"
                  value={storeConfig.whatsappNumber}
                  onChange={(e) => setStoreConfig({ ...storeConfig, whatsappNumber: e.target.value })}
                  placeholder="Ej. 573214465418"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                  required
                />
                <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cuentas Nequi / Daviplata</label>
              <input
                type="text"
                value={storeConfig.nequiNumber}
                onChange={(e) => setStoreConfig({ ...storeConfig, nequiNumber: e.target.value, daviplataNumber: e.target.value })}
                placeholder="Ej. 3214465418"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                required
              />
            </div>
          </form>
        </section>

        {/* BLOQUE 2: CREACIÓN ULTRA-SENCILLES DE PRODUCTOS Y COMBOS (EXPEDITA) */}
        <section className="bg-white p-6 rounded-3xl border-2 border-blue-600 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-black text-slate-900 text-base">2. Añadir Servicio o Combo Instantáneo</h2>
                <p className="text-xs text-slate-500 font-medium">Solo pon Nombre, Tipo y Precio. Se agrega a tu catálogo en 1 clic.</p>
              </div>
            </div>

            {/* Type Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setCreateType('single')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 ${
                  createType === 'single' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                Servicio Individual
              </button>
              <button
                type="button"
                onClick={() => setCreateType('combo')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 ${
                  createType === 'combo' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Combo Multi-Plataforma
              </button>
            </div>
          </div>

          <form onSubmit={handleFastCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {createType === 'single' ? 'Nombre del Servicio' : 'Nombre del Combo'}
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={createType === 'single' ? 'Ej. Paramount+ Ultra HD' : 'Ej. Combo Dúo (Netflix + Disney+)'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                  required
                />
              </div>

              {createType === 'single' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoría / Tipo</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="cine">Cine y Series</option>
                    <option value="musica">Música & Audio</option>
                    <option value="deportes">Deportes en Vivo</option>
                    <option value="trabajo">Trabajo & Edición (Canva, Gemini, CapCut)</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Plataformas Incluidas</label>
                  <div className="text-[11px] font-bold text-blue-700 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200 truncate">
                    {comboPlatforms.join(' + ')}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Precio 1 Mes ($ COP)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-emerald-700 font-mono focus:ring-2 focus:ring-blue-600 outline-none"
                  required
                />
              </div>

            </div>

            {/* Platform Selector for Combo */}
            {createType === 'combo' && (
              <div className="pt-2 border-t border-slate-100">
                <span className="block text-xs font-bold text-slate-700 mb-2">
                  Selecciona las plataformas para este combo:
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_PLATFORMS.map((plat) => {
                    const active = comboPlatforms.includes(plat.name);
                    return (
                      <button
                        type="button"
                        key={plat.name}
                        onClick={() => toggleComboPlatform(plat.name)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition flex items-center gap-1.5 ${
                          active
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <Icon icon={plat.icon} className="w-4 h-4" />
                        {plat.name}
                        {active && <Check className="w-3.5 h-3.5 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-extrabold px-6 py-2.5 rounded-xl transition shadow-lg shadow-blue-700/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {createType === 'single' ? 'Añadir Servicio a mi Tienda' : 'Crear Combo en mi Tienda'}
              </button>
            </div>
          </form>
        </section>

        {/* BLOQUE 3: EDICIÓN IN-LINE DE PRECIOS Y ESTADO (0 SUBMODALES / 0 CLICKS ADICIONALES) */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-black text-slate-900 text-base">3. Catálogo Actual (Edición In-line de Precios)</h2>
              <p className="text-xs text-slate-500 font-medium">
                Edita las casillas de precio directamente o activa/pausa el producto en 1 clic sin abrir ventanas emergentes.
              </p>
            </div>

            <button
              onClick={handleResetCatalog}
              className="text-xs font-bold text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-2 rounded-xl transition border border-slate-200 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer Catálogo
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px]">
                  <th className="p-3 rounded-l-xl">Servicio</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Precio 1 Pantalla ($ COP)</th>
                  <th className="p-3">Precio Cuenta Completa ($ COP)</th>
                  <th className="p-3">Estado / Stock</th>
                  <th className="p-3 rounded-r-xl text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prod) => (
                  <tr 
                    key={prod.id} 
                    onClick={(e) => {
                      // Prevent modal if target is input or button
                      const target = e.target as HTMLElement;
                      if (target.tagName === 'INPUT' || target.closest('button') || target.closest('input')) return;
                      eventBus.emit('ADMIN:EDIT_PRODUCT', prod);
                    }}
                    className="hover:bg-blue-50/60 transition cursor-pointer group"
                    title="Haz clic para ver detalles y editar este producto"
                  >
                    
                    {/* Producto */}
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs ${prod.logoBg}`}>
                          <Icon icon={prod.iconName} className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-black text-slate-900 block text-xs group-hover:text-blue-700 transition">{prod.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold">{prod.brand}</span>
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="p-3">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border ${
                        prod.category === 'combo'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : prod.category === 'musica'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : prod.category === 'trabajo'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {prod.category === 'trabajo' ? 'Trabajo & Edición' : prod.category}
                      </span>
                    </td>

                    {/* Precio Pantalla In-line */}
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          defaultValue={prod.modes.pantalla.prices['1m']}
                          onBlur={(e) => handleInlinePriceChange(prod.id, 'pantalla', Number(e.target.value))}
                          className="w-28 px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                        />
                      </div>
                    </td>

                    {/* Precio Cuenta In-line */}
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          defaultValue={prod.modes.cuenta.prices['1m']}
                          onBlur={(e) => handleInlinePriceChange(prod.id, 'cuenta', Number(e.target.value))}
                          className="w-28 px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                        />
                      </div>
                    </td>

                    {/* Estado 1-Click Toggle */}
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleAvailability(prod.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition border flex items-center gap-1.5 ${
                          prod.available
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-amber-50 hover:text-amber-700'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        {prod.available ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        {prod.available ? 'Entrega Inmediata' : 'Agotado'}
                      </button>
                    </td>

                    {/* Acciones */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => eventBus.emit('ADMIN:EDIT_PRODUCT', prod)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition text-[11px] font-extrabold flex items-center gap-1"
                          title="Editar detalles completos"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Eliminar servicio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* Global Admin Modal for Full Details & Editing */}
      <AdminProductModal />
    </div>
  );
};
