import React, { useState, useEffect } from 'react';
import { AnnouncementBanner } from './shared/components/AnnouncementBanner';
import { Navbar } from './shared/components/Navbar';
import { HeroSection } from './modules/hero/presentation/HeroSection';
import { CatalogGrid } from './modules/catalog/presentation/containers/CatalogGrid';
import { ProductDetailModal } from './modules/catalog/presentation/containers/ProductDetailModal';
import { AdminProductModal } from './modules/catalog/presentation/containers/AdminProductModal';
import { AdminLoginForm } from './modules/admin/presentation/AdminLoginForm';
import { AdminDashboardPage } from './modules/admin/presentation/AdminDashboardPage';
import { AdminRepository } from './modules/admin/infrastructure/adminRepository';
import { FaqAccordion } from './modules/faq/presentation/FaqAccordion';
import { CartDrawer } from './modules/cart/presentation/CartDrawer';
import { PaymentModal } from './modules/checkout/presentation/PaymentModal';
import { Footer } from './shared/components/Footer';
import { MobileBottomDock } from './shared/components/MobileBottomDock';

export const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState<string>(() => window.location.hash);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => AdminRepository.isAuthenticated());

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Vista Independiente: Mundo Administrador
  if (currentHash === '#admin') {
    if (!isAuthenticated) {
      return (
        <AdminLoginForm
          onSuccess={() => setIsAuthenticated(true)}
          onBackToStore={() => {
            window.location.hash = '';
          }}
        />
      );
    }

    return (
      <AdminDashboardPage
        onLogout={() => {
          AdminRepository.logout();
          setIsAuthenticated(false);
        }}
        onGoToStore={() => {
          window.location.hash = '';
        }}
      />
    );
  }

  // Vista Pública: Tienda y Catálogo
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
      <AdminProductModal />
      <CartDrawer />
      <PaymentModal />
      <MobileBottomDock />
    </div>
  );
};
