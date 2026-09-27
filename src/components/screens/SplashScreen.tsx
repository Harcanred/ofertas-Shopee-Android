import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { AndroidStatusBar } from '../android/AndroidStatusBar';

export const SplashScreen: React.FC = () => {
  const { navigateTo, activeLicense } = useApp();

  const handleStart = () => {
    if (activeLicense) {
      navigateTo('home');
    } else {
      navigateTo('activation');
    }
  };

  return (
    <div className="relative flex flex-col justify-between h-full min-h-[640px] bg-gradient-to-b from-[#ff5338] via-[#ee4d2d] to-[#d73211] text-white p-6 select-none overflow-hidden">
      {/* Android Status Bar */}
      <AndroidStatusBar lightMode={true} />

      {/* Decorative background glow circles */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-black/10 rounded-full blur-3xl pointer-events-none" />

      {/* Center Branding (Matching Screen 1) */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-auto z-10">
        {/* Shopping bag with Shopee S logo */}
        <div className="w-28 h-28 rounded-3xl bg-white shadow-2xl shadow-red-950/30 flex items-center justify-center mb-6 transform hover:scale-105 transition-transform">
          <div className="relative flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-[#ee4d2d]" strokeWidth={2.2} />
            <span className="absolute top-7 text-2xl font-black text-[#ee4d2d]">S</span>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 drop-shadow-xs">
          Central de Ofertas
        </h1>
        <p className="text-sm font-medium text-white/90 max-w-[260px] leading-relaxed">
          Encontre, prepare e compartilhe as melhores ofertas.
        </p>

        {/* Small horizontal pill indicator bar */}
        <div className="w-14 h-1 bg-white/60 rounded-full mt-8" />
      </div>

      {/* Bottom CTA & Attribution */}
      <div className="z-10 flex flex-col items-center gap-4 pb-4">
        <button
          onClick={handleStart}
          className="w-full max-w-xs py-3.5 px-6 rounded-2xl bg-white text-[#ee4d2d] font-bold text-sm shadow-xl shadow-red-900/30 flex items-center justify-center gap-2 hover:bg-neutral-50 active:scale-98 transition-all"
        >
          <span>Acessar Central</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center">
          <span className="text-xs font-semibold tracking-wide text-white/80">
            Criado por Ronaldo Costa
          </span>
        </div>
      </div>
    </div>
  );
};
