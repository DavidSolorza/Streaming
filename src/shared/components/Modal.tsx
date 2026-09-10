import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-300">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className={`relative bg-white border border-slate-900/[0.08] rounded-3xl w-full ${maxWidthClasses[maxWidth]} overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-modal-in z-10`}>
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-slate-900/[0.08] bg-slate-50">
            <div className="flex items-center gap-3">
              {title}
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-900 text-2xl font-bold w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
            >
              &times;
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
