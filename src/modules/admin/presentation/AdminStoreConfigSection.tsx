import React from 'react';
import { CreditCard, Save, MessageCircle } from 'lucide-react';
import { PaymentConfig } from '../domain/entities/AdminConfig';

interface AdminStoreConfigSectionProps {
  storeConfig: PaymentConfig;
  setStoreConfig: (config: PaymentConfig) => void;
  onSave: (e: React.FormEvent) => void;
}

export const AdminStoreConfigSection: React.FC<AdminStoreConfigSectionProps> = ({
  storeConfig, setStoreConfig, onSave
}) => (
  <section className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <div className="flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200"><CreditCard className="w-4 h-4" /></div>
        <div>
          <h2 className="font-black text-slate-900 text-sm">Datos de la Tienda, WhatsApp y Cuentas de Pago</h2>
          <p className="text-[11px] text-slate-500 font-medium">Configura el nombre comercial y medios de pago.</p>
        </div>
      </div>
      <button type="submit" form="store-form" className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm">
        <Save className="w-4 h-4" /> Guardar Todos los Datos
      </button>
    </div>
    <form id="store-form" onSubmit={onSave} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Tienda</label>
          <input type="text" value={storeConfig.storeName} onChange={(e) => setStoreConfig({ ...storeConfig, storeName: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 outline-none" required />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp de Pedidos</label>
          <div className="relative">
            <input type="text" value={storeConfig.whatsappNumber} onChange={(e) => setStoreConfig({ ...storeConfig, whatsappNumber: e.target.value })} className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 font-mono outline-none" required />
            <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-200/80 space-y-2">
          <span className="text-xs font-black text-purple-950">Nequi</span>
          <input type="text" value={storeConfig.nequiNumber} onChange={(e) => setStoreConfig({ ...storeConfig, nequiNumber: e.target.value })} className="w-full px-2.5 py-1.5 rounded-xl border text-xs font-bold font-mono bg-white" required />
          <input type="text" value={storeConfig.nequiHolder} onChange={(e) => setStoreConfig({ ...storeConfig, nequiHolder: e.target.value })} className="w-full px-2.5 py-1.5 rounded-xl border text-xs font-bold bg-white" required />
        </div>
        <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/80 space-y-2">
          <span className="text-xs font-black text-amber-950">Bancolombia</span>
          <input type="text" value={storeConfig.bancolombiaAccount} onChange={(e) => setStoreConfig({ ...storeConfig, bancolombiaAccount: e.target.value })} className="w-full px-2.5 py-1.5 rounded-xl border text-xs font-bold font-mono bg-white" required />
          <input type="text" value={storeConfig.bancolombiaHolder} onChange={(e) => setStoreConfig({ ...storeConfig, bancolombiaHolder: e.target.value })} className="w-full px-2.5 py-1.5 rounded-xl border text-xs font-bold bg-white" required />
        </div>
        <div className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-200/80 space-y-2">
          <span className="text-xs font-black text-rose-950">Daviplata</span>
          <input type="text" value={storeConfig.daviplataNumber} onChange={(e) => setStoreConfig({ ...storeConfig, daviplataNumber: e.target.value })} className="w-full px-2.5 py-1.5 rounded-xl border text-xs font-bold font-mono bg-white" required />
          <input type="text" value={storeConfig.daviplataHolder} onChange={(e) => setStoreConfig({ ...storeConfig, daviplataHolder: e.target.value })} className="w-full px-2.5 py-1.5 rounded-xl border text-xs font-bold bg-white" required />
        </div>
      </div>
    </form>
  </section>
);
