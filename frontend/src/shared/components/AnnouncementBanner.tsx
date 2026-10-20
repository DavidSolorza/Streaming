import React, { useState, useEffect } from 'react';
import { Flame, X } from 'lucide-react';
import { AdminRepository } from '@/modules/admin/infrastructure/adminRepository';
import { eventBus } from '@/core/bus/eventBus';

export const AnnouncementBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [announcement, setAnnouncement] = useState<string>(() => AdminRepository.getPaymentConfig().announcementText);

  useEffect(() => {
    const unsub = eventBus.on('ADMIN:CONFIG_CHANGED', (newConfig) => {
      setAnnouncement(newConfig.announcementText);
    });
    return unsub;
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-xs md:text-sm font-semibold py-2 px-4 text-center relative shadow-md flex items-center justify-center gap-2">
      <Flame className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
      <span>{announcement}</span>
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
