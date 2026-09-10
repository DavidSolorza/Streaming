import React from 'react';
import { Zap, ShieldCheck, Star, ShoppingBag, Flame, Lock, CreditCard, MessageCircle } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import videoSource from '../../../../resources/All Streaming Services Originals Intro Effects.mp4';

export const HeroSection: React.FC = () => {
  const scrollToCatalog = () => {
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCombos = () => {
    const combosEl = document.getElementById('combos');
    if (combosEl) {
      combosEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-6 pb-12 overflow-hidden bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Text & Badges con Lucide Icons */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="emerald">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                Entrega Automática Inmediata
              </span>
            </Badge>
            <Badge variant="blue">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Cuentas 100% Garantizadas
              </span>
            </Badge>
            <Badge variant="neutral">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                4.9/5 Reputación
              </span>
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Plataformas de Streaming Premium al{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-emerald-600">
              Mejor Precio de Colombia
            </span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base font-medium max-w-2xl mx-auto">
            Disfruta de Netflix, Disney+, Max, Prime Video, Spotify y Paramount+ con entrega inmediata a tu WhatsApp. Sin cláusulas ni tarjetas internacionales.
          </p>
        </div>

        {/* Hero Widescreen Video Frame Limpio */}
        <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden bg-slate-900 border border-slate-900/[0.08] shadow-[0_10px_30px_-5px_rgba(15,23,42,0.08)]">
          <div className="aspect-[21/9] sm:aspect-[21/9] w-full overflow-hidden relative">
            <video
              src={videoSource}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        </div>

        {/* Botones Estratégicos Debajo del Video */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="lg" onClick={scrollToCatalog}>
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Explorar Catálogo de Cuentas
            </span>
          </Button>
          <Button variant="secondary" size="lg" onClick={scrollToCombos}>
            <span className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              Ver Combos con Descuento
            </span>
          </Button>
        </div>

        {/* Feature Badges Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-900/[0.08] p-4 rounded-2xl text-center shadow-sm flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black text-slate-900">Activación Express</h4>
            <p className="text-[11px] text-slate-500 font-medium">Recibe tu cuenta en menos de 5 min</p>
          </div>

          <div className="bg-white border border-slate-900/[0.08] p-4 rounded-2xl text-center shadow-sm flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black text-slate-900">Garantía Total</h4>
            <p className="text-[11px] text-slate-500 font-medium">Soporte y reemplazo inmediato</p>
          </div>

          <div className="bg-white border border-slate-900/[0.08] p-4 rounded-2xl text-center shadow-sm flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black text-slate-900">Nequi & Daviplata</h4>
            <p className="text-[11px] text-slate-500 font-medium">Pagos locales en pesos colombianos</p>
          </div>

          <div className="bg-white border border-slate-900/[0.08] p-4 rounded-2xl text-center shadow-sm flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black text-slate-900">Atención WhatsApp</h4>
            <p className="text-[11px] text-slate-500 font-medium">Asistencia personal 7 días a la semana</p>
          </div>
        </div>

      </div>
    </section>
  );
};
