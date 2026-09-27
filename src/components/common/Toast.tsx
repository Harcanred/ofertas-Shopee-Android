import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-slideDown">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900/90 text-white text-xs font-medium shadow-lg backdrop-blur-md border border-neutral-700/50">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="truncate max-w-[280px]">{toastMessage}</span>
      </div>
    </div>
  );
};
