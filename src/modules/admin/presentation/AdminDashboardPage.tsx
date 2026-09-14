import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  LogOut, 
  ArrowLeft, 
  Plus, 
  RotateCcw, 
  Check, 
  Eye, 
  EyeOff, 
  Trash2, 
  MessageCircle, 
  Save, 
  Sparkles,
  Store,
  Search,
  X,
  Edit3,
  CreditCard,
  User
} from 'lucide-react';
import { Icon } from '@iconify/react';
import { Product } from '../../catalog/domain/entities/Product';
import { ProductRepository } from '../../catalog/infrastructure/productRepository';
import { PaymentConfig } from '../domain/entities/AdminConfig';
import { AdminRepository } from '../infrastructure/adminRepository';
import { toast } from '@/core/utils/toast';
import { eventBus } from '@/core/bus/eventBus';

interface AdminDashboardPageProps {
  onLogout: () => void;
  onGoToStore: () => void;
}

interface FlatAdminItem {
  key: string;
  productId: number;
  isCanvaProduct: boolean;
  isCustomPlan: boolean;
  planId?: string;
  name: string;
  brand: string;
  category: string;
  iconName: string;
  logoBg: string;
  price: number;
  available: boolean;
  rawProduct: Product;
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
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Modal para Canva Pro únicamente
  const [isCanvaModalOpen, setIsCanvaModalOpen] = useState<boolean>(false);
  const [canvaPriceCorreo, setCanvaPriceCorreo] = useState<number>(18000);
  const [canvaPrice1M, setCanvaPrice1M] = useState<number>(15000);
  const [canvaPrice6M, setCanvaPrice6M] = useState<number>(50000);
  const [canvaPrice12M, setCanvaPrice12M] = useState<number>(80000);

  // Creación rápida de nuevo ítem
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

  // Convertir catálogo en lista limpia: Canva como 1 ítem con modal, el resto filas individuales con input directo
  const flatItems: FlatAdminItem[] = [];
  products.forEach(p => {
    const isCanva = p.brand === 'Canva Pro' || p.name.toLowerCase().includes('canva');

    if (isCanva) {
      flatItems.push({
        key: `${p.id}-canva`,
        productId: p.id,
        isCanvaProduct: true,
        isCustomPlan: true,
        name: 'Canva Pro',
        brand: 'Canva Pro',
        category: p.category,
        iconName: p.iconName,
        logoBg: p.logoBg,
        price: p.modes.pantalla.prices['1m'],
        available: p.available,
        rawProduct: p
      });
    } else if (p.customPlans && p.customPlans.length > 0) {
      // Netflix (Original / Único) u otros ítems con customPlans se muestran como filas directas individuales
      p.customPlans.forEach(plan => {
        flatItems.push({
          key: `${p.id}-${plan.id}`,
          productId: p.id,
          isCanvaProduct: false,
          isCustomPlan: true,
          planId: plan.id,
          name: plan.fullName || `${p.name} (${plan.label})`,
          brand: p.brand,
          category: p.category,
          iconName: p.iconName,
          logoBg: p.logoBg,
          price: plan.price,
          available: p.available,
          rawProduct: p
        });
      });
    } else {
      flatItems.push({
        key: `${p.id}-single`,
        productId: p.id,
        isCanvaProduct: false,
        isCustomPlan: false,
        name: p.name,
        brand: p.brand,
        category: p.category,
        iconName: p.iconName,
        logoBg: p.logoBg,
        price: p.modes.pantalla.prices['1m'],
        available: p.available,
        rawProduct: p
      });
    }
  });

