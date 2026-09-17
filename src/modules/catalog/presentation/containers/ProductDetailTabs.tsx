import React from 'react';
import { Sparkles, Monitor, ShieldCheck, CheckCircle2, Tv, Smartphone, Laptop, Gamepad2, Tablet, KeyRound, AlertCircle } from 'lucide-react';
import { Product } from '../../domain/entities/Product';

interface ProductDetailTabsProps {
  product: Product;
  activeTab: 'includes' | 'devices' | 'rules';
  setActiveTab: (tab: 'includes' | 'devices' | 'rules') => void;
}

const deviceIcons = [
  { name: 'Smart TV', icon: Tv },
  { name: 'TV Box / Stick', icon: Monitor },
  { name: 'Smartphones', icon: Smartphone },
  { name: 'Laptops & PC', icon: Laptop },
  { name: 'Consolas', icon: Gamepad2 },
  { name: 'Tablets & iPad', icon: Tablet },
];

export const ProductDetailTabs: React.FC<ProductDetailTabsProps> = ({ product, activeTab, setActiveTab }) => (
  <div>
    <div className="flex border-b border-slate-900/[0.08] text-xs font-bold mb-4">
      <button onClick={() => setActiveTab('includes')} className={`py-2.5 px-4 transition border-b-2 flex items-center gap-1.5 ${activeTab === 'includes' ? 'text-blue-700 border-blue-700 font-extrabold' : 'text-slate-600 border-transparent'}`}>
        <Sparkles className="w-3.5 h-3.5" /><span>¿Qué incluye?</span>
      </button>
      <button onClick={() => setActiveTab('devices')} className={`py-2.5 px-4 transition border-b-2 flex items-center gap-1.5 ${activeTab === 'devices' ? 'text-blue-700 border-blue-700 font-extrabold' : 'text-slate-600 border-transparent'}`}>
        <Monitor className="w-3.5 h-3.5" /><span>Dispositivos</span>
      </button>
      <button onClick={() => setActiveTab('rules')} className={`py-2.5 px-4 transition border-b-2 flex items-center gap-1.5 ${activeTab === 'rules' ? 'text-blue-700 border-blue-700 font-extrabold' : 'text-slate-600 border-transparent'}`}>
        <ShieldCheck className="w-3.5 h-3.5" /><span>Reglas</span>
      </button>
    </div>
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
    )}
    {activeTab === 'rules' && (
      <div className="p-4 bg-slate-50 border border-slate-900/[0.08] rounded-2xl space-y-3 text-xs text-slate-600">
        <div className="flex items-start gap-2.5"><KeyRound className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" /><div><strong>Licencia Oficial:</strong> Activación segura.</div></div>
        <div className="flex items-start gap-2.5"><AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" /><div><strong>Uso Personal:</strong> Prohibido revender.</div></div>
        <div className="flex items-start gap-2.5"><ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><div><strong>Garantía Total:</strong> Soporte garantizado.</div></div>
      </div>
    )}
  </div>
);
