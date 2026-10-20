import React from 'react';
import { Monitor, Sparkles, KeyRound } from 'lucide-react';

interface ProductCardSpecsProps {
  devices: string;
  quality: string;
  access: string;
}

export const ProductCardSpecs: React.FC<ProductCardSpecsProps> = ({ devices, quality, access }) => (
  <div className="hidden sm:flex flex-col justify-center bg-slate-50 border border-slate-900/[0.06] rounded-2xl p-3.5 mt-auto mb-4 flex-1 space-y-2 text-[11px] text-slate-600">
    <div className="flex items-center gap-2">
      <Monitor className="w-4 h-4 text-blue-600 shrink-0" />
      <span className="truncate font-semibold">{devices}</span>
    </div>
    <div className="flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
      <span className="truncate font-semibold">{quality}</span>
    </div>
    <div className="flex items-center gap-2">
      <KeyRound className="w-4 h-4 text-blue-600 shrink-0" />
      <span className="truncate font-semibold">{access}</span>
    </div>
  </div>
);
