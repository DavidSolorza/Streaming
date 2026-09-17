import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

export interface Testimonial {
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

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial: t }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 group hover:border-blue-300">
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {[...Array(t.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="text-[10px] text-slate-400 font-extrabold">{t.date}</span>
      </div>
      <p className="text-xs font-semibold text-slate-700 leading-relaxed italic">"{t.comment}"</p>
    </div>
    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs border ${t.avatarBg}`}>
          {t.initials}
        </div>
        <div>
          <span className="font-extrabold text-slate-900 text-xs block leading-tight flex items-center gap-1">
            {t.name}
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 inline shrink-0" />
          </span>
          <span className="text-[10px] text-slate-400 font-bold block">{t.city}</span>
        </div>
      </div>
      <span className="text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200/80 px-2 py-1 rounded-xl shrink-0 max-w-[120px] truncate">
        {t.product}
      </span>
    </div>
  </div>
);
