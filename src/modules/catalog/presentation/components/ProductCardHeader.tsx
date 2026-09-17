import React from 'react';
import { PlatformIcon } from '@/shared/components/PlatformIcon';
import { Badge } from '@/shared/components/Badge';
import { Flame } from 'lucide-react';
import { Product } from '../../domain/entities/Product';

interface ProductCardHeaderProps {
  product: Product;
}

export const ProductCardHeader: React.FC<ProductCardHeaderProps> = ({ product }) => (
  <div className="flex justify-between items-start mb-3 min-h-[48px]">
    <div className={`w-12 h-12 rounded-2xl border border-slate-900/[0.08] flex items-center justify-center p-2 shadow-sm ${product.logoBg}`}>
      <PlatformIcon icon={product.iconName} name={product.brand || product.name} className="w-7 h-7" />
    </div>
    <div className="flex flex-wrap items-center justify-end gap-1 max-w-[70%]">
      {product.bestseller && (
        <Badge variant="amber">
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
            Más Vendido
          </span>
        </Badge>
      )}
      <Badge variant={product.available ? 'emerald' : 'rose'}>
        {product.available ? 'Entrega Inmediata' : 'Agotado'}
      </Badge>
    </div>
  </div>
);
