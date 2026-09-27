import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, Star, CheckCircle, Tag, TrendingUp, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AndroidStatusBar } from '../android/AndroidStatusBar';
import { formatOfferForSharing } from '../../services/shareService';

export const ProductDetailsScreen: React.FC = () => {
  const { selectedProduct, goBack, navigateTo, toggleSaveProduct, savedProducts, openShareSheet, openVideoModal } = useApp();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!selectedProduct) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <button onClick={goBack} className="text-sm text-[#ee4d2d]">Voltar</button>
      </div>
    );
  }

  const isSaved = savedProducts.some(p => p.id === selectedProduct.id);

  const handleShare = () => {
    const formatted = formatOfferForSharing(selectedProduct);
    openShareSheet({
      title: selectedProduct.title,
      text: formatted.fullMessageText,
      url: selectedProduct.affiliateUrl,
      imageUrl: selectedProduct.imageUrl,
    });
  };

  const images = selectedProduct.galleryImages.length > 0
    ? selectedProduct.galleryImages
    : [selectedProduct.imageUrl];

  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors">
      <AndroidStatusBar />

      {/* Top App Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="text-sm font-bold truncate max-w-[200px]">Detalhes do Produto</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSaveProduct(selectedProduct.id)}
            className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 active:scale-95 transition-transform"
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 active:scale-95 transition-transform"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Main Product Image Carousel */}
        <div className="relative aspect-square w-full bg-neutral-200 dark:bg-neutral-800">
          <img
            src={images[selectedImageIndex] || selectedProduct.imageUrl}
            alt={selectedProduct.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          {/* Discount badge top right */}
          <div className="absolute top-4 right-4 bg-[#ee4d2d] text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
            -{selectedProduct.discountPercent}%
          </div>

          {/* Video indicator button */}
          {selectedProduct.hasVideo && selectedProduct.videoUrl && (
            <button
              onClick={() => openVideoModal(selectedProduct.videoUrl!, selectedProduct.title)}
              className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg hover:bg-black/90 active:scale-95 transition-transform"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Ver Vídeo</span>
            </button>
          )}

          {/* Thumbnail dots/selector */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 flex gap-1.5 bg-black/40 backdrop-blur-xs p-1 rounded-xl">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-[#ee4d2d] scale-105' : 'border-white/60 opacity-70'
                  }`}
                >
                  <img src={img} alt="thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information Card */}
        <div className="p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="text-base font-bold text-neutral-900 dark:text-white leading-snug mb-2">
            {selectedProduct.title}
          </h1>

          {/* Social Proof */}
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 mb-3">
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{selectedProduct.rating}</span>
            </div>
            <span>·</span>
            <span>({(selectedProduct.reviewsCount / 1000).toFixed(1)} mil avaliações)</span>
            <span>·</span>
            <span className="font-medium text-neutral-900 dark:text-neutral-200">
              {(selectedProduct.soldCount / 1000).toFixed(1)} mil vendidos
            </span>
          </div>

          {/* Price & Savings Row (Matching Screen 4) */}
          <div className="flex items-baseline justify-between py-2 border-t border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <span className="text-xs text-neutral-400 line-through mr-2">
                R$ {selectedProduct.oldPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-2xl font-black text-[#ee4d2d] dark:text-[#ff5e3a]">
                R$ {selectedProduct.price.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-semibold">
                Economize {selectedProduct.discountPercent}%
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                Comissão {selectedProduct.commissionPercent}% (R$ {selectedProduct.commissionValue.toFixed(2).replace('.', ',')})
              </span>
            </div>
          </div>
        </div>

        {/* Highlights / Destaques */}
        <div className="p-4 bg-white dark:bg-neutral-900 mt-2 border-y border-neutral-200 dark:border-neutral-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
            Pontos Fortes da Oferta
          </h3>
          <div className="space-y-1.5">
            {selectedProduct.highlights.map((highlight, index) => (
              <div key={index} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Specifications Table (Matching Screen 4) */}
        <div className="p-4 bg-white dark:bg-neutral-900 mt-2 border-y border-neutral-200 dark:border-neutral-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
            Ficha Técnica
          </h3>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            {Object.entries(selectedProduct.specifications).map(([key, val]) => (
              <div key={key} className="py-2 flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 font-medium">{key}</span>
                <span className="text-neutral-900 dark:text-white font-semibold text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA: Preparar Oferta (Matching Screen 4) */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 z-30">
        <button
          onClick={() => navigateTo('prepare', selectedProduct)}
          className="w-full py-3.5 rounded-2xl bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold text-sm shadow-lg shadow-orange-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>Preparar Oferta</span>
        </button>
      </div>
    </div>
  );
};
