import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowLeft, Key, AlertCircle } from 'lucide-react';
import { AdminRepository } from '../infrastructure/adminRepository';

interface AdminLoginFormProps {
  onSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onSuccess, onBackToStore }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (AdminRepository.verifyPassword(password)) {
      AdminRepository.login();
      onSuccess();
    } else {
      setError('Contraseña incorrecta. Por favor verifica e intentalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 selection:bg-blue-100 selection:text-blue-900">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-luxury p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 mx-auto flex items-center justify-center shadow-md shadow-blue-700/10">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Panel Administrador</h2>
            <p className="text-slate-500 text-xs font-medium mt-1">
              Ingresa la contraseña de acceso para administrar catálogo y pagos.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 flex items-center gap-2.5 text-rose-700 text-xs font-bold animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-blue-700" />
              Contraseña de Administración
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Ingresa la contraseña (ej. admin123)"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                required
                autoFocus
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-1">
              * Contraseña genérica inicial: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-bold">admin123</code>
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs py-3.5 rounded-xl transition shadow-lg shadow-blue-700/20 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Ingresar al Panel Segurizado
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <button
            onClick={onBackToStore}
            className="text-xs font-bold text-slate-500 hover:text-blue-700 transition inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la Tienda Pública
          </button>
        </div>

      </div>
    </div>
  );
};
