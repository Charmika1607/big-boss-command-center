import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommandCenter } from '../context/CommandCenterContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCommandCenter();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isError = toast.type === 'error';
          const isSuccess = toast.type === 'success';
          const isWarning = toast.type === 'warning';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto rounded-xl p-4 shadow-2xl border backdrop-blur-xl flex items-start gap-3.5 transition-colors ${
                isError
                  ? 'bg-red-950/90 text-red-100 border-red-500/50 shadow-red-900/30'
                  : isWarning
                  ? 'bg-amber-950/90 text-amber-100 border-amber-500/50 shadow-amber-900/30'
                  : isSuccess
                  ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500/50 shadow-emerald-900/30'
                  : 'bg-zinc-900/90 text-zinc-100 border-zinc-700/60 shadow-black/40'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isError && <AlertCircle className="w-5 h-5 text-red-400" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {!isError && !isWarning && !isSuccess && <Info className="w-5 h-5 text-cyan-400" />}
              </div>

              <div className="flex-1 min-w-0">
                {toast.title && (
                  <h4 className="text-xs font-bold uppercase tracking-wider font-orbitron opacity-90 mb-0.5">
                    {toast.title}
                  </h4>
                )}
                <p className="text-sm font-medium leading-snug break-words">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
