import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  X, 
  CheckCircle, 
  Share2, 
  PlusSquare, 
  MoreVertical,
  Layers,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface Props {
  variant?: 'compact' | 'full' | 'banner';
  className?: string;
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'compact', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>(isIOS ? 'ios' : 'android');

  // If already running inside standalone app, do not show install prompt
  if (isInstalled && !installedSuccess) {
    return null;
  }

  const handleInstallClick = async () => {
    // If native prompt is ready, trigger it directly!
    if (isInstallable) {
      try {
        const success = await install();
        if (success) {
          setInstalledSuccess(true);
          setTimeout(() => setInstalledSuccess(false), 5000);
          return;
        }
      } catch (err) {
        console.warn('Native install prompt error:', err);
      }
    }

    // If native prompt is not available, show clear visual guide modal
    setActiveTab(isIOS ? 'ios' : 'android');
    setShowGuideModal(true);
  };

  if (installedSuccess) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold animate-fadeIn">
        <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
        <span>Aplicativo instalado com sucesso!</span>
      </div>
    );
  }

  return (
    <>
      {variant === 'banner' ? (
        <div className={`p-4 rounded-2xl bg-gradient-to-r from-[#ee4d2d] to-[#ff6b3d] text-white shadow-lg shadow-orange-500/20 flex items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-xs font-bold leading-tight">Instalar no seu Celular</h4>
              <p className="text-[11px] text-white/80 mt-0.5">Use na tela inicial como app nativo</p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="px-3.5 py-2 rounded-xl bg-white text-[#ee4d2d] font-bold text-xs shadow hover:bg-orange-50 active:scale-95 transition-all shrink-0 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleInstallClick}
          className={`px-3 py-1.5 rounded-xl bg-[#ee4d2d] hover:bg-[#d43f20] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all active:scale-95 cursor-pointer ${className}`}
          title="Instalar Central de Ofertas no seu aparelho"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Instalar App</span>
        </button>
      )}

      {/* Complete Step-by-Step Installation Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-neutral-900 p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-[#ee4d2d] flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">
                    Instalar no seu Aparelho
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Sem precisar da Google Play Store
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowGuideModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform Selector Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('android')}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'android'
                    ? 'bg-white dark:bg-neutral-700 text-[#ee4d2d] shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Android (Chrome)</span>
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'ios'
                    ? 'bg-white dark:bg-neutral-700 text-[#ee4d2d] shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>iPhone (Safari)</span>
              </button>
            </div>

            {/* Step-by-step content */}
            {activeTab === 'android' ? (
              <div className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-800">
                  <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-950/80 text-[#ee4d2d] flex items-center justify-center shrink-0 font-bold text-xs">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      Toque nos 3 pontinhos do Chrome
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 flex items-center gap-1">
                      Fica no canto superior direito do seu navegador:
                      <MoreVertical className="w-3.5 h-3.5 inline text-[#ee4d2d]" />
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-800">
                  <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-950/80 text-[#ee4d2d] flex items-center justify-center shrink-0 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      Selecione "Instalar aplicativo"
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      (Ou <strong>"Adicionar à tela inicial"</strong> dependendo da versão do seu Android)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-800">
                  <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-950/80 text-[#ee4d2d] flex items-center justify-center shrink-0 font-bold text-xs">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      Confirme em "Instalar"
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      O ícone oficial da <strong>Central de Ofertas</strong> será adicionado à sua tela de início!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-800">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      Abra pelo Safari no iPhone
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 flex items-center gap-1">
                      Toque no botão <strong>Compartilhar</strong>
                      <Share2 className="w-3.5 h-3.5 inline text-blue-500" />
                      na barra inferior.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-800">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      Adicionar à Tela de Início
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 flex items-center gap-1">
                      Role o menu e selecione
                      <PlusSquare className="w-3.5 h-3.5 inline text-neutral-700 dark:text-neutral-300" />
                      <strong>"Adicionar à Tela de Início"</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-800">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      Toque em "Adicionar"
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      No canto superior direito para finalizar.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Direct prompt trigger attempt if available */}
            {isInstallable && (
              <button
                onClick={async () => {
                  const ok = await install();
                  if (ok) {
                    setShowGuideModal(false);
                    setInstalledSuccess(true);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Abrir Janela de Instalação Automática</span>
              </button>
            )}

            {/* Bottom Dismiss */}
            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#ee4d2d] text-white font-bold text-xs shadow hover:bg-[#d43f20] active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Entendi, vou fazer isso</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
