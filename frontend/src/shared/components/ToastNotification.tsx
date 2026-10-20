import React, { useState, useEffect } from 'react';
import { eventBus } from '@/core/bus/eventBus';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { ToastItem, ToastData } from './ToastItem';
import { ConfirmModal, ConfirmData } from './ConfirmModal';

export const ToastNotification: React.FC = () => {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmData | null>(null);
  const setIsOpen = useCartStore((state) => state.setIsOpen);

  useEffect(() => {
    const unsubCart = eventBus.on('CART:ITEM_ADDED', (item) => {
      setToast({
        id: String(Date.now()),
        title: '¡Añadido al Carrito!',
        message: item.name,
        iconName: item.image,
        price: item.price,
        type: 'cart',
      });
    });

    const unsubNotif = eventBus.on('NOTIFICATION:SHOW', (data) => {
      const toastType = data.type || 'info';
      const defaultTitle = data.title || (toastType === 'success' ? '¡Éxito!' : toastType === 'warning' ? 'Atención' : toastType === 'error' ? '¡Error!' : 'Información');
      setToast({ id: String(Date.now()), title: defaultTitle, message: data.message, iconName: data.iconName, price: data.price, type: toastType });
    });

    const unsubConfirm = eventBus.on('CONFIRMATION:SHOW', (data) => {
      setConfirmDialog({ title: data.title, message: data.message, confirmText: data.confirmText || 'Confirmar', cancelText: data.cancelText || 'Cancelar', variant: data.variant || 'warning', onConfirm: data.onConfirm });
    });

    return () => { unsubCart(); unsubNotif(); unsubConfirm(); };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleOpenCart = () => {
    setIsOpen(true);
    setToast(null);
  };

  return (
    <>
      {toast && <ToastItem toast={toast} onClose={() => setToast(null)} onOpenCart={handleOpenCart} />}
      {confirmDialog && <ConfirmModal dialog={confirmDialog} onClose={() => setConfirmDialog(null)} />}
    </>
  );
};
