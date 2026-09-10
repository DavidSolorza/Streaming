import React, { useState } from 'react';
import { Flame, X } from 'lucide-react';

export const AnnouncementBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-xs md:text-sm font-semibold py-2 px-4 text-center relative shadow-md flex items-center justify-center gap-2">
      <Flame className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
      <span>¡Promoción de la Semana! Garantía del 100% durante todo el periodo contratado y entrega en 5 min.</span>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-75 hover:opacity-100 transition p-1"
        title="Cerrar aviso"
      >
        <X className="w-4 h-4 text-white" />
      </button>
    </div>
  );
};
