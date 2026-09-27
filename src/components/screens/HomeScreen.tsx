import React from 'react';
import { ShoppingBag, Bell, Search, Camera, ChevronRight, Star, Heart, ArrowDownToLine, ListFilter, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { AndroidStatusBar } from '../android/AndroidStatusBar';
import { AndroidNavBar } from '../android/AndroidNavBar';

export const HomeScreen: React.FC = () => {
  const { products, navigateTo, toggleSaveProduct, savedProducts } = useApp();

  const handleProductClick = (product: Product) => {
    navigateTo('details', product);
  };

  const handlePrepareClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    navigateTo('prepare', product);
  };

  const isProductSaved = (id: string) => savedProducts.some(p => p.id === id);

  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors">
      {/* Orange Header Block (Matching Screen 3) */}
      <div className="bg-gradient-to-b from-[#ff5338] to-[#ee4d2d] text-white pt-1 pb-4 px-4 shadow-md">
        <AndroidStatusBar lightMode={true} />

        {/* Brand Bar */}
        <div className="flex items-center justify-between mt-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-[#ee4d2d]" strokeWidth={2.4} />
                <span className="absolute top-2 text-[10px] font-black text-[#ee4d2d]">S</span>
              </div>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white leading-tight">
                Central de Ofertas
              </h1>
              <span className="text-[11px] font-medium text-white/80 block -mt-0.5">
                Criado por Ronaldo Costa
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => navigateTo('queue')}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <Bell className="w-4 h-4 text-white" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-300 rounded-full" />
            </button>
          </div>
        </div>

        {/* Search Bar Input */}
        <div
          onClick={() => navigateTo('search')}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white text-neutral-500 rounded-2xl shadow-sm cursor-pointer hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-neutral-400" />
            <span className="text-xs text-neutral-400">Buscar produtos, categorias...</span>
          </div>
          <Camera className="w-4 h-4 text-[#ee4d2d]" />
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Quick Action Circles (Matching Screen 3) */}
        <div className="grid grid-cols-5 gap-2 text-center py-1">
          {/* Shopee */}
          <button
            onClick={() => navigateTo('settings')}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-[#ee4d2d] flex items-center justify-center shadow-xs group-active:scale-95 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300">Shopee</span>
          </button>

          {/* Buscar */}
          <button
            onClick={() => navigateTo('search')}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs group-active:scale-95 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300">Buscar</span>
          </button>

          {/* Fila */}
          <button
            onClick={() => navigateTo('queue')}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shadow-xs group-active:scale-95 transition-transform">
              <ListFilter className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300">Fila</span>
          </button>

          {/* Salvos */}
          <button
            onClick={() => navigateTo('saved')}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs group-active:scale-95 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300">Salvos</span>
          </button>

          {/* Baixar Vídeo */}
          <button
            onClick={() => navigateTo('downloader')}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs group-active:scale-95 transition-transform">
              <ArrowDownToLine className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
              Baixar Vídeo
            </span>
          </button>
        </div>

        {/* Melhores Ofertas Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
              Melhores Ofertas
            </h2>
            <button
              onClick={() => navigateTo('search')}
              className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex items-center hover:text-[#ee4d2d] transition-colors"
            >
              <span>Ver todos</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Product Cards 2-Column Grid */}
          <div className="grid grid-cols-2 gap-3">
            {products.map(product => {
              const saved = isProductSaved(product.id);

              return (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-xs border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow group"
                >
                  {/* Image container with discount badge */}
                  <div className="relative aspect-square w-full bg-neutral-50 dark:bg-neutral-800 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Discount badge top right */}
                    <div className="absolute top-2 right-2 bg-[#ee4d2d] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                      -{product.discountPercent}%
                    </div>

                    {/* Bookmark heart top left */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveProduct(product.id);
                      }}
                      className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xs flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-red-500 transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${saved ? 'fill-red-500 text-red-500' : ''}`}
                      />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-neutral-900 dark:text-white line-clamp-2 leading-snug mb-1">
                        {product.title}
                      </h3>

                      {/* Pricing */}
                      <div className="mb-1">
                        <span className="text-[10px] text-neutral-400 line-through block">
                          R$ {product.oldPrice.toFixed(2).replace('.', ',')}
                        </span>
                        <div className="text-sm font-extrabold text-[#ee4d2d] dark:text-[#ff5e3a]">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </div>
                      </div>

                      {/* Ratings and Sales */}
                      <div className="flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400 mb-2">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{product.rating}</span>
                        <span>·</span>
                        <span>{(product.soldCount / 1000).toFixed(1)}k vend.</span>
                      </div>
                    </div>

                    {/* Preparar Action Button */}
                    <button
                      onClick={(e) => handlePrepareClick(e, product)}
                      className="w-full py-2 rounded-xl bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xs font-bold shadow-xs active:scale-98 transition-all"
                    >
                      Preparar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <AndroidNavBar />
    </div>
  );
};
