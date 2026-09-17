import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const links = [
  { href: '#catalog', label: 'Catálogo de Plataformas' },
  { href: '#premieres', label: 'Estrenos del Mes' },
  { href: '#testimonios', label: 'Testimonios de Clientes' },
  { href: '#faq', label: 'Preguntas Frecuentes' },
];

export const FooterNavLinks: React.FC = () => (
  <div>
    <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Explorar</h4>
    <ul className="space-y-2.5 text-xs">
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} className="hover:text-white transition-colors flex items-center justify-between group">
            <span>{link.label}</span>
            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
          </a>
        </li>
      ))}
    </ul>
  </div>
);
