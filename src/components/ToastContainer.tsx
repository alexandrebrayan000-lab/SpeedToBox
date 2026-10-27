'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function ToastContainer() {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        let Icon = Info;
        let toastClass = 'toast-info';
        let iconColor = 'text-cyan-400';

        if (toast.tipo === 'success') {
          Icon = CheckCircle2;
          toastClass = 'toast-success';
          iconColor = 'text-emerald-400';
        } else if (toast.tipo === 'error') {
          Icon = AlertTriangle;
          toastClass = 'toast-error';
          iconColor = 'text-rose-400';
        }

        return (
          <div key={toast.id} className={`cyber-toast ${toastClass}`}>
            <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
              {toast.titulo && (
                <div className="font-bold text-xs tracking-wider uppercase text-cyan-300 mb-0.5">
                  {toast.titulo}
                </div>
              )}
              <div className="text-xs font-medium text-slate-100 leading-snug">{toast.mensagem}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white text-xs ml-2 cursor-pointer transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
