import React from 'react';
import { useApp } from '../../context/AppContext';
import { Smartphone, Monitor, Shield, Sparkles, Sun, Moon } from 'lucide-react';
import { ScreenType } from '../../types';
import { PWAInstallButton } from '../common/PWAInstallButton';

export const AndroidDeviceFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    isPhoneFrame, 
    setIsPhoneFrame, 
    theme, 
    setTheme, 
    openAdminPanelSecurely, 
    isEffectiveDark,
    currentScreen, 
    navigateTo 
  } = useApp();

  const screenNames: Record<ScreenType, string> = {
    splash: '1. Tela de Abertura',
    activation: '2. Tela de Ativação',
    home: '3. Home - Melhores Ofertas',
    details: '4. Detalhes do Produto',
    prepare: '5. Preparar Oferta',
    search: '7. Buscar Produtos',
    queue: '8. Fila de Publicação',
    saved: '9. Produtos Salvos',
    downloader: '10. Downloader de Vídeo',
    media: '11. Minha Mídia',
    settings: '12. Configurações',
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center">
      {/* Top Desktop Controls Bar */}
      <header className="w-full bg-neutral-950 border-b border-neutral-800 px-4 py-2.5 flex items-center justify-between text-xs z-40 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ee4d2d]" />
            <span className="font-bold tracking-tight text-white hidden sm:inline">
              Central de Ofertas Android
            </span>
            <span className="text-[11px] text-neutral-400">· Criado por Ronaldo Costa</span>
          </div>
        </div>

        {/* Center: Quick Screen Switcher (Jump to any of the 12 screens directly) */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 hidden md:inline text-[11px]">Tela atual:</span>
          <select
            value={currentScreen}
            onChange={(e) => navigateTo(e.target.value as ScreenType)}
            className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#ee4d2d]"
          >
            {Object.entries(screenNames).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton variant="compact" />

          {/* Admin Panel button */}
          <button
            onClick={openAdminPanelSecurely}
            className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 font-semibold flex items-center gap-1.5 transition-colors"
            title="Painel Privado de Ronaldo Costa (Requer Senha)"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Painel Admin</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(isEffectiveDark ? 'light' : 'dark')}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            title={`Tema atual: ${theme}. Clique para alternar.`}
          >
            {isEffectiveDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-300" />}
          </button>

          {/* Device Frame Toggle */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hidden md:flex items-center transition-colors"
            title={isPhoneFrame ? 'Expandir Tela Cheia' : 'Modo Celular Android'}
          >
            {isPhoneFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 w-full flex items-center justify-center p-0 md:p-6 overflow-hidden">
        {isPhoneFrame ? (
          /* Android Smartphone Bezel & Shell */
          <div className="relative w-full max-w-[412px] h-[100dvh] md:h-[840px] max-h-[96vh] bg-black rounded-none md:rounded-[44px] shadow-2xl border-0 md:border-[10px] md:border-neutral-800 overflow-hidden flex flex-col ring-1 ring-neutral-700/50">
            {/* Speaker hole / earpiece slit */}
            <div className="hidden md:block absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-neutral-700 rounded-full z-50 pointer-events-none" />

            {/* Inner Phone Screen Content */}
            <div className={`flex-1 w-full h-full overflow-hidden flex flex-col relative bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white ${isEffectiveDark ? 'dark' : ''}`}>
              {children}
            </div>
          </div>
        ) : (
          /* Full Responsive Viewport */
          <div className={`w-full max-w-2xl h-[100dvh] md:h-[840px] bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-neutral-800 ${isEffectiveDark ? 'dark' : ''}`}>
            {children}
          </div>
        )}
      </main>
    </div>
  );
};
