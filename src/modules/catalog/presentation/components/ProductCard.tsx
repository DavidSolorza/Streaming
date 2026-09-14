import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Monitor, Sparkles, KeyRound, Flame, ShoppingCart, Info, MessageCircle, ShieldCheck, Check } from 'lucide-react';
import { Product, ProductMode } from '../../domain/entities/Product';
import { DurationKey } from '../../domain/value-objects/PlanDuration';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { eventBus } from '@/core/bus/eventBus';
import { formatCOP } from '@/core/utils/currency';
import { WhatsAppAdapter } from '@/core/adapters/whatsappAdapter';

interface ProductCardProps {
  product: Product;
}

const CANVA_PLANS = [
  { id: '1m-correo', label: 'Correo propio', fullName: 'Canva 1 mes con correo del cliente', price: 12000, regularPrice: 20000 },
  { id: '1m', label: '1 Mes', fullName: 'Canva 1 mes', price: 10000, regularPrice: 18000 },
  { id: '6m', label: '6 Meses', fullName: 'Canva 6 meses', price: 34000, regularPrice: 48000 },
  { id: '12m', label: '12 Meses', fullName: 'Canva 12 meses', price: 60000, regularPrice: 85000 },
];

const NETFLIX_PLANS = [
  { id: 'original', label: 'Netflix Original', fullName: 'Netflix Original', price: 17000, regularPrice: 27000 },
  { id: 'unico', label: 'Netflix Único', fullName: 'Netflix Único', price: 29000, regularPrice: 39000 },
];

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const selectedMode: ProductMode = 'pantalla';
  const selectedDuration: DurationKey = '1m';
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [selectedCanvaPlanId, setSelectedCanvaPlanId] = useState<string>('1m');
  const [selectedNetflixPlanId, setSelectedNetflixPlanId] = useState<string>('original');

  const addItem = useCartStore(state => state.addItem);

  const isCanva = product.brand === 'Canva Pro' || product.name.toLowerCase().includes('canva');
  const isNetflix = product.brand === 'Netflix' && product.category === 'cine';

  const activeCanvaPlan = CANVA_PLANS.find(p => p.id === selectedCanvaPlanId) || CANVA_PLANS[1];
  const activeNetflixPlan = NETFLIX_PLANS.find(p => p.id === selectedNetflixPlanId) || NETFLIX_PLANS[0];

  const modeData = product.modes[selectedMode];
  const currentPrice = isCanva
    ? activeCanvaPlan.price
    : isNetflix
    ? activeNetflixPlan.price
    : modeData.prices[selectedDuration];

  const regularPrice = isCanva
    ? activeCanvaPlan.regularPrice
    : isNetflix
    ? activeNetflixPlan.regularPrice
    : modeData.regularPrices[selectedDuration];

  const discountPct = Math.round(((regularPrice - currentPrice) / regularPrice) * 100);

  // Multiplicador de meses para cálculo del total acumulado
  const durationMonths = selectedDuration === '1m' ? 1 : selectedDuration === '3m' ? 3 : selectedDuration === '6m' ? 6 : 12;
  const isWorkProduct = product.category === 'trabajo';
  const modeLabel = isWorkProduct 
    ? 'Licencia Pro Personal' 
    : (selectedMode === 'pantalla' ? '1 Pantalla con PIN' : 'Cuenta Completa');
  const durationLabel = selectedDuration === '1m' ? '1 Mes' : `${durationMonths} Meses`;

  // Filtrar insignias redundantes ("Entrega Inmediata" ya aparece en la insignia superior)
  const visibleBadges = (product.badges || []).filter(
    b => b.toLowerCase() !== 'entrega inmediata'
  );

  const activeProductName = isCanva
    ? activeCanvaPlan.fullName
    : isNetflix
    ? activeNetflixPlan.fullName
    : product.name;

  const handleAddToCart = () => {
    if (!product.available) return;

    addItem({
      cartItemId: isCanva
        ? `${product.id}-${activeCanvaPlan.id}`
        : isNetflix
        ? `${product.id}-${activeNetflixPlan.id}`
        : `${product.id}-${selectedMode}-${selectedDuration}`,
      id: product.id,
      name: isCanva || isNetflix ? activeProductName : `${product.name} (${modeLabel} - ${durationLabel})`,
      price: currentPrice,
      image: product.iconName,
      quantity: 1
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleOpenDetails = () => {
    eventBus.emit('CATALOG:OPEN_DETAILS', product);
  };

  // Generar enlace directo codificado a WhatsApp
  const whatsAppUrl = WhatsAppAdapter.generateProductUrl({
    productName: activeProductName,
    modeLabel: isCanva ? 'Licencia Pro' : isNetflix ? '1 Pantalla' : modeLabel,
    durationLabel: isCanva ? activeCanvaPlan.label : durationLabel,
    price: currentPrice
  });

  return (
    <div className={`bg-white border ${!product.available ? 'border-slate-900/[0.05] opacity-60' : 'border-slate-900/[0.08]'} ${product.brandGlow} rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 relative group shadow-luxury hover:shadow-luxury-hover`}>
      <div className="flex-1 flex flex-col">
        {/* Encabezado Visual con Logo de Marca y Badges Alineados en Fila */}
        <div className="flex justify-between items-start mb-3 min-h-[48px]">
          <div className={`w-12 h-12 rounded-2xl border border-slate-900/[0.08] flex items-center justify-center p-2 shadow-sm ${product.logoBg}`}>
            <Icon icon={product.iconName} className="w-7 h-7" />
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1 max-w-[70%]">
            {product.bestseller && (
              <Badge variant="amber">
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                  Más Vendido
                </span>
              </Badge>
            )}
            <Badge variant={product.available ? 'emerald' : 'rose'}>
              {product.available ? 'Entrega Inmediata' : 'Agotado'}
            </Badge>
          </div>
        </div>

        {/* Título en color neutro oscuro slate-900 sin choque visual */}
        <h3 className="font-extrabold text-base text-slate-900 mb-0.5 leading-snug">
          {activeProductName}
        </h3>

        {/* Modalidades y badges contextuales */}
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-3">
          <span className="font-bold text-slate-700">{modeLabel}</span>
          <span>•</span>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 inline" /> Garantía 30 días
          </span>
        </div>

        {product.category === 'combo' && product.includes[0] && (
          <div className="mb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="text-[11px] font-bold text-blue-900 truncate">
              {product.includes[0].replace('Incluye los servicios de: ', 'Incluye: ')}
            </span>
          </div>
        )}

        {/* Selector de Planes Exclusivo para Canva */}
        {isCanva && (
          <div className="mb-3 bg-teal-50/60 p-2 rounded-2xl border border-teal-500/20">
            <div className="text-[10px] font-extrabold text-teal-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Elige tu Plan Canva:</span>
              <span className="text-[9.5px] text-teal-600 font-bold">4 Opciones</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
              {CANVA_PLANS.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedCanvaPlanId(plan.id)}
                  className={`py-2 px-2 rounded-xl border text-center transition-all flex items-center justify-center ${
                    selectedCanvaPlanId === plan.id
                      ? 'bg-white border-teal-600 text-teal-950 font-black shadow-sm ring-2 ring-teal-600/30'
                      : 'bg-white/70 border-slate-900/[0.08] text-slate-600 hover:text-slate-900 hover:bg-white font-bold'
                  }`}
                >
                  <span className="text-[11px] font-extrabold leading-tight">{plan.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selector de Modalidad Exclusivo para Netflix */}
        {isNetflix && (
          <div className="mb-3 bg-red-50/60 p-2 rounded-2xl border border-red-500/20">
            <div className="text-[10px] font-extrabold text-red-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Tipo de Perfil Netflix:</span>
              <span className="text-[9.5px] text-red-600 font-bold">2 Opciones</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
              {NETFLIX_PLANS.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedNetflixPlanId(plan.id)}
                  className={`py-2 px-2 rounded-xl border text-center transition-all flex items-center justify-center ${
                    selectedNetflixPlanId === plan.id
                      ? 'bg-red-600 border-red-600 text-white font-black shadow-sm'
                      : 'bg-white/70 border-slate-900/[0.08] text-slate-600 hover:text-slate-900 hover:bg-white font-bold'
                  }`}
                >
                  <span className="text-[11px] font-extrabold leading-tight">{plan.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Badges secundarios filtrados (sin duplicados de Entrega Inmediata) */}
        {visibleBadges.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {visibleBadges.map((badge, index) => (
              <span key={index} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg border border-slate-900/[0.05]">
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Especificaciones Técnicas Concisas (Panel expandible que elimina huecos blancos) */}
        <div className="hidden sm:flex flex-col justify-center bg-slate-50 border border-slate-900/[0.06] rounded-2xl p-3.5 mt-auto mb-4 flex-1 space-y-2 text-[11px] text-slate-600">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate font-semibold">{modeData.devices}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate font-semibold">{modeData.quality}</span>
          </div>
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate font-semibold">{modeData.access}</span>
          </div>
        </div>
      </div>

      {/* Caja de Precios Corregida y Jerarquía de Botones Limpia */}
      <div className="pt-3 border-t border-slate-900/[0.08] space-y-2.5">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[11px] text-slate-400 line-through block leading-none">{formatCOP(regularPrice)}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">{formatCOP(currentPrice)}</span>
              <span className="text-[10px] font-medium text-slate-500">/ mes</span>
            </div>
          </div>
          {/* Insignia de descuento corregida sin duplicar signo de pesos */}
          <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-200">
            {discountPct}% DCTO
          </span>
        </div>

        {/* Acción Principal Prominente: WhatsApp Directo */}
        {product.available ? (
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-luxury transition-all duration-200 hover:scale-[1.01]"
          >
            <MessageCircle className="w-4 h-4 fill-current shrink-0" />
            <span>Pedir por WhatsApp Directo</span>
          </a>
        ) : (
          <button
            disabled
            className="w-full py-2.5 px-4 bg-slate-200 text-slate-500 font-bold text-xs rounded-xl text-center cursor-not-allowed"
          >
            Agotado Temporalmente
          </button>
        )}

        {/* Acciones Secundarias Limpias: Carrito + Detalles */}
        <div className="grid grid-cols-2 gap-2 text-slate-600 text-xs font-bold">
          <button
            onClick={handleOpenDetails}
            className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center gap-1 transition"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Detalles</span>
          </button>

          <button
            disabled={!product.available}
            onClick={handleAddToCart}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 border transition disabled:opacity-50 ${
              isAdded
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold'
                : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-transparent hover:border-blue-200'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">¡Añadido!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>+ Carrito</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
