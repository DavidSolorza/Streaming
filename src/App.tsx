import React from 'react';
import { AnnouncementBanner } from './shared/components/AnnouncementBanner';
import { Navbar } from './shared/components/Navbar';
import { HeroSection } from './modules/hero/presentation/HeroSection';
import { CatalogGrid } from './modules/catalog/presentation/containers/CatalogGrid';
import { ProductDetailModal } from './modules/catalog/presentation/containers/ProductDetailModal';
import { FaqAccordion } from './modules/faq/presentation/FaqAccordion';
import { CartDrawer } from './modules/cart/presentation/CartDrawer';
import { PaymentModal } from './modules/checkout/presentation/PaymentModal';
import { MobileBottomDock } from './shared/components/MobileBottomDock';

export const App: React.FC = () => {

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 pb-20 md:pb-0">
      {/* Top Banner & Header */}
      <AnnouncementBanner />
      <Navbar />

      {/* Hero Section con Video Requerido */}
      <HeroSection />

      {/* Catálogo Principal */}
      <main id="catalog" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase text-blue-700 tracking-wider">Servicios Individuales y Cuentas Completa</span>
          <h2 className="text-3xl font-black text-slate-900">Catálogo de Cuentas Premium</h2>
          <p className="text-slate-500 text-xs font-medium max-w-xl mx-auto">
            Selecciona tu servicio favorito. Elige entre pantalla individual o cuenta completa de 1 mes hasta 12 meses.
          </p>
        </div>

        <CatalogGrid />
      </main>



      {/* Preguntas Frecuentes */}
      <FaqAccordion />

      {/* Footer Pro */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-base font-extrabold text-white">Cuentas Stream Colombia</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Plataforma líder en distribución de cuentas de streaming premium, perfiles individuales y licencias digitales con entrega automatizada.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Atención al Cliente</h4>
              <p className="text-xs font-medium text-slate-400">📲 WhatsApp: +57 321 446 5418</p>
              <p className="text-xs font-medium text-slate-400">⏰ Horario: Lunes a Domingo - 8:00 AM a 10:00 PM</p>
              <p className="text-xs font-medium text-slate-400">⚡ Tiempo de entrega promedio: 5 minutos</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Garantía & Seguridad</h4>
              <p className="text-xs font-medium text-slate-400">🛡️ Cuentas de proveedor oficial con renovación mensual.</p>
              <p className="text-xs font-medium text-slate-400">💳 Métodos de Pago: Nequi, Daviplata, Bancolombia, PSE.</p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 text-center text-[11px] font-semibold text-slate-500">
            © {new Date().getFullYear()} Cuentas Stream Colombia. Todos los derechos reservados. Mockup de Demostración Visual.
          </div>
        </div>
      </footer>

      {/* Modales y Drawers Globales */}
      <ProductDetailModal />
      <CartDrawer />
      <PaymentModal />
      <MobileBottomDock />
    </div>
  );
};
