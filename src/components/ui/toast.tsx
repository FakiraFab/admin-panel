import React, { createContext, useCallback, useContext, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'confirm';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ToastContextProps {
  showToast: (
    message: string,
    type?: ToastType,
    options?: { onConfirm?: () => void; onCancel?: () => void }
  ) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback((message: string, type: ToastType = 'info', options?: { onConfirm?: () => void; onCancel?: () => void }) => {
    setToasts((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        message,
        type,
        onConfirm: options?.onConfirm,
        onCancel: options?.onCancel,
      },
    ]);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-4 rounded shadow-lg text-white flex items-center gap-4 animate-fade-in-up
              ${toast.type === 'success' ? 'bg-green-500' : ''}
              ${toast.type === 'error' ? 'bg-red-500' : ''}
              ${toast.type === 'info' ? 'bg-blue-500' : ''}
              ${toast.type === 'confirm' ? 'bg-yellow-500' : ''}
            `}
          >
            <span className="flex-1">{toast.message}</span>
            {toast.type === 'confirm' ? (
              <>
                <button
                  className="bg-white text-yellow-700 px-3 py-1 rounded mr-2 hover:bg-yellow-100"
                  onClick={() => {
                    toast.onConfirm?.();
                    removeToast(toast.id);
                  }}
                >
                  Yes
                </button>
                <button
                  className="bg-white text-gray-700 px-3 py-1 rounded hover:bg-gray-100"
                  onClick={() => {
                    toast.onCancel?.();
                    removeToast(toast.id);
                  }}
                >
                  No
                </button>
              </>
            ) : (
              <button
                className="ml-2 text-white hover:text-gray-200"
                onClick={() => removeToast(toast.id)}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Add this to your tailwind.config.js for animation:
//   animation: {
//     'fade-in-up': 'fadeInUp 0.3s ease',
//   },
//   keyframes: {
//     fadeInUp: {
//       '0%': { opacity: 0, transform: 'translateY(20px)' },
//       '100%': { opacity: 1, transform: 'translateY(0)' },
//     },
//   } 