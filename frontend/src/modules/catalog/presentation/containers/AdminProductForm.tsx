import React from 'react';
import { Check } from 'lucide-react';

interface AdminProductFormProps {
  simpleName: string;
  setSimpleName: (val: string) => void;
  simpleCategory: 'cine' | 'musica' | 'deportes' | 'trabajo';
  setSimpleCategory: (val: any) => void;
  simplePrice1M: number;
  setSimplePrice1M: (val: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  simpleName, setSimpleName, simpleCategory, setSimpleCategory, simplePrice1M, setSimplePrice1M, onSubmit, onCancel
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Servicio</label>
          <input type="text" value={simpleName} onChange={(e) => setSimpleName(e.target.value)} placeholder="Ej. Paramount+ Ultra HD" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none" required />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Servicio</label>
          <select value={simpleCategory} onChange={(e) => setSimpleCategory(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-600 outline-none">
            <option value="cine">Cine y Series</option>
            <option value="musica">Música & Audio</option>
            <option value="deportes">Deportes en Vivo</option>
            <option value="trabajo">Trabajo & Edición</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Precio 1 Mes ($ COP)</label>
          <input type="number" value={simplePrice1M} onChange={(e) => setSimplePrice1M(Number(e.target.value))} placeholder="15000" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none text-emerald-700 font-mono" required />
        </div>
      </div>
    </div>
    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
      <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-600 bg-slate-100 hover:bg-slate-200 transition">Cancelar</button>
      <button type="submit" className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-blue-700 hover:bg-blue-800 transition shadow-lg shadow-blue-700/20 flex items-center gap-2">
        <Check className="w-4 h-4" /> Guardar Cambios
      </button>
    </div>
  </form>
);
