import React, { useState } from 'react';
import { BarChart3, Package, Star, Settings, Check, ExternalLink } from 'lucide-react';
import { AdminDashboardHeader } from './AdminDashboardHeader';
import { AdminStoreConfigSection } from './AdminStoreConfigSection';
import { AdminMonthlyStatsSection } from './AdminMonthlyStatsSection';
import { AdminReviewsSection } from './AdminReviewsSection';
import { AdminCanvaModal } from './AdminCanvaModal';
import { useAdminDashboard } from './useAdminDashboard';
import { AdminProductModal } from '@/modules/catalog/presentation/containers/AdminProductModal';
import { eventBus } from '@/core/bus/eventBus';

export const AdminDashboardPage: React.FC<{ onLogout: () => void; onGoToStore: () => void }> = ({
  onLogout, onGoToStore
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'catalog' | 'reviews' | 'config'>('stats');
  const d = useAdminDashboard();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 pb-16">
      <AdminDashboardHeader storeConfig={d.storeConfig} onGoToStore={onGoToStore} onLogout={onLogout} />

      {d.successMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-emerald-400">
          <Check className="w-4 h-4" /> {d.successMessage}
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 w-full">
        {/* Barra de Pestañas de Navegación del Admin */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {[
            { id: 'stats', label: 'Resumen & Ventas', icon: BarChart3 },
            { id: 'catalog', label: 'Catálogo & Precios', icon: Package },
            { id: 'reviews', label: 'Reseñas Clientes', icon: Star },
            { id: 'config', label: 'Ajustes & Cuentas', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                  active ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contenido según la pestaña activa */}
        {activeTab === 'stats' && <AdminMonthlyStatsSection />}
        {activeTab === 'reviews' && <AdminReviewsSection />}
        {activeTab === 'config' && (
          <AdminStoreConfigSection storeConfig={d.storeConfig} setStoreConfig={d.setStoreConfig} onSave={d.handleSaveStoreConfig} />
        )}
        {activeTab === 'catalog' && (
          <section className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-slate-900 text-base">Control de Productos y Precios</h3>
                <p className="text-xs text-slate-500">Ajusta valores en COP sincronizados con Supabase.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => d.setIsCanvaModalOpen(true)} className="px-4 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700">Precios Canva</button>
                <button onClick={() => eventBus.emit('ADMIN:OPEN_MODAL', undefined)} className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700">Editor de Catálogo</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-slate-600">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">📺 Netflix, Disney, Max, Spotify</div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">⚡ Planes 1m, 3m, 6m y 12m</div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">💳 Actualización Inmediata</div>
            </div>
          </section>
        )}
      </main>

      <AdminProductModal />
      <AdminCanvaModal
        isOpen={d.isCanvaModalOpen}
        onClose={() => d.setIsCanvaModalOpen(false)}
        canvaPriceCorreo={d.canvaPriceCorreo}
        setCanvaPriceCorreo={d.setCanvaPriceCorreo}
        canvaPrice1M={d.canvaPrice1M}
        setCanvaPrice1M={d.setCanvaPrice1M}
        canvaPrice6M={d.canvaPrice6M}
        setCanvaPrice6M={d.setCanvaPrice6M}
        canvaPrice12M={d.canvaPrice12M}
        setCanvaPrice12M={d.setCanvaPrice12M}
        onSave={(e) => { e.preventDefault(); d.setIsCanvaModalOpen(false); }}
      />
    </div>
  );
};
