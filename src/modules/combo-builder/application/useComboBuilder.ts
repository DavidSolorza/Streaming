import { useState } from 'react';
import { ComboEngine } from '../domain/comboEngine';

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
      alert('Selecciona al menos una plataforma para armar tu combo personalizado.');
      return;
    }
    const message = `Hola 👋 Quisiera cotizar un combo personalizado con las siguientes plataformas: *${selectedItems.join(', ')}*. ¿Qué precio especial me pueden ofrecer?`;
    window.open(`https://wa.me/573214465418?text=${encodeURIComponent(message)}`, '_blank');
  };

  return {
    selectedItems,
    toggleItem,
    discountInfo,
    handleCheckoutCombo,
  };
}
