"use client";

import * as React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ToastProps = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

type ToastContextType = {
  toast: (props: ToastProps) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: string })[]>([]);

  const toast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { ...props, id }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`pointer-events-auto w-80 rounded-xl shadow-lg p-4 ${
                t.variant === "destructive"
                  ? "bg-red-500 text-white"
                  : "bg-white border border-slate-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h4 className={`font-semibold text-sm ${
                    t.variant === "destructive" ? "text-white" : "text-foreground"
                  }`}>
                    {t.title}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    t.variant === "destructive" ? "text-white/90" : "text-slate-600"
                  }`}>
                    {t.description}
                  </p>
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className={`p-1 rounded-lg transition-colors ${
                    t.variant === "destructive"
                      ? "hover:bg-white/20"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
