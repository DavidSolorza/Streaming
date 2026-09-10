import React, { useState } from 'react';

export const AnnouncementBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-xs md:text-sm font-semibold py-2 px-4 text-center relative shadow-md">
      <span className="inline-block animate-pulse mr-1.5">🔥</span> 
      <span>¡Promoción de la Semana! Garantía del 100% durante todo el periodo contratado y entrega en 10 min.</span>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-75 hover:opacity-100 text-lg"
        title="Cerrar aviso"
      >
        &times;
      </button>
    </div>
  );
};
