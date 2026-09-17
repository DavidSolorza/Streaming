import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Product } from '../../domain/entities/Product';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { eventBus } from '@/core/bus/eventBus';
import { WhatsAppAdapter } from '@/core/adapters/whatsappAdapter';
import { ProductCardHeader } from './ProductCardHeader';
import { ProductCardSpecs } from './ProductCardSpecs';
import { ProductCardActions } from './ProductCardActions';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const unsubscribe = eventBus.on('CATALOG:HIGHLIGHT_PLATFORM', (targetPlatform: string) => {
      if (!targetPlatform || product.category === 'combo') return;
      const pLower = targetPlatform.toLowerCase().replace('+', '').trim();
      const isMatch = product.name.toLowerCase().includes(pLower) || product.brand.toLowerCase().includes(pLower);
      if (isMatch) {
        setIsHighlighted(true);
        setTimeout(() => {
          const cardEl = document.getElementById(`product-card-${product.id}`);
          if (cardEl) cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        setTimeout(() => setIsHighlighted(false), 2000);
      }
    });
    return unsubscribe;
  }, [product]);

  const modeData = product.modes.pantalla;
  const currentPrice = modeData.prices['1m'];
  const modeLabel = product.category === 'trabajo' ? 'Licencia Pro Personal' : '1 Pantalla con PIN';

  const handleAddToCart = () => {
    if (!product.available) return;
    addItem({ cartItemId: `${product.id}-pantalla-1m`, id: product.id, name: `${product.name} (${modeLabel} - 1 Mes)`, price: currentPrice, image: product.iconName, quantity: 1 });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const whatsAppUrl = WhatsAppAdapter.generateProductUrl({ productName: product.name, modeLabel, durationLabel: '1 Mes', price: currentPrice });

  return (
    <div id={`product-card-${product.id}`} className={`bg-white border ${isHighlighted ? 'border-blue-600 ring-4 ring-blue-500/50 scale-[1.03] shadow-2xl z-20' : !product.available ? 'border-slate-900/[0.05] opacity-60' : 'border-slate-900/[0.08]'} rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 relative group shadow-luxury hover:shadow-luxury-hover`}>
      <div className="flex-1 flex flex-col">
        <ProductCardHeader product={product} />
        <h3 className="font-extrabold text-base text-slate-900 mb-0.5 leading-snug">{product.name}</h3>
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-3">
          <span className="font-bold text-slate-700">{modeLabel}</span>
          <span>•</span>
          <span className="text-emerald-600 font-bold flex items-center gap-1"><ShieldCheck className="w-3 h-3 inline" /> Garantía 30 días</span>
        </div>
        <ProductCardSpecs devices={modeData.devices} quality={modeData.quality} access={modeData.access} />
      </div>
      <ProductCardActions currentPrice={currentPrice} available={product.available} whatsAppUrl={whatsAppUrl} isAdded={isAdded} onAddToCart={handleAddToCart} onOpenDetails={() => eventBus.emit('CATALOG:OPEN_DETAILS', product)} />
    </div>
  );
};
