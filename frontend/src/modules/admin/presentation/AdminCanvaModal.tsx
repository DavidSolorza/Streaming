import React from 'react';
import { X, Check } from 'lucide-react';
import { PlatformIcon } from '@/shared/components/PlatformIcon';

interface AdminCanvaModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvaPriceCorreo: number;
  setCanvaPriceCorreo: (v: number) => void;
  canvaPrice1M: number;
  setCanvaPrice1M: (v: number) => void;
  canvaPrice6M: number;
  setCanvaPrice6M: (v: number) => void;
  canvaPrice12M: number;
  setCanvaPrice12M: (v: number) => void;
  onSave: (e: React.FormEvent) => void;
}

export const AdminCanvaModal: React.FC<AdminCanvaModalProps> = ({
  isOpen, onClose, canvaPriceCorreo, setCanvaPriceCorreo, canvaPrice1M, setCanvaPrice1M,
  canvaPrice6M, setCanvaPrice6M, canvaPrice12M, setCanvaPrice12M, onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg flex flex-col overflow-hidden my-auto">
        <div className="px-6 py-4 bg-teal-50 border-b border-teal-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
              <PlatformIcon icon="/icons/icons8-canva-windows-11-color/icons8-canva-96.png" name="Canva Pro" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-teal-950 text-base">Modificar Precios de Canva Pro</h3>
              <p className="text-xs text-teal-700 font-medium">Ajusta los 4 planes disponibles</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center border border-teal-200"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={onSave} className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="bg-slate-50 p-3 rounded-2xl border flex items-center justify-between">
              <div><label className="block text-xs font-black text-slate-900">Canva Correo Propio</label></div>
              <input type="number" value={canvaPriceCorreo} onChange={(e) => setCanvaPriceCorreo(Number(e.target.value))} className="w-28 px-3 py-1.5 rounded-xl border text-xs font-black font-mono text-right" required />
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border flex items-center justify-between">
              <div><label className="block text-xs font-black text-slate-900">Canva 1 mes</label></div>
              <input type="number" value={canvaPrice1M} onChange={(e) => setCanvaPrice1M(Number(e.target.value))} className="w-28 px-3 py-1.5 rounded-xl border text-xs font-black font-mono text-right" required />
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border flex items-center justify-between">
              <div><label className="block text-xs font-black text-slate-900">Canva 6 meses</label></div>
              <input type="number" value={canvaPrice6M} onChange={(e) => setCanvaPrice6M(Number(e.target.value))} className="w-28 px-3 py-1.5 rounded-xl border text-xs font-black font-mono text-right" required />
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border flex items-center justify-between">
              <div><label className="block text-xs font-black text-slate-900">Canva 12 meses</label></div>
              <input type="number" value={canvaPrice12M} onChange={(e) => setCanvaPrice12M(Number(e.target.value))} className="w-28 px-3 py-1.5 rounded-xl border text-xs font-black font-mono text-right" required />
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3 pt-3 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100">Cancelar</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-teal-600 flex items-center gap-1.5"><Check className="w-4 h-4" /> Guardar Precios</button>
          </div>
        </form>
      </div>
    </div>
  );
};
