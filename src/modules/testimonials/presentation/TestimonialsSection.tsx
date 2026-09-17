import React from 'react';
import { TestimonialsHeader } from './TestimonialsHeader';
import { TestimonialCard, Testimonial } from './TestimonialCard';
import { TestimonialsCTA } from './TestimonialsCTA';

const TESTIMONIALS: Testimonial[] = [
  { id: '1', name: 'Camila Torres', city: 'Bogotá D.C.', product: 'Canva Pro (12 Meses)', comment: '¡Excelente servicio! Pagué por Nequi mi suscripción de Canva Pro y en menos de 3 minutos ya la tenía activada en mi correo personal.', rating: 5, date: 'Hace 2 días', avatarBg: 'bg-teal-500/20 text-teal-700 border-teal-300', initials: 'CT' },
  { id: '2', name: 'Mateo Bermúdez', city: 'Medellín', product: 'Netflix Original & Disney+', comment: 'Llevo 8 meses renovando mis pantallas con JP. La atención por WhatsApp es súper rápida y amigable. Nunca he tenido caídas.', rating: 5, date: 'Hace 4 días', avatarBg: 'bg-red-500/20 text-red-700 border-red-300', initials: 'MB' },
  { id: '3', name: 'Daniela Morales', city: 'Cali', product: 'Combo VIP (Max + Crunchyroll)', comment: 'Compré el combo para ver mis series y animes favoritos. El ahorro frente a pagar las plataformas por separado es gigante.', rating: 5, date: 'Hace 1 semana', avatarBg: 'bg-purple-500/20 text-purple-700 border-purple-300', initials: 'DM' },
  { id: '4', name: 'Santiago Ríos', city: 'Bucaramanga', product: 'CapCut Pro & Gemini AI', comment: 'Trabajo creando contenido y necesitaba CapCut sin marca de agua e inteligencia artificial. Me activaron ambas herramientas el mismo día.', rating: 5, date: 'Hace 1 semana', avatarBg: 'bg-blue-500/20 text-blue-700 border-blue-300', initials: 'SR' },
  { id: '5', name: 'Valentina Gómez', city: 'Barranquilla', product: 'Netflix Único (Código)', comment: 'Me explicaron paso a paso con amabilidad cómo ingresar el código de acceso. Es súper fácil y seguro.', rating: 5, date: 'Hace 2 semanas', avatarBg: 'bg-amber-500/20 text-amber-700 border-amber-300', initials: 'VG' },
  { id: '6', name: 'Andrés Felipe Ruiz', city: 'Pereira', product: 'IPTV Latino & Spotify', comment: 'Los canales de fútbol en vivo se ven nítidos sin cortes. Ya le recomendé Cuentas JP a todos mis compañeros.', rating: 5, date: 'Hace 2 semanas', avatarBg: 'bg-emerald-500/20 text-emerald-700 border-emerald-300', initials: 'AR' }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonios" className="py-14 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <TestimonialsHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
        <TestimonialsCTA />
      </div>
    </section>
  );
};
