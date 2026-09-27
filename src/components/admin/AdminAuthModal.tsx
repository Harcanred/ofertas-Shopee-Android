import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, Eye, EyeOff, X, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { verifyAdminPassword } from '../../services/adminAuthService';

export const AdminAuthModal: React.FC = () => {
  const { adminAuthModalOpen, setAdminAuthModalOpen, setAdminPanelOpen, showToast } = useApp();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!adminAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isValid = verifyAdminPassword(password);
    if (isValid) {
      setPassword('');
      setAdminAuthModalOpen(false);
      setAdminPanelOpen(true);
      showToast('Acesso administrativo autorizado!');
    } else {
      setError('Senha de administrador incorreta. Acesso negado.');
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
        {/* Close */}
        <button
          onClick={() => {
            setAdminAuthModalOpen(false);
            setPassword('');
            setError(null);
          }}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>

        <div className="text-center">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            Painel Privado de Licenças
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Acesso exclusivo para <strong>Ronaldo Costa</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block">
              Digite a Senha Mestre de Administrador
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                required
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Senha de acesso..."
                className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-neutral-400 pt-0.5">
              Senha padrão inicial: <code className="font-mono text-emerald-600 dark:text-emerald-400">ronaldo2026</code> (alterável no painel)
            </p>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>DESBLOQUEAR PAINEL</span>
          </button>
        </form>
      </div>
    </div>
  );
};
