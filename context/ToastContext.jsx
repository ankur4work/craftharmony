'use client';

import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 left-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto animate-toast-in rounded-2xl border border-cocoa/10 bg-white px-6 py-4 shadow-soft backdrop-blur-xl"
            role="alert"
          >
            <div className="flex items-center gap-3">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${toast.type === 'error' ? 'bg-red-50 text-red-600' : toast.type === 'info' ? 'bg-blue-50 text-blue-600' : 'bg-forest/10 text-forest'}`}>
                {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'i'}
              </span>
              <p className="text-sm font-medium text-cocoa">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="ml-4 text-stone-400 transition hover:text-cocoa"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}
