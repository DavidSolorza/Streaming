import React, { useState, useEffect } from 'react';
import { Smile, MessageCircle } from 'lucide-react';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { useCustomerProfile } from '../application/useCustomerProfile';

export const CustomerNameModal: React.FC = () => {
  const { isModalOpen, modalTitle, modalSubtitle, profile, confirmName, closeModal } = useCustomerProfile();
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setName(profile.name || '');
      setRememberMe(profile.rememberMe);
      setError(false);
    }
  }, [isModalOpen, profile]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setError(true);
      return;
    }
    confirmName(name, rememberMe);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2.5 text-slate-900">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Smile className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 leading-tight">{modalTitle}</h3>
            <span className="text-[11px] text-slate-500 font-semibold block">Atención cercana y personalizada</span>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          {modalSubtitle}
        </p>

        <div>
          <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
            Tu Nombre o Apodo: <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(false);
            }}
            placeholder="Ej: Carlos Gómez"
            autoFocus
            className={`w-full bg-slate-50 border ${
              error ? 'border-rose-400 focus:border-rose-600' : 'border-slate-200 focus:border-blue-600'
            } text-sm font-bold text-slate-900 rounded-2xl px-4 py-3 focus:outline-none focus:bg-white transition-all`}
          />
          {error && (
            <span className="text-[11px] text-rose-500 font-bold block mt-1">
              Por favor escribe tu nombre para continuar.
            </span>
          )}
        </div>

        <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70 cursor-pointer select-none hover:bg-slate-100/60 transition">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
          />
          <div className="text-xs">
            <span className="font-extrabold text-slate-800 block">Recordarme en este dispositivo</span>
            <span className="text-[10px] text-slate-500 font-medium">Guarda tu nombre en caché para no volver a preguntarte.</span>
          </div>
        </label>

        <div className="pt-2 flex gap-2.5">
          <Button variant="ghost" fullWidth onClick={closeModal} type="button">
            Cancelar
          </Button>
          <Button variant="mint" fullWidth type="submit">
            <span className="flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-800" />
              <span>Continuar a WhatsApp</span>
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
