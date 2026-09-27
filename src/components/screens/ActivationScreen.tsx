import React, { useState } from 'react';
import { KeyRound, AlertCircle, CheckCircle, Loader2, HelpCircle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { activateLicenseKey } from '../../services/licenseService';
import { AndroidStatusBar } from '../android/AndroidStatusBar';

export const ActivationScreen: React.FC = () => {
  const { setActiveLicenseState, showToast, setAdminPanelOpen } = useApp();
  const [keyInput, setKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Auto-format key with hyphens as user types: OFERTA-XXXX-XXXX-XXXX
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Check if starts with OFERTA
    if (!val.startsWith('OFERTA') && val.length > 0 && !'OFERTA'.startsWith(val)) {
      val = 'OFERTA' + val;
    }

    // Format with hyphens: OFERTA-XXXX-XXXX-XXXX
    let formatted = '';
    if (val.length <= 6) {
      formatted = val;
    } else if (val.length <= 10) {
      formatted = `${val.slice(0, 6)}-${val.slice(6)}`;
    } else if (val.length <= 14) {
      formatted = `${val.slice(0, 6)}-${val.slice(6, 10)}-${val.slice(10)}`;
    } else {
      formatted = `${val.slice(0, 6)}-${val.slice(6, 10)}-${val.slice(10, 14)}-${val.slice(14, 18)}`;
    }

    setKeyInput(formatted);
    setErrorStatus(null);
  };

  const handleActivate = async () => {
    if (!keyInput.trim()) {
      setErrorStatus('Por favor, digite a chave de ativação.');
      return;
    }

    setLoading(true);
    setErrorStatus(null);

    const result = await activateLicenseKey(keyInput);
    setLoading(false);

    if (result.success && result.license) {
      showToast(result.message);
      setActiveLicenseState(result.license);
    } else {
      setErrorStatus(result.message);
    }
  };

  const handleQuickFill = (sampleKey: string) => {
    setKeyInput(sampleKey);
    setErrorStatus(null);
  };

  return (
    <div className="relative flex flex-col justify-between h-full min-h-[640px] bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white p-6 transition-colors">
      <AndroidStatusBar />

      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full my-auto">
        {/* Key icon badge (Matching Screen 2) */}
        <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#ee4d2d] flex items-center justify-center mb-6 shadow-md shadow-orange-500/10">
          <KeyRound className="w-10 h-10 rotate-45" strokeWidth={2.2} />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
          Ativar aplicativo
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mb-8 max-w-[240px]">
          Digite sua chave de ativação para continuar.
        </p>

        {/* Key Input */}
        <div className="w-full space-y-4">
          <div className="relative">
            <input
              type="text"
              value={keyInput}
              onChange={handleKeyChange}
              placeholder="OFERTA-XXXX-XXXX-XXXX"
              maxLength={23}
              className="w-full px-4 py-3.5 text-center text-sm font-mono tracking-wider font-semibold bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ee4d2d] shadow-sm uppercase"
            />
          </div>

          {/* Error Message */}
          {errorStatus && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-medium border border-red-200 dark:border-red-900/50 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorStatus}</span>
            </div>
          )}

          {/* Activate Button */}
          <button
            onClick={handleActivate}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold text-sm shadow-lg shadow-orange-600/20 active:scale-98 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verificando chave...</span>
              </>
            ) : (
              <span>ATIVAR</span>
            )}
          </button>

          {/* Quick Demo keys for immediate testing */}
          <div className="pt-2 flex flex-col items-center gap-2">
            <button
              onClick={() => setShowHelp(true)}
              className="text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
            >
              Como obter uma chave?
            </button>

            <div className="flex items-center gap-2 pt-2">
              <span className="text-[11px] text-neutral-400">Chaves de teste:</span>
              <button
                onClick={() => handleQuickFill('OFERTA-VIP1-2026-RONA')}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 hover:bg-orange-100 hover:text-[#ee4d2d] transition-colors"
              >
                VIP (Ronaldo)
              </button>
              <button
                onClick={() => handleQuickFill('OFERTA-PEDR-3321-TEST')}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 hover:bg-orange-100 hover:text-[#ee4d2d] transition-colors"
              >
                Nova (Pedro)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Attribution Footer */}
      <div className="text-center py-2">
        <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">
          Criado por Ronaldo Costa
        </span>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-xs w-full p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#ee4d2d]" />
              Como obter sua chave
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
              A licença do aplicativo <strong>Central de Ofertas</strong> é fornecida exclusivamente por Ronaldo Costa. Cada chave autoriza o uso em <strong>1 celular</strong>.
            </p>
            <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[11px] text-orange-800 dark:text-orange-300 mb-4">
              💡 Você pode acessar o <strong>Painel Administrativo</strong> para criar e gerenciar chaves.
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowHelp(false);
                  setAdminPanelOpen(true);
                }}
                className="flex-1 py-2 rounded-xl bg-[#ee4d2d] text-white text-xs font-semibold"
              >
                Painel Admin
              </button>
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
