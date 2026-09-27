import React, { useState } from 'react';
import { ArrowLeft, Star, MoreVertical, Trash2, Share2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AndroidStatusBar } from '../android/AndroidStatusBar';
import { AndroidNavBar } from '../android/AndroidNavBar';

export const SavedScreen: React.FC = () => {
  const { savedProducts, goBack, toggleSaveProduct, navigateTo } = useApp();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors">
      <AndroidStatusBar />

      {/* Header (Matching Screen 9) */}
      <div className="bg-[#ee4d2d] text-white px-4 py-3 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-base font-bold text-white">Salvos</h2>
        </div>
      </div>

      {/* Saved Products List (Matching Screen 9) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {savedProducts.length === 0 ? (
          <div className="text-center py-20 text-neutral-400 text-xs">
            Nenhum produto salvo ainda. Toque no ícone de coração nos produtos para salvá-los aqui!
          </div>
        ) : (
          savedProducts.map(product => (
            <div
              key={product.id}
              onClick={() => navigateTo('details', product)}
              className="relative bg-white dark:bg-neutral-900 rounded-2xl p-3 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow group"
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                  {product.title}
                </h4>

                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[11px] font-bold text-red-500">
                    -{product.discountPercent}%
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{product.rating}</span>
                  <span>|</span>
                  <span>{(product.soldCount / 1000).toFixed(1)} mil vendidos</span>
                </div>
              </div>

              {/* 3-dot action menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === product.id ? null : product.id);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {activeMenuId === product.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-8 w-36 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 py-1 z-30 text-xs animate-fadeIn"
                  >
                    <button
                      onClick={() => {
                        setActiveMenuId(null);
                        navigateTo('prepare', product);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 font-medium"
                    >
                      Preparar Oferta
                    </button>
                    <button
                      onClick={() => {
                        setActiveMenuId(null);
                        toggleSaveProduct(product.id);
                      }}
                      className="w-full px-3 py-1.5 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium"
                    >
                      Remover
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <AndroidNavBar />
    </div>
  );
};
