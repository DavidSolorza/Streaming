import { eventBus } from '@/core/bus/eventBus';

export interface ToastOptions {
  title?: string;
  message: string;
  type?: 'success' | 'info' | 'error' | 'warning' | 'cart';
  iconName?: string;
  price?: number;
}

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
}

export const toast = {
  show: (options: ToastOptions) => {
    eventBus.emit('NOTIFICATION:SHOW', {
      message: options.message,
      type: options.type || 'info',
      title: options.title,
      iconName: options.iconName,
      price: options.price
    });
  },

  success: (message: string, title?: string) => {
    eventBus.emit('NOTIFICATION:SHOW', {
      message,
      title: title || '¡Éxito!',
      type: 'success'
    });
  },

  warning: (message: string, title?: string) => {
    eventBus.emit('NOTIFICATION:SHOW', {
      message,
      title: title || 'Atención',
      type: 'warning'
    });
  },

  error: (message: string, title?: string) => {
    eventBus.emit('NOTIFICATION:SHOW', {
      message,
      title: title || 'Error',
      type: 'error'
    });
  },

  info: (message: string, title?: string) => {
    eventBus.emit('NOTIFICATION:SHOW', {
      message,
      title: title || 'Información',
      type: 'info'
    });
  },

  confirm: (options: ConfirmOptions) => {
    eventBus.emit('CONFIRMATION:SHOW', options);
  }
};
