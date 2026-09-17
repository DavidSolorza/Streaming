import React from 'react';
import { AlertCircle, AlertTriangle, HelpCircle } from 'lucide-react';

export interface ConfirmData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
}

interface ConfirmModalProps {
  dialog: ConfirmData;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ dialog, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900 relative space-y-4 animate-scaleUp">
        <div className="flex items-start space-x-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
            dialog.variant === 'danger' ? 'bg-rose-50 text-rose-600 border-rose-200' :
            dialog.variant === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-200' :
            'bg-blue-50 text-blue-600 border-blue-200'
          }`}>
            {dialog.variant === 'danger' ? <AlertCircle className="w-6 h-6" /> :
             dialog.variant === 'warning' ? <AlertTriangle className="w-6 h-6" /> :
             <HelpCircle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{dialog.title}</h3>
            <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">{dialog.message}</p>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition">
            {dialog.cancelText}
          </button>
          <button type="button" onClick={() => { const cb = dialog.onConfirm; onClose(); cb(); }}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold text-white transition shadow-md ${
              dialog.variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20' :
              dialog.variant === 'warning' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20' :
              'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
            }`}
          >
            {dialog.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
