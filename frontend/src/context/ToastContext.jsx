import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  HelpCircle
} from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = 'info', title, message, duration = 3500 }) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newToast = { id, type, title, message };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toast = {
    success: (message, title = 'Success') => addToast({ type: 'success', title, message }),
    error: (message, title = 'Error') => addToast({ type: 'error', title, message, duration: 4500 }),
    info: (message, title = 'Info') => addToast({ type: 'info', title, message }),
    warning: (message, title = 'Warning') => addToast({ type: 'warning', title, message }),
  };

  const showConfirm = useCallback(
    ({
      title = 'Are you sure?',
      message = 'This action cannot be undone.',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      isDestructive = true,
      onConfirm,
    }) => {
      setConfirmModal({
        title,
        message,
        confirmText,
        cancelText,
        isDestructive,
        onConfirm: () => {
          if (onConfirm) onConfirm();
          setConfirmModal(null);
        },
        onCancel: () => setConfirmModal(null),
      });
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast, showConfirm }}>
      {children}

      {/* Floating Toast Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';
          const isWarning = t.type === 'warning';

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
                isSuccess
                  ? 'bg-white/95 border-emerald-200 text-slate-800 shadow-emerald-500/10'
                  : isError
                  ? 'bg-white/95 border-rose-200 text-slate-800 shadow-rose-500/10'
                  : isWarning
                  ? 'bg-white/95 border-amber-200 text-slate-800 shadow-amber-500/10'
                  : 'bg-white/95 border-blue-200 text-slate-800 shadow-blue-500/10'
              }`}
            >
              {/* Icon Badge */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isSuccess
                    ? 'bg-emerald-100 text-emerald-600'
                    : isError
                    ? 'bg-rose-100 text-rose-600'
                    : isWarning
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                {isSuccess && <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />}
                {isError && <AlertCircle className="w-5 h-5 stroke-[2.5]" />}
                {isWarning && <AlertTriangle className="w-5 h-5 stroke-[2.5]" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 stroke-[2.5]" />}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0 pr-1">
                {t.title && (
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-0.5">
                    {t.title}
                  </h4>
                )}
                <p className="text-sm font-medium text-slate-600 leading-snug break-words">
                  {t.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Sleek Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[10000] flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-sm shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-150">
            <div
              className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
                confirmModal.isDestructive
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-blue-100 text-blue-600'
              }`}
            >
              {confirmModal.isDestructive ? (
                <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
              ) : (
                <HelpCircle className="w-6 h-6 stroke-[2.5]" />
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1.5">{confirmModal.title}</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {confirmModal.message}
            </p>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={confirmModal.onCancel}
                className="flex-1 py-2.5 px-4 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs font-bold transition active:scale-95"
              >
                {confirmModal.cancelText}
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`flex-1 py-2.5 px-4 rounded-xl text-white text-xs font-bold shadow-sm transition active:scale-95 ${
                  confirmModal.isDestructive
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                    : 'bg-[#1E40AF] hover:bg-blue-800 shadow-blue-600/20'
                }`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
