import React, { useState, useEffect } from 'react';
import { PlatformIcon } from '@/shared/components/PlatformIcon';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { Product } from '../../domain/entities/Product';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { eventBus } from '@/core/bus/eventBus';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { formatCOP } from '@/core/utils/currency';
import { ProductDetailTabs } from './ProductDetailTabs';
import { useCustomerProfile } from '@/modules/customer/application/useCustomerProfile';

export const ProductDetailModal: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'includes' | 'devices' | 'rules'>('includes');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const unsubscribe = eventBus.on('CATALOG:OPEN_DETAILS', (selectedProduct) => {
      setProduct(selectedProduct);
      setActiveTab('includes');
    });
    return () => unsubscribe();
  }, []);

  if (!product) return null;

  const currentPrice = product.modes.pantalla.prices['1m'];
  const handleClose = () => setProduct(null);

  const handleAddToCart = () => {
    addItem({ cartItemId: `${product.id}-pantalla-1m`, id: product.id, name: `${product.name} (1 Pantalla - 1 Mes)`, price: currentPrice, image: product.iconName, quantity: 1 });
    handleClose();
  };

  const requireName = useCustomerProfile((state) => state.requireName);

  const proceedBuyWhatsApp = (customerName: string) => {
    let message = '';
    if (customerName && customerName.trim()) {
      message += `¡Hola equipo JP! Mi nombre es *${customerName.trim()}*, un gusto saludarlos.\n\n`;
    }
    message += 
      `*SOLICITUD DE COMPRA DIRECTA*\n` +
      `──────────────────────────\n` +
      `*Servicio:* ${product.name}\n` +
      `   • Modalidad: 1 Pantalla con PIN\n` +
      `   • Duración: 1 Mes\n` +
      `   • Precio: *${formatCOP(currentPrice)} COP*\n` +
      `──────────────────────────\n` +
      `Deseo adquirir este servicio. ¿Me compartes los medios de pago para entrega inmediata? ¡Muchas gracias!`;
    window.open(`https://wa.me/573214465418?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleBuyWhatsApp = () => {
    requireName(
      (name) => proceedBuyWhatsApp(name),
      '¿Cómo te llamas?',
      `Queremos saludarte por tu nombre al consultar por ${product.name}.`
    );
  };

  const modalTitle = (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl border border-slate-900/[0.08] flex items-center justify-center p-2 shadow-sm ${product.logoBg}`}>
        <PlatformIcon icon={product.iconName} name={product.brand || product.name} className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-lg font-extrabold text-slate-900">{product.name}</h2>
        <Badge variant="emerald" className="mt-0.5">Entrega Inmediata</Badge>
      </div>
    </div>
  );

  return (
    <Modal isOpen={!!product} onClose={handleClose} title={modalTitle} maxWidth="2xl">
      <ProductDetailTabs product={product} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="pt-4 border-t border-slate-900/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div>
          <span className="text-[11px] text-slate-400 block font-semibold">Precio Total</span>
          <span className="text-base font-black text-teal-800">{formatCOP(currentPrice)} COP</span>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="ghost" size="sm" onClick={handleBuyWhatsApp}>
            <span className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4 text-emerald-600" />WhatsApp</span>
          </Button>
          <Button variant="primary" size="sm" onClick={handleAddToCart}>
            <span className="flex items-center gap-1.5"><ShoppingBag className="w-4 h-4" />Añadir al Carrito</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
