import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id?: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  toast,
  onClose,
  durationMs = 5000,
}) => {
  useEffect(() => {
    if (!toast?.message) return;
    const timer = setTimeout(() => {
      onClose();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [toast?.message, durationMs, onClose]);

  if (!toast || !toast.message) return null;

  const type = toast.type || 'info';

  const bgStyle =
    type === 'error'
      ? 'bg-red-900/95 text-white border-red-700 shadow-xl'
      : type === 'success'
      ? 'bg-[#0B6B4E]/95 text-white border-emerald-600 shadow-xl'
      : 'bg-gray-900/95 text-white border-gray-700 shadow-xl';

  const Icon = type === 'error' ? AlertCircle : type === 'success' ? CheckCircle2 : Info;

  return (
    <div className="fixed top-5 right-5 z-[110] max-w-sm sm:max-w-md w-full px-4 sm:px-0 animate-fadeIn">
      <div
        className={`flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md transition-all ${bgStyle}`}
      >
        <Icon className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-xs font-semibold leading-relaxed pr-2 flex-1">{toast.message}</div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white shrink-0 cursor-pointer"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
