import React, { useState } from 'react';
import { Product, ProductMode } from '../../domain/entities/Product';
import { DurationKey } from '../../domain/value-objects/PlanDuration';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { eventBus } from '@/core/bus/eventBus';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedMode, setSelectedMode] = useState<ProductMode>('pantalla');
  const [selectedDuration, setSelectedDuration] = useState<DurationKey>('1m');

  const addItem = useCartStore(state => state.addItem);

  const modeData = product.modes[selectedMode];
  const currentPrice = modeData.prices[selectedDuration];
  const regularPrice = modeData.regularPrices[selectedDuration];
  const discountPct = Math.round(((regularPrice - currentPrice) / regularPrice) * 100);

  const handleAddToCart = () => {
    if (!product.available) return;

    const modeLabel = selectedMode === 'pantalla' ? '1 Pantalla' : 'Cuenta Completa';
    const durationLabel = selectedDuration === '1m' ? '1 Mes' : (selectedDuration === '3m' ? '3 Meses' : '6 Meses');

    addItem({
      cartItemId: `${product.id}-${selectedMode}-${selectedDuration}`,
      id: product.id,
      name: `${product.name} (${modeLabel} - ${durationLabel})`,
      price: currentPrice,
      image: product.logoText,
      quantity: 1
    });
  };

  const handleOpenDetails = () => {
    eventBus.emit('CATALOG:OPEN_DETAILS', product);
  };

  return (
    <div className={`bg-white border ${!product.available ? 'border-slate-900/[0.05] opacity-60' : 'border-slate-900/[0.08]'} ${product.brandGlow} rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative group shadow-luxury hover:shadow-luxury-hover`}>
      <div>
        {/* Encabezado Visual con Logo y Badges Superior */}
        <div className="flex justify-between items-start mb-5">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-900/[0.08] flex items-center justify-center text-2xl font-black shadow-sm">
            {product.logoText}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {product.bestseller && (
              <Badge variant="amber">🔥 Más Vendido</Badge>
            )}
            <Badge variant={product.available ? 'emerald' : 'rose'}>
              {product.available ? 'Entrega Inmediata' : 'Agotado'}
            </Badge>
          </div>
        </div>

        {/* Título y Badges Cortos */}
        <h3 className="font-extrabold text-lg text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex flex-wrap gap-1.5 mb-5">
          {product.badges.map((badge, index) => (
            <Badge key={index} variant="neutral">{badge}</Badge>
          ))}
        </div>

        {/* 1. Selector de Modalidad (Toggle Switch Integrado) */}
        <div className="mb-4 bg-slate-100 p-1 rounded-xl border border-slate-900/[0.08] flex text-[11px] font-bold">
          <button
            onClick={() => setSelectedMode('pantalla')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all ${selectedMode === 'pantalla' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            1 Pantalla (PIN)
          </button>
          <button
            onClick={() => setSelectedMode('cuenta')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all ${selectedMode === 'cuenta' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Cuenta Completa
          </button>
        </div>

        {/* 2. Selector de Duración (Píldoras Interactivas) */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Duración del Servicio:</span>
            {selectedDuration === '3m' && <span className="text-[10px] font-extrabold text-emerald-600">Ahorra 15%</span>}
            {selectedDuration === '6m' && <span className="text-[10px] font-extrabold text-emerald-600">Ahorra 25%</span>}
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
            {(['1m', '3m', '6m'] as DurationKey[]).map(dur => (
              <button
                key={dur}
                onClick={() => setSelectedDuration(dur)}
                className={`py-2 rounded-xl border transition ${selectedDuration === dur ? 'bg-white border-blue-700 text-slate-900 shadow-sm' : 'bg-slate-100 border-slate-900/[0.08] text-slate-600 hover:text-slate-900'}`}
              >
                {dur === '1m' ? '1 Mes' : dur === '3m' ? '3 Meses' : '6 Meses'}
              </button>
            ))}
          </div>
        </div>

        {/* Resumen de Especificaciones Rápidas */}
        <div className="bg-slate-50 border border-slate-900/[0.08] rounded-2xl p-3.5 mb-5 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-blue-700 font-bold">📺</span>
            <span>{modeData.devices}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-blue-700 font-bold">✨</span>
            <span>{modeData.quality}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-blue-700 font-bold">🔑</span>
            <span className="truncate">{modeData.access}</span>
          </div>
        </div>
      </div>

      {/* Caja de Precios y Botones de Acción */}
      <div className="pt-4 border-t border-slate-900/[0.08]">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-xs text-slate-400 line-through block leading-none">${regularPrice.toLocaleString('es-CO')} COP</span>
            <span className="text-xl font-black text-slate-900">${currentPrice.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">COP</span></span>
          </div>
          <Badge variant="emerald">-${discountPct}% OFF</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" size="sm" onClick={handleOpenDetails}>
            Ver Detalles
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!product.available}
            onClick={handleAddToCart}
          >
            {product.available ? 'Comprar / Añadir' : 'Agotado'}
          </Button>
        </div>
      </div>
    </div>
  );
};
