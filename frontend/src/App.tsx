import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AnnouncementBanner } from './shared/components/AnnouncementBanner';
import { Navbar } from './shared/components/Navbar';
import { HeroSection } from './modules/hero/presentation/HeroSection';
import { CatalogGrid } from './modules/catalog/presentation/containers/CatalogGrid';
import { AdminRepository } from './modules/admin/infrastructure/adminRepository';
import { FaqAccordion } from './modules/faq/presentation/FaqAccordion';
import { TestimonialsSection } from './modules/testimonials/presentation/TestimonialsSection';
import { Footer } from './shared/components/Footer';
import { MobileBottomDock } from './shared/components/MobileBottomDock';
import { ToastNotification } from './shared/components/ToastNotification';

// Carga perezosa (Code Splitting) para componentes secundarios y modales interactivos
const ProductDetailModal = lazy(() => import('./modules/catalog/presentation/containers/ProductDetailModal').then(m => ({ default: m.ProductDetailModal })));
const AdminProductModal = lazy(() => import('./modules/catalog/presentation/containers/AdminProductModal').then(m => ({ default: m.AdminProductModal })));
const AdminLoginForm = lazy(() => import('./modules/admin/presentation/AdminLoginForm').then(m => ({ default: m.AdminLoginForm })));
const AdminDashboardPage = lazy(() => import('./modules/admin/presentation/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const CartDrawer = lazy(() => import('./modules/cart/presentation/CartDrawer').then(m => ({ default: m.CartDrawer })));
const PaymentModal = lazy(() => import('./modules/checkout/presentation/PaymentModal').then(m => ({ default: m.PaymentModal })));
const CustomerNameModal = lazy(() => import('./modules/customer/presentation/CustomerNameModal').then(m => ({ default: m.CustomerNameModal })));

export const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState<string>(() => window.location.hash);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => AdminRepository.isAuthenticated());

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentHash === '#admin') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-bold text-sm">Cargando panel...</div>}>
        {!isAuthenticated ? (
          <AdminLoginForm onSuccess={() => setIsAuthenticated(true)} onBackToStore={() => { window.location.hash = ''; }} />
        ) : (
          <AdminDashboardPage
            onLogout={() => { AdminRepository.logout(); setIsAuthenticated(false); }}
            onGoToStore={() => { window.location.hash = ''; }}
          />
        )}
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 pb-20 md:pb-0">
      <AnnouncementBanner />
      <Navbar />
      <HeroSection />

      <main id="catalog" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase text-blue-700 tracking-wider">Servicios Individuales y Cuentas Completa</span>
          <h2 className="text-3xl font-black text-slate-900">Catálogo de Cuentas Premium</h2>
          <p className="text-slate-600 text-xs font-medium max-w-xl mx-auto">
            Selecciona tu servicio favorito. Elige entre pantalla individual o cuenta completa de 1 mes hasta 12 meses.
          </p>
        </div>
        <CatalogGrid />
      </main>

      <TestimonialsSection />
      <FaqAccordion />
      <Footer />

      {/* Modales, Drawers y Notificaciones diferidos bajo demanda */}
      <Suspense fallback={null}>
        <ProductDetailModal />
        <AdminProductModal />
        <CartDrawer />
        <PaymentModal />
        <CustomerNameModal />
      </Suspense>
      <MobileBottomDock />
      <ToastNotification />
    </div>
  );
};
