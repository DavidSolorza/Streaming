import React from 'react';
import { AnnouncementBanner } from './shared/components/AnnouncementBanner';
import { Navbar } from './shared/components/Navbar';
import { HeroSection } from './modules/hero/presentation/HeroSection';
import { CatalogGrid } from './modules/catalog/presentation/containers/CatalogGrid';
import { ProductDetailModal } from './modules/catalog/presentation/containers/ProductDetailModal';
import { FaqAccordion } from './modules/faq/presentation/FaqAccordion';
import { CartDrawer } from './modules/cart/presentation/CartDrawer';
import { PaymentModal } from './modules/checkout/presentation/PaymentModal';
import { Footer } from './shared/components/Footer';
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

      {/* Footer Pro Rediseñado */}
      <Footer />

      {/* Modales y Drawers Globales */}
      <ProductDetailModal />
      <CartDrawer />
      <PaymentModal />
      <MobileBottomDock />
    </div>
  );
};
