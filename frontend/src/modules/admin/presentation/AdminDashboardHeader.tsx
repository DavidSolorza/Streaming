import React from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';
import { PaymentConfig } from '../domain/entities/AdminConfig';

interface AdminDashboardHeaderProps {
  storeConfig: PaymentConfig;
  onGoToStore: () => void;
  onLogout: () => void;
}

export const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({
  storeConfig, onGoToStore, onLogout
}) => (
  <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg border-b border-slate-800">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-3.5">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 ring-2 ring-blue-500/30 shadow-md flex items-center justify-center bg-white p-0.5 shrink-0">
          <img src="/perfil.png" alt={storeConfig.storeName} className="w-full h-full object-cover rounded-full" />
        </div>
        <div>
          <h1 className="font-black text-sm sm:text-base text-white leading-tight">
            {storeConfig.storeName || 'Cuentas JP'} — Panel Administrativo
          </h1>
          <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-wider block mt-0.5">
            Edición Sencilla de Precios y Disponibilidad
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button onClick={onGoToStore} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-extrabold flex items-center gap-1.5 transition shadow-sm">
          <ArrowLeft className="w-4 h-4" /> Ver Mi Tienda
        </button>
        <button onClick={onLogout} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 border border-slate-700 transition">
          <LogOut className="w-4 h-4" /> Salir
        </button>
      </div>
    </div>
  </header>
);
