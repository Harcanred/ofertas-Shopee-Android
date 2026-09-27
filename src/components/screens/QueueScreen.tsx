import React, { useState } from 'react';
import { ArrowLeft, Share2, Trash2, CheckCircle2, MoreVertical } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AndroidStatusBar } from '../android/AndroidStatusBar';
import { AndroidNavBar } from '../android/AndroidNavBar';
import { formatOfferForSharing } from '../../services/shareService';

export const QueueScreen: React.FC = () => {
  const { queueItems, goBack, removeFromQueue, markQueuePublished, openShareSheet, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState<'pending' | 'published'>('pending');

  const pendingItems = queueItems.filter(q => q.status === 'pending');
  const publishedItems = queueItems.filter(q => q.status === 'published');

  const currentItems = activeTab === 'pending' ? pendingItems : publishedItems;

  const handleShareQueueItem = (item: typeof queueItems[0]) => {
    const formatted = formatOfferForSharing(item.product);
    openShareSheet({
      title: item.customTitle,
      text: formatted.fullMessageText,
      url: item.affiliateLink,
      imageUrl: item.product.imageUrl,
    });
    // Mark as published
    markQueuePublished(item.id);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors">
      <AndroidStatusBar />

      {/* Header (Matching Screen 8) */}
      <div className="bg-[#ee4d2d] text-white px-4 py-3 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-base font-bold text-white">Fila de Publicação</h2>
        </div>
      </div>

      {/* Tabs: Pendentes (3) | Publicados (0) */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
            activeTab === 'pending'
              ? 'border-[#ee4d2d] text-[#ee4d2d]'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400'
          }`}
        >
          Pendentes ({pendingItems.length})
        </button>
        <button
          onClick={() => setActiveTab('published')}
          className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
            activeTab === 'published'
              ? 'border-[#ee4d2d] text-[#ee4d2d]'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400'
          }`}
        >
          Publicados ({publishedItems.length})
        </button>
      </div>

      {/* Queue Items List (Matching Screen 8) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {currentItems.length === 0 ? (
          <div className="text-center py-16 text-neutral-400 text-xs">
            {activeTab === 'pending' ? 'Nenhuma oferta na fila pendente.' : 'Nenhuma oferta publicada ainda.'}
          </div>
        ) : (
          currentItems.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-3 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex items-center gap-3"
            >
              {/* Thumbnail */}
              <div
                onClick={() => navigateTo('prepare', item.product)}
                className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0 cursor-pointer"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.customTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4
                  onClick={() => navigateTo('prepare', item.product)}
                  className="text-xs font-semibold text-neutral-900 dark:text-white truncate cursor-pointer hover:text-[#ee4d2d]"
                >
                  {item.customTitle}
                </h4>

                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">
                    R$ {item.customPrice.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[11px] font-bold text-red-500">
                    -{item.product.discountPercent}%
                  </span>
                </div>

                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  Adicionado em {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                {item.status === 'pending' ? (
                  <button
                    onClick={() => handleShareQueueItem(item)}
                    className="p-2 rounded-xl bg-[#25D366] text-white hover:bg-emerald-600 transition-colors"
                    title="Compartilhar agora"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}

                <button
                  onClick={() => removeFromQueue(item.id)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-red-500 transition-colors"
                  title="Remover da fila"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AndroidNavBar />
    </div>
  );
};
