import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Sparkles, Monitor, ShieldCheck, CheckCircle2, Tv, Smartphone, Laptop, Gamepad2, Tablet, KeyRound, AlertCircle, MessageCircle, ShoppingBag } from 'lucide-react';
import { Product } from '../../domain/entities/Product';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { eventBus } from '@/core/bus/eventBus';
import { useCartStore } from '@/modules/cart/application/useCartStore';

export const ProductDetailModal: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'includes' | 'devices' | 'rules'>('includes');
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const unsubscribe = eventBus.on('CATALOG:OPEN_DETAILS', (selectedProduct) => {
      setProduct(selectedProduct);
      setActiveTab('includes');
    });
    return () => unsubscribe();
  }, []);

  if (!product) return null;

  const handleClose = () => setProduct(null);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      cartItemId: `${product.id}-pantalla-1m`,
      id: product.id,
      name: `${product.name} (1 Pantalla - 1 Mes)`,
      price: product.modes.pantalla.prices['1m'],
      image: product.iconName,
      quantity: 1,
    });
    handleClose();
  };

  const handleBuyWhatsApp = () => {
    const modeData = product.modes.pantalla;
    const price = modeData.prices['1m'];
    const message = `Hola 👋 Deseo comprar inmediatamente *${product.name}* (1 Pantalla por 1 Mes) por un valor de *$${price.toLocaleString('es-CO')} COP*. ¿Me das los medios de pago?`;
    window.open(`https://wa.me/573214465418?text=${encodeURIComponent(message)}`, '_blank');
  };

  const modalTitle = (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl border border-slate-900/[0.08] flex items-center justify-center p-2 shadow-sm ${product.logoBg}`}>
        <Icon icon={product.iconName} className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-lg font-extrabold text-slate-900">{product.name}</h2>
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
            <div><strong>Perfil Privado con PIN:</strong> Espacio personal seguro e inmutable.</div>
          </div>
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div><strong>Uso Personal:</strong> Prohibido compartir credenciales con terceros.</div>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div><strong>Garantía Total:</strong> Reposición inmediata durante todo el periodo contratado.</div>
          </div>
        </div>
      )}

      {/* Footer modal */}
      <div className="pt-4 border-t border-slate-900/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div>
          <span className="text-[11px] text-slate-400 block font-semibold">Plan Asignado</span>
          <span className="text-sm font-extrabold text-slate-900">
            ${product.modes.pantalla.prices['1m'].toLocaleString('es-CO')} COP / mes
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
