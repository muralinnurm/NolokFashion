import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useMarketplace();

  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Notification Messages"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#252321] text-[#FAF8F5] p-4 rounded-2xl flex items-center gap-3.5 animate-in slide-in-from-bottom-2 fade-in duration-200"
          >
            {toast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            {toast.type === 'info' && (
              <Info className="w-5 h-5 text-amber-300 shrink-0" />
            )}
            <p className="text-sm leading-relaxed flex-1 text-[#FAF8F5] font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#FAF8F5]/60 hover:text-white hover:bg-white/10 shrink-0 cursor-pointer transition-colors"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </aside>
  );
};
