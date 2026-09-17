import React from 'react';
import { PlatformIcon } from '@/shared/components/PlatformIcon';
import { Eye, EyeOff, Edit3, Trash2 } from 'lucide-react';
import { Product } from '../../domain/entities/Product';

interface AdminProductListProps {
  products: Product[];
  onToggleAvailability: (id: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number, name: string) => void;
}

export const AdminProductList: React.FC<AdminProductListProps> = ({
  products, onToggleAvailability, onEdit, onDelete
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 gap-3">
      {products.map((prod) => (
        <div key={prod.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shadow-sm ${prod.logoBg}`}>
              <PlatformIcon icon={prod.iconName} name={prod.brand || prod.name} className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-slate-900 text-sm">{prod.name}</h4>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">{prod.category}</span>
                {prod.category === 'combo' && <span className="text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">Combo</span>}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-600">
                <div><span className="font-semibold text-slate-400">Pantalla 1m:</span> <span className="font-bold text-slate-900">${prod.modes.pantalla.prices['1m'].toLocaleString('es-CO')}</span></div>
                <div><span className="font-semibold text-slate-400">Cuenta 1m:</span> <span className="font-bold text-slate-900">${prod.modes.cuenta.prices['1m'].toLocaleString('es-CO')}</span></div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
            <button onClick={() => onToggleAvailability(prod.id)} className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition border flex items-center gap-1.5 ${prod.available ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-amber-50 hover:text-amber-700' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}>
              {prod.available ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {prod.available ? 'Pausar' : 'Activar'}
            </button>
            <button onClick={() => onEdit(prod)} className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />Editar
            </button>
            <button onClick={() => onDelete(prod.id, prod.name)} className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
