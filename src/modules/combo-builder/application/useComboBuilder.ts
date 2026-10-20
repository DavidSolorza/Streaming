import { useState } from 'react';
import { ComboEngine } from '../domain/comboEngine';
import { toast } from '@/core/utils/toast';
import { useCustomerProfile } from '@/modules/customer/application/useCustomerProfile';

export function useComboBuilder() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleItem = (name: string) => {
    setSelectedItems(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const discountInfo = ComboEngine.calculateComboDiscount(selectedItems);

  const handleCheckoutCombo = () => {
    if (selectedItems.length === 0) {
      toast.warning('Selecciona al menos una plataforma para armar tu combo personalizado.', 'Arma tu Combo');
      return;
    }
    useCustomerProfile.getState().requireName(
      (customerName) => {
        let msg = '';
        if (customerName && customerName.trim()) {
          msg += `¡Hola equipo JP! Mi nombre es *${customerName.trim()}*, un gusto saludarlos.\n\n`;
        }
        msg += `*COTIZACIÓN COMBO PERSONALIZADO*\n`;
        msg += `──────────────────────────\n`;
        msg += `*Plataformas seleccionadas:*\n`;
        selectedItems.forEach((item) => {
          msg += `   • ${item}\n`;
        });
        msg += `──────────────────────────\n`;
        if (discountInfo.discountPct > 0) {
          msg += `*Descuento Combo:* ${discountInfo.discountPct}% OFF (${discountInfo.label})\n`;
          msg += `──────────────────────────\n`;
        }
        msg += `Deseo cotizar este combo personalizado. ¿Me confirman el valor final y los medios de pago? ¡Muchas gracias!`;

        window.open(`https://wa.me/573214465418?text=${encodeURIComponent(msg)}`, '_blank');
      },
      '¿Cómo te llamas?',
      'Dinos tu nombre para preparar tu cotización de combo personalizada.'
    );
  };

  return {
    selectedItems,
    toggleItem,
    discountInfo,
    handleCheckoutCombo,
  };
}
