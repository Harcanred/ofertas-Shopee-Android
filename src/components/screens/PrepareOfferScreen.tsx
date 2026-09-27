import React, { useState } from 'react';
import { ArrowLeft, Copy, Bookmark, ListPlus, Share2, MessageCircle, Check, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { AndroidStatusBar } from '../android/AndroidStatusBar';
import { copyToClipboard, formatOfferForSharing } from '../../services/shareService';
import { verifyProductLiveDetails } from '../../services/shopeeService';

export const PrepareOfferScreen: React.FC = () => {
  const { selectedProduct, goBack, openShareSheet, addToQueue, toggleSaveProduct, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');

  // Editable state
  const [customTitle, setCustomTitle] = useState(selectedProduct?.title || '');
  const [customPrice, setCustomPrice] = useState(selectedProduct?.price || 0);
  const [customHighlights, setCustomHighlights] = useState(selectedProduct?.highlights || []);
  const [customAffiliateUrl, setCustomAffiliateUrl] = useState(selectedProduct?.affiliateUrl || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [textCopied, setTextCopied] = useState(false);

  if (!selectedProduct) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <button onClick={goBack} className="text-sm text-[#ee4d2d]">Voltar</button>
      </div>
    );
  }

  const currentProductData: Product = {
    ...selectedProduct,
    title: customTitle,
    price: customPrice,
    highlights: customHighlights,
    affiliateUrl: customAffiliateUrl,
  };

  const handleCopyLinkOnly = async () => {
    const success = await copyToClipboard(customAffiliateUrl);
    if (success) {
      setLinkCopied(true);
      showToast('Link de afiliado copiado!');
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleCopyFullOffer = async () => {
    const formatted = formatOfferForSharing(currentProductData);
    const success = await copyToClipboard(formatted.fullMessageText);
    if (success) {
      setTextCopied(true);
      showToast('Texto completo da oferta copiado!');
      setTimeout(() => setTextCopied(false), 2000);
    }
  };

  const handleAddToQueue = () => {
    addToQueue(currentProductData, customTitle, customHighlights, customPrice);
  };

  const handleShareClick = async () => {
    // PRD Section 11: Verificação antes do compartilhamento
    setIsVerifying(true);
    await verifyProductLiveDetails(currentProductData);
    setIsVerifying(false);

    const formatted = formatOfferForSharing(currentProductData);
    openShareSheet({
      title: customTitle,
      text: formatted.fullMessageText,
      url: customAffiliateUrl,
      imageUrl: selectedProduct.imageUrl,
    });
  };

  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors">
      <AndroidStatusBar />

      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#ee4d2d] text-white shadow-sm">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h2 className="text-base font-bold text-white">Preparar Oferta</h2>
        <div className="w-9" />
      </div>

      {/* Segmented Tabs: Prévia | Editar (Matching Screen 5) */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
            activeTab === 'preview'
              ? 'border-[#ee4d2d] text-[#ee4d2d]'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400'
          }`}
        >
          Prévia
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
            activeTab === 'edit'
              ? 'border-[#ee4d2d] text-[#ee4d2d]'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400'
          }`}
        >
          Editar
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
        {activeTab === 'preview' ? (
          <>
            {/* Prepared Card Preview (Matching Screen 5) */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm border border-neutral-200 dark:border-neutral-800">
              {/* Product Image */}
              <div className="relative aspect-video w-full bg-neutral-200 dark:bg-neutral-800">
                <img
                  src={selectedProduct.imageUrl}
                  alt={customTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-[#ee4d2d] text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-xs">
                  -{selectedProduct.discountPercent}%
                </div>
              </div>

              {/* Title & Bullets */}
              <div className="p-4 space-y-3">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white leading-snug">
                  {customTitle}
                </h3>

                {/* Bullets */}
                <div className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                  {customHighlights.map((hl, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500">✅</span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                {/* Prices */}
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-neutral-400 line-through mr-1.5">
                      R$ {selectedProduct.oldPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xl font-black text-[#ee4d2d] dark:text-[#ff5e3a]">
                      R$ {customPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                      Economize {selectedProduct.discountPercent}%
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                      Comissão {selectedProduct.commissionPercent}%
                    </span>
                  </div>
                </div>

                {/* Affiliate Link Box */}
                <div className="pt-2">
                  <span className="text-[11px] font-medium text-neutral-400 block mb-1">
                    Link de afiliado (Shopee)
                  </span>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs">
                    <span className="text-blue-600 dark:text-blue-400 truncate max-w-[240px]">
                      {customAffiliateUrl}
                    </span>
                    <button
                      onClick={handleCopyLinkOnly}
                      className="text-neutral-500 hover:text-neutral-800 dark:text-neutral-300 ml-2"
                      title="Copiar Link"
                    >
                      {linkCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Row: [Copiar] [Salvar] [Adicionar à Fila] (Matching Screen 5) */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleCopyFullOffer}
                className="py-2.5 px-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:bg-neutral-50 active:scale-95 transition-all"
              >
                {textCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-[#ee4d2d]" />}
                <span>{textCopied ? 'Copiado!' : 'Copiar'}</span>
              </button>

              <button
                onClick={() => toggleSaveProduct(selectedProduct.id)}
                className="py-2.5 px-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:bg-neutral-50 active:scale-95 transition-all"
              >
                <Bookmark className="w-4 h-4 text-amber-500" />
                <span>Salvar</span>
              </button>

              <button
                onClick={handleAddToQueue}
                className="py-2.5 px-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:bg-neutral-50 active:scale-95 transition-all"
              >
                <ListPlus className="w-4 h-4 text-blue-500" />
                <span>Adicionar à Fila</span>
              </button>
            </div>
          </>
        ) : (
          /* Edit Tab */
          <div className="space-y-4 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm text-xs">
            <div>
              <label className="font-semibold block mb-1 text-neutral-700 dark:text-neutral-300">
                Título Promocional da Oferta
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-neutral-700 dark:text-neutral-300">
                Preço Promocional (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={customPrice}
                onChange={e => setCustomPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-neutral-700 dark:text-neutral-300">
                Link de Afiliado
              </label>
              <input
                type="text"
                value={customAffiliateUrl}
                onChange={e => setCustomAffiliateUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-neutral-700 dark:text-neutral-300">
                Destaques da Oferta (1 por linha)
              </label>
              <textarea
                rows={4}
                value={customHighlights.join('\n')}
                onChange={e => setCustomHighlights(e.target.value.split('\n').filter(Boolean))}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <button
              onClick={() => {
                showToast('Alterações salvas com sucesso!');
                setActiveTab('preview');
              }}
              className="w-full py-2.5 rounded-xl bg-[#ee4d2d] text-white font-bold"
            >
              Aplicar Alterações
            </button>
          </div>
        )}
      </div>

      {/* Prominent Green Bottom Button: Compartilhar Oferta (Matching Screen 5) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 z-30">
        <button
          onClick={handleShareClick}
          disabled={isVerifying}
          className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <MessageCircle className="w-5 h-5 fill-current" />
          )}
          <span>{isVerifying ? 'Verificando preço ao vivo...' : 'Compartilhar Oferta'}</span>
        </button>
      </div>
    </div>
  );
};
