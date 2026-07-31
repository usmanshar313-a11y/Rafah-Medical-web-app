import React from 'react';
import { AlertTriangle, X, CheckCircle2, Info } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onClose,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const btnBg =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white'
      : variant === 'warning'
      ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white'
      : 'bg-[#0B6B4E] hover:bg-[#08523c] active:bg-[#063d2d] text-white';

  const iconBg =
    variant === 'danger'
      ? 'bg-red-100 text-red-600 border border-red-200'
      : variant === 'warning'
      ? 'bg-amber-100 text-amber-600 border border-amber-200'
      : 'bg-emerald-100 text-[#0B6B4E] border border-emerald-200';

  const IconComponent = variant === 'info' ? Info : AlertTriangle;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-emerald-900/10 p-6 space-y-5 relative transform transition-all">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 text-emerald-800/60 hover:text-emerald-950 p-1.5 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl shrink-0 ${iconBg}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 pr-4">
            <h3 className="font-heading font-bold text-base text-gray-900 leading-snug">{title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">{message}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-all flex items-center gap-2 ${btnBg} disabled:opacity-50`}
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmLabel}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
