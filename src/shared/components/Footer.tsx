import React from 'react';
import { ShieldCheck, Clock, Zap, MessageCircle, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b0f17] text-slate-400 border-t border-white/5 pt-16 pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Grilla Principal (4 Columnas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          
          {/* Columna 1: Marca & Propósito con Logo Prominente */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 ring-2 ring-blue-500/20 shadow-md flex items-center justify-center bg-white shrink-0 p-0.5">
                <img src="/perfil.png" alt="Cuentas y plataformas de streaming JP" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <span className="font-black text-sm text-white tracking-wide block leading-tight">
                  Cuentas y plataformas <span className="text-blue-400">de streaming JP</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  En línea & Servicio 24/7
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Plataforma colombiana especializada en licencias digitales, perfiles individuales con PIN y cuentas completas con activación rápida en minutos.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Garantía de reposición activa</span>
            </div>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Explorar
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#catalog" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Catálogo de Plataformas</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                </a>
              </li>
              <li>
                <a href="#premieres" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Estrenos del Mes</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                </a>
              </li>
              <li>
                <a href="#testimonios" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Testimonios de Clientes</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Preguntas Frecuentes</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Atención al Cliente Interactiva */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Atención al Cliente
            </h4>
            
            <a 
              href="https://wa.me/573214465418?text=Hola%20Quiero%20mas%20informacion" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-white font-medium text-xs group"
            >
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  En línea ahora
                </span>
                <span>+57 321 446 5418</span>
              </div>
            </a>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Lun a Dom: 8:00 AM – 10:00 PM</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Entrega estimada: 5 a 15 minutos</span>
            </div>
          </div>

          {/* Columna 4: Garantía & Seguridad */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Respaldo & Compromiso
            </h4>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-white font-medium text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Cuentas 100% Verificadas</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Todas las suscripciones cuentan con soporte técnico y garantía de reemplazo inmediato durante la vigencia del plan contratado.
              </p>
            </div>
          </div>

        </div>

        {/* Fila Inferior: Medios de Pago & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} Cuentas y plataformas de streaming JP. Todos los derechos reservados.
          </p>

          {/* Pastillas de Métodos de Pago */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[11px] text-slate-500 mr-1">Pagos seguros con:</span>
            {['Nequi', 'Daviplata', 'Bancolombia', 'PSE'].map((metodo) => (
              <span 
                key={metodo}
                className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-medium text-slate-300 tracking-tight hover:border-white/20 transition"
              >
                {metodo}
              </span>
            ))}
          </div>
        </div>

        {/* Disclaimer legal sutil */}
        <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-slate-600 text-center leading-relaxed max-w-4xl mx-auto">
          Los nombres, marcas y logotipos de Netflix, Disney+, Max, Prime Video, Spotify y demás servicios son marcas registradas de sus respectivos propietarios. Este portal ofrece servicios de intermediación y asistencia técnica digital.
        </div>

      </div>
    </footer>
  );
};
