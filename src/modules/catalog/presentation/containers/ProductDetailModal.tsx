import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Sparkles, Monitor, ShieldCheck, CheckCircle2, Tv, Smartphone, Laptop, Gamepad2, Tablet, KeyRound, AlertCircle, MessageCircle, ShoppingBag } from 'lucide-react';
import { Product } from '../../domain/entities/Product';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { eventBus } from '@/core/bus/eventBus';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { formatCOP } from '@/core/utils/currency';

const DEFAULT_CANVA_PLANS = [
  { id: '1m-correo', label: 'Correo propio', fullName: 'Canva 1 mes con correo del cliente', price: 18000 },
  { id: '1m', label: '1 Mes', fullName: 'Canva 1 mes', price: 15000 },
  { id: '6m', label: '6 Meses', fullName: 'Canva 6 meses', price: 50000 },
  { id: '12m', label: '12 Meses', fullName: 'Canva 12 meses', price: 80000 },
];

const DEFAULT_NETFLIX_PLANS = [
  { id: 'original', label: 'Netflix Original', fullName: 'Netflix Original', price: 17000 },
  { id: 'unico', label: 'Netflix Único', fullName: 'Netflix Único', price: 29000 },
];

export const ProductDetailModal: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'includes' | 'devices' | 'rules'>('includes');
  const [selectedCanvaPlanId, setSelectedCanvaPlanId] = useState<string>('1m');
  const [selectedNetflixPlanId, setSelectedNetflixPlanId] = useState<string>('original');
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const unsubscribe = eventBus.on('CATALOG:OPEN_DETAILS', (selectedProduct) => {
      setProduct(selectedProduct);
      setActiveTab('includes');
      setSelectedCanvaPlanId('1m');
      setSelectedNetflixPlanId('original');
    });
    return () => unsubscribe();
  }, []);

  if (!product) return null;

  const isCanva = product.brand === 'Canva Pro' || product.name.toLowerCase().includes('canva');
  const isNetflix = product.brand === 'Netflix' && product.category === 'cine';

  const canvaPlansList = (isCanva && product.customPlans && product.customPlans.length > 0)
    ? product.customPlans
    : DEFAULT_CANVA_PLANS;

  const netflixPlansList = (isNetflix && product.customPlans && product.customPlans.length > 0)
    ? product.customPlans
    : DEFAULT_NETFLIX_PLANS;

  const activeCanvaPlan = canvaPlansList.find(p => p.id === selectedCanvaPlanId) || canvaPlansList[1] || canvaPlansList[0];
  const activeNetflixPlan = netflixPlansList.find(p => p.id === selectedNetflixPlanId) || netflixPlansList[0];

  const currentPrice = isCanva
    ? activeCanvaPlan.price
    : isNetflix
    ? activeNetflixPlan.price
    : product.modes.pantalla.prices['1m'];

  const productName = isCanva
    ? activeCanvaPlan.fullName
    : isNetflix
    ? activeNetflixPlan.fullName
    : product.name;

  const handleClose = () => setProduct(null);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      cartItemId: isCanva
        ? `${product.id}-${activeCanvaPlan.id}`
        : isNetflix
        ? `${product.id}-${activeNetflixPlan.id}`
        : `${product.id}-pantalla-1m`,
      id: product.id,
      name: isCanva || isNetflix ? productName : `${product.name} (1 Pantalla - 1 Mes)`,
      price: currentPrice,
      image: product.iconName,
      quantity: 1,
    });
    handleClose();
  };

  const handleBuyWhatsApp = () => {
    const message = `¡Hola! Deseo comprar inmediatamente *${productName}* por un valor de *${formatCOP(currentPrice)}*. ¿Me das los medios de pago?`;
    window.open(`https://wa.me/573214465418?text=${encodeURIComponent(message)}`, '_blank');
  };

  const modalTitle = (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl border border-slate-900/[0.08] flex items-center justify-center p-2 shadow-sm ${product.logoBg}`}>
        <Icon icon={product.iconName} className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-lg font-extrabold text-slate-900">{productName}</h2>
        <Badge variant="emerald" className="mt-0.5">Entrega Inmediata</Badge>
      </div>
    </div>
  );

  const deviceIcons = [
    { name: 'Smart TV', icon: Tv },
    { name: 'TV Box / Stick', icon: Monitor },
    { name: 'Smartphones', icon: Smartphone },
    { name: 'Laptops & PC', icon: Laptop },
    { name: 'Consolas', icon: Gamepad2 },
    { name: 'Tablets & iPad', icon: Tablet },
  ];

  return (
    <Modal isOpen={!!product} onClose={handleClose} title={modalTitle} maxWidth="2xl">
      {/* Selector de Planes si es Canva */}
      {isCanva && (
        <div className="mb-4 bg-teal-50/70 p-3 rounded-2xl border border-teal-500/20">
          <label className="text-xs font-extrabold text-teal-900 uppercase block mb-2">
            Selecciona tu modalidad o duración Canva:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {canvaPlansList.map(plan => (
              <button
                key={plan.id}
                onClick={() => setSelectedCanvaPlanId(plan.id)}
                className={`py-2 px-2.5 rounded-xl text-center border transition-all flex items-center justify-center ${
                  selectedCanvaPlanId === plan.id
                    ? 'bg-white border-teal-600 text-teal-950 font-black ring-2 ring-teal-600/30 shadow-sm'
                    : 'bg-white/80 border-slate-900/[0.08] text-slate-600 hover:text-slate-900 font-bold'
                }`}
              >
                <span className="text-[11px] leading-tight font-extrabold">{plan.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selector de Planes si es Netflix */}
      {isNetflix && (
        <div className="mb-4 bg-red-50/70 p-3 rounded-2xl border border-red-500/20">
          <label className="text-xs font-extrabold text-red-900 uppercase block mb-2">
            Selecciona tu tipo de perfil Netflix:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {netflixPlansList.map(plan => (
              <button
                key={plan.id}
                onClick={() => setSelectedNetflixPlanId(plan.id)}
                className={`py-2 px-3 rounded-xl text-center border transition-all flex items-center justify-center ${
                  selectedNetflixPlanId === plan.id
                    ? 'bg-red-600 border-red-600 text-white font-black shadow-sm'
                    : 'bg-white/80 border-slate-900/[0.08] text-slate-600 hover:text-slate-900 font-bold'
                }`}
              >
                <span className="text-[11px] leading-tight font-extrabold">{plan.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-900/[0.08] text-xs font-bold mb-4">
        <button
          onClick={() => setActiveTab('includes')}
          className={`py-2.5 px-4 transition border-b-2 flex items-center gap-1.5 ${activeTab === 'includes' ? 'text-blue-700 border-blue-700 font-extrabold' : 'text-slate-600 hover:text-slate-900 border-transparent'}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>¿Qué incluye?</span>
        </button>
        <button
          onClick={() => setActiveTab('devices')}
          className={`py-2.5 px-4 transition border-b-2 flex items-center gap-1.5 ${activeTab === 'devices' ? 'text-blue-700 border-blue-700 font-extrabold' : 'text-slate-600 hover:text-slate-900 border-transparent'}`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Dispositivos</span>
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`py-2.5 px-4 transition border-b-2 flex items-center gap-1.5 ${activeTab === 'rules' ? 'text-blue-700 border-blue-700 font-extrabold' : 'text-slate-600 hover:text-slate-900 border-transparent'}`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Reglas y Garantía</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'includes' && (
        <div className="space-y-2 text-xs text-slate-600">
          {product.includes.map((inc, i) => (
            <div key={i} className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-900/[0.08]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{inc}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'devices' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600">Soporte multi-dispositivo sin interrupciones en la app oficial:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {deviceIcons.map((dev, i) => {
              const DevIcon = dev.icon;
              return (
                <div key={i} className="p-3 bg-slate-50 border border-slate-900/[0.08] rounded-xl text-center flex flex-col items-center justify-center">
                  <DevIcon className="w-6 h-6 text-blue-700 mb-1" />
                  <span className="text-xs font-bold text-slate-900">{dev.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="p-4 bg-slate-50 border border-slate-900/[0.08] rounded-2xl space-y-3 text-xs text-slate-600">
          <div className="flex items-start gap-2.5">
            <KeyRound className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div><strong>Licencia Oficial:</strong> Activación segura en tu cuenta o correo personal.</div>
          </div>
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div><strong>Uso Personal:</strong> Prohibido revender o vulnerar los términos del servicio.</div>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div><strong>Garantía Total:</strong> Soporte e interacción continua durante toda la vigencia contratada.</div>
          </div>
        </div>
      )}

      {/* Footer modal */}
      <div className="pt-4 border-t border-slate-900/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div>
          <span className="text-[11px] text-slate-400 block font-semibold">Plan Seleccionado</span>
          <span className="text-base font-black text-teal-800">
            {formatCOP(currentPrice)} COP
          </span>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="ghost" size="sm" onClick={handleBuyWhatsApp}>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              WhatsApp
            </span>
          </Button>
          <Button variant="primary" size="sm" onClick={handleAddToCart}>
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" />
              Añadir al Carrito
            </span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
