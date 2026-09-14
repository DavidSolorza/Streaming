import React from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageCircle, Heart, UserCheck, Sparkles } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  city: string;
  product: string;
  comment: string;
  rating: number;
  date: string;
  avatarBg: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Camila Torres',
    city: 'Bogotá D.C.',
    product: 'Canva Pro (12 Meses)',
    comment: '¡Excelente servicio! Pagué por Nequi mi suscripción de Canva Pro y en menos de 3 minutos ya la tenía activada en mi correo personal. Totalmente confiables.',
    rating: 5,
    date: 'Hace 2 días',
    avatarBg: 'bg-teal-500/20 text-teal-700 border-teal-300',
    initials: 'CT'
  },
  {
    id: '2',
    name: 'Mateo Bermúdez',
    city: 'Medellín',
    product: 'Netflix Original & Disney+',
    comment: 'Llevo 8 meses renovando mis pantallas con JP. La atención por WhatsApp es súper rápida y amigable. Nunca he tenido caídas y la calidad 4K es impecable.',
    rating: 5,
    date: 'Hace 4 días',
    avatarBg: 'bg-red-500/20 text-red-700 border-red-300',
    initials: 'MB'
  },
  {
    id: '3',
    name: 'Daniela Morales',
    city: 'Cali',
    product: 'Combo VIP (Max + Crunchyroll)',
    comment: 'Compré el combo para ver mis series y animes favoritos. El ahorro frente a pagar las plataformas por separado es gigante. ¡100% recomendados en Colombia!',
    rating: 5,
    date: 'Hace 1 semana',
    avatarBg: 'bg-purple-500/20 text-purple-700 border-purple-300',
    initials: 'DM'
  },
  {
    id: '4',
    name: 'Santiago Ríos',
    city: 'Bucaramanga',
    product: 'CapCut Pro & Gemini AI',
    comment: 'Trabajo creando contenido y necesitaba CapCut sin marca de agua e inteligencia artificial. Me activaron ambas herramientas el mismo día. La mejor inversión.',
    rating: 5,
    date: 'Hace 1 semana',
    avatarBg: 'bg-blue-500/20 text-blue-700 border-blue-300',
    initials: 'SR'
  },
  {
    id: '5',
    name: 'Valentina Gómez',
    city: 'Barranquilla',
    product: 'Netflix Único (Código)',
    comment: 'Me explicaron paso a paso con amabilidad cómo ingresar el código de acceso. Es súper fácil y seguro. Me encanta la paciencia de soporte.',
    rating: 5,
    date: 'Hace 2 semanas',
    avatarBg: 'bg-amber-500/20 text-amber-700 border-amber-300',
    initials: 'VG'
  },
  {
    id: '6',
    name: 'Andrés Felipe Ruiz',
    city: 'Pereira',
    product: 'IPTV Latino & Spotify',
    comment: 'Los canales de fútbol en vivo se ven nítidos sin cortes. Ya le recomendé Cuentas JP a todos mis compañeros del trabajo. ¡Sigan así de eficientes!',
    rating: 5,
    date: 'Hace 2 semanas',
    avatarBg: 'bg-emerald-500/20 text-emerald-700 border-emerald-300',
    initials: 'AR'
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonios" className="py-14 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Encabezado Principal */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Opiniones & Experiencias de Clientes</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Lo que dicen nuestros Clientes en Colombia
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-2xl mx-auto leading-relaxed">
            Más de <b>1,500 clientes</b> confían en <b>Cuentas y plataformas de streaming JP</b> para disfrutar de su contenido favorito con garantía total de servicio.
          </p>
        </div>

        {/* Métricas & Garantía */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div className="p-3">
            <span className="text-2xl font-black text-slate-900 block flex items-center justify-center gap-1">
              <span>4.9</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </span>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Promedio de Calificación</span>
          </div>

          <div className="p-3 border-l border-slate-100">
            <span className="text-2xl font-black text-emerald-600 block">+1,500</span>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Clientes Activos</span>
          </div>

          <div className="p-3 border-l border-slate-100">
            <span className="text-2xl font-black text-blue-700 block">&lt; 5 Min</span>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Tiempo de Entrega</span>
          </div>

          <div className="p-3 border-l border-slate-100">
            <span className="text-2xl font-black text-purple-700 block">100%</span>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Garantía de Reposición</span>
          </div>
        </div>

        {/* Grilla de Tarjetas de Testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div 
              key={t.id}
              className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 group hover:border-blue-300"
            >
              <div className="space-y-3">
                
                {/* Header de la tarjeta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-extrabold">{t.date}</span>
                </div>

                {/* Comentario */}
                <p className="text-xs font-semibold text-slate-700 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              {/* Footer con datos del cliente y producto */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs border ${t.avatarBg}`}>
                    {t.initials}
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 text-xs block leading-tight flex items-center gap-1">
                      {t.name}
                      <span title="Cliente Verificado">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 inline shrink-0" />
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold block">{t.city}</span>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200/80 px-2 py-1 rounded-xl shrink-0 max-w-[120px] truncate">
                  {t.product}
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* Llamado a la Acción para dejar opinión por WhatsApp */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-black flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              ¿Ya eres cliente de Cuentas JP?
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              Escríbenos por WhatsApp para contarnos tu experiencia o solicitar tu próxima cuenta con atención personalizada.
            </p>
          </div>

          <a
            href="https://wa.me/573214465418?text=Hola%20JP!%20Quiero%20comprar%20una%20cuenta%20y%20dejar%20mi%20testimonio"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Hablar con JP por WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
