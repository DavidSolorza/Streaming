import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface FaqNodeItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
  children?: FaqNodeItem[];
}

interface RecursiveFaqNodeProps {
  item: FaqNodeItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

/**
 * 🔄 Componente UI Recursivo para renderizar nodos de FAQ y sub-preguntas anidadas
 */
export const RecursiveFaqNode: React.FC<RecursiveFaqNodeProps> = ({ item, isOpen, onToggle, index }) => {
  const contentId = `faq-content-${index}`;
  const headerId = `faq-header-${index}`;

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 ${
      isOpen ? 'border-blue-500 shadow-luxury ring-1 ring-blue-500/20' : 'border-slate-900/[0.08] shadow-sm hover:border-slate-300'
    }`}>
      <h3>
        <button
          id={headerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={onToggle}
          className="w-full text-left p-5 font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-4 focus:outline-none rounded-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-xl shrink-0">{item.icon}</div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-0.5">{item.category}</span>
              <span className="text-slate-900 leading-snug">{item.question}</span>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-700' : ''}`} />
        </button>
      </h3>

      {isOpen && (
        <div id={contentId} role="region" aria-labelledby={headerId} className="px-5 pb-5 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-4 pl-14 animate-fadeIn space-y-3">
          <p>{item.answer}</p>
          {item.children && item.children.length > 0 && (
            <div className="mt-3 space-y-2 border-l-2 border-blue-200 pl-3">
              {item.children.map((child, childIdx) => (
                <RecursiveFaqNode key={child.id} item={child} isOpen={true} onToggle={() => {}} index={index * 10 + childIdx} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
