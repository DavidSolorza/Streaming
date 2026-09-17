import React from 'react';
import { FooterBranding } from './FooterBranding';
import { FooterNavLinks } from './FooterNavLinks';
import { FooterSupport } from './FooterSupport';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b0f17] text-slate-400 border-t border-white/5 pt-16 pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          <FooterBranding />
          <FooterNavLinks />
          <FooterSupport />
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} Cuentas y plataformas de streaming JP. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[11px] text-slate-500 mr-1">Pagos seguros con:</span>
            {['Nequi', 'Daviplata', 'Bancolombia', 'PSE'].map((metodo) => (
              <span key={metodo} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-medium text-slate-300 tracking-tight hover:border-white/20 transition">
                {metodo}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-slate-600 text-center leading-relaxed max-w-4xl mx-auto">
          Los nombres, marcas y logotipos de Netflix, Disney+, Max, Prime Video, Spotify y demás servicios son marcas registradas de sus respectivos propietarios. Este portal ofrece servicios de intermediación y asistencia técnica digital.
        </div>
      </div>
    </footer>
  );
};
