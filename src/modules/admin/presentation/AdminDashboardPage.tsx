import React from 'react';
import { Check } from 'lucide-react';
import { AdminDashboardHeader } from './AdminDashboardHeader';
import { AdminStoreConfigSection } from './AdminStoreConfigSection';
import { AdminCanvaModal } from './AdminCanvaModal';
import { useAdminDashboard } from './useAdminDashboard';

interface AdminDashboardPageProps {
  onLogout: () => void;
  onGoToStore: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onLogout, onGoToStore }) => {
  const {
    storeConfig, setStoreConfig, successMessage,
    isCanvaModalOpen, setIsCanvaModalOpen, canvaPriceCorreo, setCanvaPriceCorreo,
    canvaPrice1M, setCanvaPrice1M, canvaPrice6M, setCanvaPrice6M, canvaPrice12M, setCanvaPrice12M,
    handleSaveStoreConfig
  } = useAdminDashboard();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 pb-16">
      <AdminDashboardHeader storeConfig={storeConfig} onGoToStore={onGoToStore} onLogout={onLogout} />
      {successMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-fadeIn border border-emerald-400">
          <Check className="w-4 h-4" />
          {successMessage}
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 w-full">
        <AdminStoreConfigSection storeConfig={storeConfig} setStoreConfig={setStoreConfig} onSave={handleSaveStoreConfig} />
      </div>
      <AdminCanvaModal
        isOpen={isCanvaModalOpen}
        onClose={() => setIsCanvaModalOpen(false)}
        canvaPriceCorreo={canvaPriceCorreo}
        setCanvaPriceCorreo={setCanvaPriceCorreo}
        canvaPrice1M={canvaPrice1M}
        setCanvaPrice1M={setCanvaPrice1M}
        canvaPrice6M={canvaPrice6M}
        setCanvaPrice6M={setCanvaPrice6M}
        canvaPrice12M={canvaPrice12M}
        setCanvaPrice12M={setCanvaPrice12M}
        onSave={(e) => { e.preventDefault(); setIsCanvaModalOpen(false); }}
      />
    </div>
  );
};
