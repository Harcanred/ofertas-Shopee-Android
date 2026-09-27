import React, { useState } from 'react';
import { ArrowLeft, Play, MoreVertical, Trash2, Share2, Film, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AndroidStatusBar } from '../android/AndroidStatusBar';
import { getWhatsAppShareUrl } from '../../services/shareService';

export const MyMediaScreen: React.FC = () => {
  const { mediaItems, goBack, deleteMedia, openVideoModal, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'videos' | 'images'>('videos');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const videoItems = mediaItems.filter(m => m.type === 'video');
  const imageItems = mediaItems.filter(m => m.type === 'image');

  const handleShareMedia = (item: typeof mediaItems[0]) => {
    const text = `🎬 Confira o vídeo da oferta: ${item.fileName}\n${item.url}`;
    window.open(getWhatsAppShareUrl(text), '_blank');
    showToast('Compartilhando vídeo no WhatsApp!');
  };

  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors">
      <AndroidStatusBar />

      {/* Header (Matching Screen 11) */}
      <div className="bg-[#ee4d2d] text-white px-4 py-3 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-base font-bold text-white">Minha Mídia</h2>
        </div>
      </div>

      {/* Tabs: Vídeos (3) | Imagens (0) */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <button
          onClick={() => setActiveTab('videos')}
          className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
            activeTab === 'videos'
              ? 'border-[#ee4d2d] text-[#ee4d2d]'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400'
          }`}
        >
          Vídeos ({videoItems.length})
        </button>
        <button
          onClick={() => setActiveTab('images')}
          className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
            activeTab === 'images'
              ? 'border-[#ee4d2d] text-[#ee4d2d]'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400'
          }`}
        >
          Imagens ({imageItems.length})
        </button>
      </div>

      {/* List (Matching Screen 11) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'videos' ? (
          videoItems.length === 0 ? (
            <div className="text-center py-20 text-neutral-400 text-xs">
              Nenhum vídeo baixado ainda. Use o Baixar Vídeo para salvar vídeos da Shopee ou Mercado Livre!
            </div>
          ) : (
            videoItems.map(item => (
              <div
                key={item.id}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-3 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex items-center gap-3"
              >
                {/* Thumbnail with Play Icon */}
                <div
                  onClick={() => openVideoModal(item.url, item.title || item.fileName)}
                  className="relative w-20 h-14 rounded-xl bg-neutral-900 overflow-hidden shrink-0 cursor-pointer group"
                >
                  <img
                    src={item.thumbnailUrl}
                    alt={item.fileName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center">
                      <Play className="w-3 h-3 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => openVideoModal(item.url, item.title || item.fileName)}
                    className="text-xs font-semibold text-neutral-900 dark:text-white truncate cursor-pointer hover:text-[#ee4d2d]"
                  >
                    {item.fileName}
                  </h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    {new Date(item.createdAt).toLocaleDateString('pt-BR')} {item.duration ? `- ${item.duration}` : ''}
                  </p>
                  <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                    {item.fileSize}
                  </span>
                </div>

                {/* 3-dots menu */}
                <div className="relative">
                  <button
                    onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeMenuId === item.id && (
                    <div className="absolute right-0 top-8 w-36 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 py-1 z-30 text-xs animate-fadeIn">
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          openVideoModal(item.url, item.title || item.fileName);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 font-medium"
                      >
                        Reproduzir
                      </button>
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          handleShareMedia(item);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 font-medium text-emerald-600 dark:text-emerald-400"
                      >
                        Compartilhar
                      </button>
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          deleteMedia(item.id);
                        }}
                        className="w-full px-3 py-1.5 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium"
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )
        ) : (
          <div className="text-center py-20 text-neutral-400 text-xs">
            Nenhuma imagem salva na galeria local.
          </div>
        )}
      </div>
    </div>
  );
};