  const filteredItems = flatItems.filter(item => {
    if (!searchFilter.trim()) return true;
    const query = searchFilter.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  // Abrir Modal exclusivo de Canva
  const handleOpenCanvaModal = () => {
    const canvaProd = products.find(p => p.brand === 'Canva Pro' || p.name.toLowerCase().includes('canva'));
    if (canvaProd && canvaProd.customPlans) {
      const pCorreo = canvaProd.customPlans.find(p => p.id === '1m-correo')?.price ?? 18000;
      const p1m = canvaProd.customPlans.find(p => p.id === '1m')?.price ?? 15000;
      const p6m = canvaProd.customPlans.find(p => p.id === '6m')?.price ?? 50000;
      const p12m = canvaProd.customPlans.find(p => p.id === '12m')?.price ?? 80000;
      setCanvaPriceCorreo(pCorreo);
      setCanvaPrice1M(p1m);
      setCanvaPrice6M(p6m);
      setCanvaPrice12M(p12m);
    }
    setIsCanvaModalOpen(true);
  };

  // Guardar Precios de Canva desde el Modal
  const handleSaveCanvaPrices = (e: React.FormEvent) => {
    e.preventDefault();
    const canvaProd = products.find(p => p.brand === 'Canva Pro' || p.name.toLowerCase().includes('canva'));
    if (!canvaProd) return;

    const valCorreo = Number(canvaPriceCorreo) || 18000;
    const val1M = Number(canvaPrice1M) || 15000;
    const val6M = Number(canvaPrice6M) || 50000;
    const val12M = Number(canvaPrice12M) || 80000;

    const updatedPlans = [
      { id: '1m-correo', label: 'Correo propio', fullName: 'Canva 1 mes con correo del cliente', price: valCorreo, regularPrice: valCorreo + 10000 },
      { id: '1m', label: '1 Mes', fullName: 'Canva 1 mes', price: val1M, regularPrice: val1M + 10000 },
      { id: '6m', label: '6 Meses', fullName: 'Canva 6 meses', price: val6M, regularPrice: val6M + 25000 },
      { id: '12m', label: '12 Meses', fullName: 'Canva 12 meses', price: val12M, regularPrice: val12M + 30000 }
    ];

    ProductRepository.updateProduct(canvaProd.id, { customPlans: updatedPlans });
    setProducts(ProductRepository.getProducts());
    setIsCanvaModalOpen(false);
    notify('¡Precios de Canva Pro actualizados correctamente!');
  };

  // Cambio directo de precio al instante (para todos los demás ítems)
  const handlePriceChange = (item: FlatAdminItem, newPriceVal: number) => {
    const priceNum = Math.max(0, newPriceVal);

    if (item.isCustomPlan && item.planId) {
      const updatedPlans = (item.rawProduct.customPlans || []).map(plan =>
        plan.id === item.planId ? { ...plan, price: priceNum } : plan
      );
      ProductRepository.updateProduct(item.productId, { customPlans: updatedPlans });
    } else {
      ProductRepository.updateProduct(item.productId, {
        modes: {
          ...item.rawProduct.modes,
          pantalla: {
            ...item.rawProduct.modes.pantalla,
            prices: {
              ...item.rawProduct.modes.pantalla.prices,
              '1m': priceNum,
              '3m': priceNum,
              '6m': priceNum,
              '12m': priceNum
            }
          }
        }
      });
    }

    setProducts(ProductRepository.getProducts());
    notify(`Precio de "${item.name}" actualizado a $${priceNum.toLocaleString('es-CO')} COP`);
  };

  // Alternar disponibilidad en 1 clic
  const handleToggleAvailability = (productId: number, productName: string) => {
    const updated = ProductRepository.toggleAvailability(productId);
    if (updated) {
      setProducts(ProductRepository.getProducts());
      notify(`Estado de ${productName}: ${updated.available ? 'Entrega Inmediata' : 'Agotado'}`);
    }
  };

  // Eliminar ítem del catálogo
  const handleDeleteProduct = (productId: number, name: string) => {
    toast.confirm({
      title: '¿Eliminar Servicio?',
      message: `¿Seguro que deseas eliminar "${name}" del catálogo? Esta acción no se puede deshacer.`,
      confirmText: 'Sí, Eliminar',
      cancelText: 'Cancelar',
      variant: 'danger',
      onConfirm: () => {
        ProductRepository.deleteProduct(productId);
        setProducts(ProductRepository.getProducts());
        toast.success(`Servicio "${name}" eliminado del catálogo.`);
      }
    });
  };

  // Restablecer catálogo por defecto
  const handleResetCatalog = () => {
    toast.confirm({
      title: '¿Restablecer Catálogo?',
      message: '¿Seguro que deseas restablecer todo el catálogo a los precios iniciales por defecto?',
      confirmText: 'Sí, Restablecer Todo',
      cancelText: 'Cancelar',
      variant: 'warning',
      onConfirm: () => {
        const defaults = ProductRepository.resetToDefaults();
        setProducts(defaults);
        toast.success('Catálogo restablecido correctamente.');
      }
    });
  };

  // Guardar configuración de tienda
  const handleSaveStoreConfig = (e: React.FormEvent) => {
    e.preventDefault();
    AdminRepository.savePaymentConfig(storeConfig);
    toast.success('Configuración de la tienda guardada con éxito.');
  };

  // Crear nuevo servicio o combo directo
  const handleFastCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (createType === 'single') {
      if (!newName.trim()) {
        toast.warning('Ingresa el nombre del servicio que deseas agregar.', 'Campo Requerido');
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
        badges: ['Entrega Inmediata', 'Renovable'],
        searchTags: [newName.toLowerCase(), newCategory],
        modes: {
          pantalla: {
            label: '1 Pantalla / Perfil Personal',
            devices: '1 Dispositivo simultáneo',
            quality: 'Ultra HD 4K',
            access: 'Perfil privado con PIN de seguridad',
            prices: { '1m': pVal, '3m': pVal, '6m': pVal, '12m': pVal },
            regularPrices: { '1m': pVal + 10000, '3m': pVal + 10000, '6m': pVal + 10000, '12m': pVal + 10000 }
          },
          cuenta: {
            label: 'Cuenta Completa',
            devices: 'Todos los dispositivos activados',
            quality: 'Versión Pro Completa',
            access: 'Correo y clave propia renovable',
            prices: { '1m': pVal * 2, '3m': pVal * 2, '6m': pVal * 2, '12m': pVal * 2 },
            regularPrices: { '1m': (pVal * 2) + 15000, '3m': (pVal * 2) + 15000, '6m': (pVal * 2) + 15000, '12m': (pVal * 2) + 15000 }
          }
        },
        includes: [
          `Acceso completo a ${newName.trim()}`,
          'Licencia oficial activada con soporte garantizado',
          'Garantía total durante todo el periodo contratado'
        ]
      });

      setProducts(ProductRepository.getProducts());
      setNewName('');
      notify(`¡Servicio "${created.name}" añadido al catálogo!`);
    } else {
      const nameCombo = newName.trim() || `Combo (${comboPlatforms.join(' + ')})`;
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
        badges: [`Combo ${comboPlatforms.length} en 1`, 'Entrega Inmediata'],
        searchTags: ['combo', ...comboPlatforms.map(p => p.toLowerCase())],
        modes: {
          pantalla: {
            label: `Combo (${comboPlatforms.length} Servicios)`,
            devices: `${comboPlatforms.length} Servicios Activos`,
            quality: 'Ultra HD 4K',
            access: 'Perfiles privados activados',
            prices: { '1m': pVal, '3m': pVal, '6m': pVal, '12m': pVal },
            regularPrices: { '1m': pVal + 15000, '3m': pVal + 15000, '6m': pVal + 15000, '12m': pVal + 15000 }
          },
          cuenta: {
            label: `Cuentas Completas (${comboPlatforms.length} Servicios)`,
            devices: 'Todos los dispositivos activados',
            quality: 'Versión Pro Completa',
            access: 'Acceso total a cuentas familiares',
            prices: { '1m': pVal * 2, '3m': pVal * 2, '6m': pVal * 2, '12m': pVal * 2 },
            regularPrices: { '1m': (pVal * 2) + 20000, '3m': (pVal * 2) + 20000, '6m': (pVal * 2) + 20000, '12m': (pVal * 2) + 20000 }
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 pb-16">
      
      {/* Header Admin */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 shadow-sm flex items-center justify-center bg-white p-0.5 shrink-0">
              <img src="/perfil.png" alt={storeConfig.storeName} className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h1 className="font-black text-base text-white leading-none">
                {storeConfig.storeName} — Panel Administrativo
              </h1>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mt-0.5">
                Edición Sencilla de Precios y Disponibilidad
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onGoToStore}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-extrabold flex items-center gap-1.5 transition shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Ver Mi Tienda
            </button>
            <button
              onClick={onLogout}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 border border-slate-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Notificación Flotante */}
      {successMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-fadeIn border border-emerald-400">
          <Check className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 w-full">
        
        {/* BLOQUE 1: DATOS DE TIENDA Y CUENTAS DE PAGO */}
        <section className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-black text-slate-900 text-sm">Datos de la Tienda, WhatsApp y Cuentas de Pago</h2>
                <p className="text-[11px] text-slate-500 font-medium">Configura el nombre comercial, WhatsApp de pedidos y los titulares/números de transferencia.</p>
              </div>
            </div>
            <button
              type="submit"
              form="store-form"
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              Guardar Todos los Datos
            </button>
          </div>

          <form id="store-form" onSubmit={handleSaveStoreConfig} className="space-y-4">
            
            {/* Fila 1: Tienda y WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Tienda</label>
                <input
                  type="text"
                  value={storeConfig.storeName}
                  onChange={(e) => setStoreConfig({ ...storeConfig, storeName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
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
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                    required
                  />
                  <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            {/* Fila 2: Nequi, Bancolombia, Daviplata */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                Cuentas Bancarias y Titulares (Sincronización Inmediata con la Tienda)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Nequi */}
                <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-200/80 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                    <span className="text-xs font-black text-purple-950">Nequi</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Número Nequi</label>
                    <input
                      type="text"
                      value={storeConfig.nequiNumber}
                      onChange={(e) => setStoreConfig({ ...storeConfig, nequiNumber: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-purple-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-600 outline-none font-mono bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Titular Nequi</label>
                    <input
                      type="text"
                      value={storeConfig.nequiHolder}
                      onChange={(e) => setStoreConfig({ ...storeConfig, nequiHolder: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-purple-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-600 outline-none bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Bancolombia */}
                <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="text-xs font-black text-amber-950">Bancolombia</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Número de Cuenta</label>
                    <input
                      type="text"
                      value={storeConfig.bancolombiaAccount}
                      onChange={(e) => setStoreConfig({ ...storeConfig, bancolombiaAccount: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-amber-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-600 outline-none font-mono bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Titular Bancolombia</label>
                    <input
                      type="text"
                      value={storeConfig.bancolombiaHolder}
                      onChange={(e) => setStoreConfig({ ...storeConfig, bancolombiaHolder: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-amber-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-600 outline-none bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Daviplata */}
                <div className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-200/80 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                    <span className="text-xs font-black text-rose-950">Daviplata</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Número Daviplata</label>
                    <input
                      type="text"
                      value={storeConfig.daviplataNumber}
                      onChange={(e) => setStoreConfig({ ...storeConfig, daviplataNumber: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-rose-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 outline-none font-mono bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Titular Daviplata</label>
                    <input
                      type="text"
                      value={storeConfig.daviplataHolder}
                      onChange={(e) => setStoreConfig({ ...storeConfig, daviplataHolder: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-rose-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 outline-none bg-white"
                      required
                    />
                  </div>
                </div>

              </div>
            </div>
          </form>
        </section>

        {/* BLOQUE 2: LISTA DE PRECIOS SENCILLA */}
        <section className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-black text-slate-900 text-base flex items-center gap-2">
                <span>Lista Directa de Precios ({filteredItems.length} Servicios)</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Digita el valor exacto en pesos ($ COP) o abre el modal exclusivo de Canva para ajustar sus 4 planes.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Buscar servicio (ej. Netflix, Max)..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
              </div>

              <button
                onClick={handleResetCatalog}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition border border-slate-200 flex items-center gap-1.5 shrink-0"
                title="Restablecer los precios por defecto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restablecer
              </button>
            </div>
          </div>

          {/* TABLA DE PRECIOS MODERNA Y ALINEADA */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 w-[35%]">Plataforma / Servicio</th>
                  <th className="py-3 px-4 w-[15%]">Categoría</th>
                  <th className="py-3 px-4 w-[25%] text-right">Precio de Venta ($ COP)</th>
                  <th className="py-3 px-4 w-[15%] text-center">Entrega Inmediata</th>
                  <th className="py-3 px-4 w-[10%] text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const categoryLabel = 
                    item.category === 'cine' ? 'Cine' :
                    item.category === 'musica' ? 'Música' :
                    item.category === 'deportes' ? 'Deportes' :
                    item.category === 'trabajo' ? 'Trabajo' :
                    item.category === 'combo' ? 'Combo' : item.category;

                  const categoryBadgeStyle =
                    item.category === 'combo' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                    item.category === 'musica' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    item.category === 'deportes' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                    item.category === 'trabajo' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    'bg-sky-50 text-sky-700 border-sky-200';

                  let subtitleText = item.brand;
                  if (item.isCanvaProduct) {
                    subtitleText = '4 Planes activos (Correo, 1m, 6m, 12m)';
                  } else if (item.brand === 'Netflix' && item.planId) {
                    subtitleText = item.planId === 'original' ? 'Perfil Original (PIN Privado)' : 'Perfil Único (Código)';
                  }

                  return (
                    <tr key={item.key} className="hover:bg-blue-50/40 transition-colors group">
                      
                      {/* 1. Plataforma / Servicio */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs shrink-0 ${item.logoBg}`}>
                            <Icon icon={item.iconName} className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-extrabold text-slate-900 block text-xs truncate">{item.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold block truncate">{subtitleText}</span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Categoría Compacta (1 sola línea) */}
                      <td className="py-3 px-4">
                        <span className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full border whitespace-nowrap ${categoryBadgeStyle}`}>
                          {categoryLabel}
                        </span>
                      </td>

                      {/* 3. Precio de Venta ($ COP) */}
                      <td className="py-3 px-4 text-right">
                        {item.isCanvaProduct ? (
                          <div className="flex items-center justify-end space-x-2">
                            <span className="text-xs font-mono font-black text-slate-900">Desde $15.000</span>
                            <button
                              onClick={handleOpenCanvaModal}
                              className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-[11px] font-extrabold transition flex items-center gap-1 shrink-0"
                              title="Modificar las 4 tarifas de Canva Pro"
                            >
                              <Edit3 className="w-3 h-3 text-teal-600" />
                              <span>⚙️ 4 Planes</span>
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center space-x-1 justify-end">
                            <span className="text-slate-400 font-bold text-xs">$</span>
                            <input
                              type="number"
                              key={`${item.key}-${item.price}`}
                              defaultValue={item.price}
                              onBlur={(e) => handlePriceChange(item, Number(e.target.value))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                              className="w-28 px-2.5 py-1 rounded-lg border border-slate-300 font-black text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 outline-none font-mono text-right bg-white shadow-xs"
                            />
                            <span className="text-[10px] font-extrabold text-slate-400">COP</span>
                          </div>
                        )}
                      </td>

                      {/* 4. Entrega Inmediata (Switch Toggle Estilo iOS) */}
                      <td className="py-3 px-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={item.available}
                            onChange={() => handleToggleAvailability(item.productId, item.name)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                          <span className={`ml-2 text-[11px] font-extrabold whitespace-nowrap ${item.available ? 'text-emerald-700' : 'text-slate-400'}`}>
                            {item.available ? 'Entrega Inmediata' : 'Agotado'}
                          </span>
                        </label>
                      </td>

                      {/* 5. Acciones */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          {item.isCanvaProduct ? (
                            <button
                              onClick={handleOpenCanvaModal}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition"
                              title="Modificar tarifas de Canva"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => eventBus.emit('ADMIN:EDIT_PRODUCT', item.rawProduct)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                              title="Editar producto avanzado"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteProduct(item.productId, item.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Eliminar servicio"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* BLOQUE 3: CREAR NUEVO SERVICIO O COMBO (FÁCIL) */}
        <section className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-black text-slate-900 text-sm">¿Deseas agregar un nuevo Servicio o Combo?</h2>
                <p className="text-[11px] text-slate-500 font-medium">Completa el nombre y precio para agregarlo de inmediato al catálogo.</p>
              </div>
            </div>

            {/* Toggle Tipo */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setCreateType('single')}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition ${
                  createType === 'single' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                Servicio Individual
              </button>
              <button
                type="button"
                onClick={() => setCreateType('combo')}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition ${
                  createType === 'combo' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                Combo Multi-Plataforma
              </button>
            </div>
          </div>

          <form onSubmit={handleFastCreate} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {createType === 'single' ? 'Nombre del Servicio' : 'Nombre del Combo'}
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={createType === 'single' ? 'Ej. Paramount+ Ultra' : 'Ej. Combo Disney + Max'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                  required
                />
              </div>

              {createType === 'single' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="cine">Cine y Series</option>
                    <option value="musica">Música & Audio</option>
                    <option value="deportes">Deportes en Vivo</option>
                    <option value="trabajo">Trabajo & Edición</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Plataformas</label>
                  <div className="text-[11px] font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 truncate">
                    {comboPlatforms.join(' + ')}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Precio Directo ($ COP)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-emerald-700 font-mono focus:ring-2 focus:ring-blue-600 outline-none"
                  required
                />
              </div>
            </div>

            {createType === 'combo' && (
              <div className="pt-2 border-t border-slate-100">
                <span className="block text-xs font-bold text-slate-700 mb-1.5">
                  Selecciona plataformas del combo:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_PLATFORMS.map((plat) => {
                    const active = comboPlatforms.includes(plat.name);
                    return (
                      <button
                        type="button"
                        key={plat.name}
                        onClick={() => toggleComboPlatform(plat.name)}
                        className={`px-2.5 py-1 rounded-xl border text-xs font-extrabold transition flex items-center gap-1 ${
                          active
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <Icon icon={plat.icon} className="w-3.5 h-3.5" />
                        {plat.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-700/20 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                {createType === 'single' ? 'Añadir Servicio' : 'Crear Combo'}
              </button>
            </div>
          </form>
        </section>

      </div>

      {/* MODAL EXCLUSIVO PARA MODIFICAR LOS 4 PRECIOS DE CANVA PRO */}
      {isCanvaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg flex flex-col overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-teal-50 border-b border-teal-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                  <Icon icon="simple-icons:canva" className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-teal-950 text-base leading-snug">
                    Modificar Precios de Canva Pro
                  </h3>
                  <p className="text-xs text-teal-700 font-medium">
                    Ajusta los 4 planes disponibles para tus clientes
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCanvaModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-teal-100/60 text-slate-500 hover:text-slate-800 transition flex items-center justify-center border border-teal-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCanvaPrices} className="p-6 space-y-4">
              <div className="space-y-3">
                
                {/* Plan 1 */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-900">
                      Canva 1 mes con correo del cliente
                    </label>
                    <span className="text-[10px] text-slate-500 font-bold">Modalidad Correo Propio</span>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    <span className="text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      value={canvaPriceCorreo}
                      onChange={(e) => setCanvaPriceCorreo(Number(e.target.value))}
                      className="w-28 px-3 py-1.5 rounded-xl border border-slate-300 font-black text-slate-900 text-xs font-mono text-right focus:ring-2 focus:ring-teal-600 outline-none bg-white shadow-xs"
                      required
                    />
                  </div>
                </div>

                {/* Plan 2 */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-900">
                      Canva 1 mes
                    </label>
                    <span className="text-[10px] text-slate-500 font-bold">Duración 1 Mes Estándar</span>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    <span className="text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      value={canvaPrice1M}
                      onChange={(e) => setCanvaPrice1M(Number(e.target.value))}
                      className="w-28 px-3 py-1.5 rounded-xl border border-slate-300 font-black text-slate-900 text-xs font-mono text-right focus:ring-2 focus:ring-teal-600 outline-none bg-white shadow-xs"
                      required
                    />
                  </div>
                </div>

                {/* Plan 3 */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-900">
                      Canva 6 meses
                    </label>
                    <span className="text-[10px] text-slate-500 font-bold">Duración 6 Meses</span>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    <span className="text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      value={canvaPrice6M}
                      onChange={(e) => setCanvaPrice6M(Number(e.target.value))}
                      className="w-28 px-3 py-1.5 rounded-xl border border-slate-300 font-black text-slate-900 text-xs font-mono text-right focus:ring-2 focus:ring-teal-600 outline-none bg-white shadow-xs"
                      required
                    />
                  </div>
                </div>

                {/* Plan 4 */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-900">
                      Canva 12 meses
                    </label>
                    <span className="text-[10px] text-slate-500 font-bold">Duración 12 Meses (Anual)</span>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    <span className="text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      value={canvaPrice12M}
                      onChange={(e) => setCanvaPrice12M(Number(e.target.value))}
                      className="w-28 px-3 py-1.5 rounded-xl border border-slate-300 font-black text-slate-900 text-xs font-mono text-right focus:ring-2 focus:ring-teal-600 outline-none bg-white shadow-xs"
                      required
                    />
                  </div>
                </div>

              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCanvaModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-teal-600 hover:bg-teal-700 transition shadow-md shadow-teal-600/20 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Guardar Precios de Canva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
