import React from 'react';
import { Copy, MessageCircle, Send, Mail, MessageSquare, MoreHorizontal, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { copyToClipboard, getWhatsAppShareUrl, getTelegramShareUrl } from '../../services/shareService';

export const ShareSheetModal: React.FC = () => {
  const { shareSheetOpen, closeShareSheet, sharePayload, showToast } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!shareSheetOpen || !sharePayload) return null;

  const handleCopyLink = async () => {
    const success = await copyToClipboard(sharePayload.text);
    if (success) {
      setCopied(true);
      showToast('Texto e link da oferta copiados com sucesso!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    copyToClipboard(sharePayload.text);
    const url = getWhatsAppShareUrl(sharePayload.text);
    window.open(url, '_blank');
    showToast('Abrindo WhatsApp com oferta pronta!');
    closeShareSheet();
  };

  const handleTelegram = () => {
    copyToClipboard(sharePayload.text);
    const url = getTelegramShareUrl(sharePayload.text);
    window.open(url, '_blank');
    showToast('Abrindo Telegram!');
    closeShareSheet();
  };

  const handleGenericShare = (channel: string) => {
    copyToClipboard(sharePayload.text);
    showToast(`Texto da oferta copiado! Cole no ${channel}`);
    closeShareSheet();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={closeShareSheet} />

      {/* Modal drawer */}
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl p-5 pb-8 z-10 border-t border-neutral-200 dark:border-neutral-800 animate-slideUp">
        {/* Drag handle */}
        <div className="w-10 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mb-4" />

        <div className="text-center mb-6">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">Compartilhar com</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5 max-w-[280px] mx-auto">
            {sharePayload.title}
          </p>
        </div>

        {/* Primary share apps grid (matching Screen 6) */}
        <div className="grid grid-cols-4 gap-4 mb-6 text-center">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center gap-1.5 group focus:outline-none"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-active:scale-95 transition-transform">
              <MessageCircle className="w-7 h-7 fill-current" />
            </div>
            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">WhatsApp</span>
          </button>

          {/* Telegram */}
          <button
            onClick={handleTelegram}
            className="flex flex-col items-center gap-1.5 group focus:outline-none"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#0088cc] text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-active:scale-95 transition-transform">
              <Send className="w-7 h-7" />
            </div>
            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">Telegram</span>
          </button>

          {/* Instagram */}
          <button
            onClick={() => handleGenericShare('Instagram Stories / Direct')}
            className="flex flex-col items-center gap-1.5 group focus:outline-none"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-md shadow-pink-500/20 group-active:scale-95 transition-transform">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">Instagram</span>
          </button>

          {/* Copiar Link */}
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1.5 group focus:outline-none"
          >
            <div className={`w-14 h-14 rounded-2xl ${copied ? 'bg-emerald-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'} flex items-center justify-center shadow-sm group-active:scale-95 transition-all`}>
              {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
            </div>
            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
              {copied ? 'Copiado!' : 'Copiar link'}
            </span>
          </button>
        </div>

        {/* Secondary options row */}
        <div className="grid grid-cols-4 gap-4 text-center border-t border-neutral-100 dark:border-neutral-800 pt-4">
          <button
            onClick={() => handleGenericShare('Gmail')}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center group-active:scale-95 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-neutral-600 dark:text-neutral-400">Gmail</span>
          </button>

          <button
            onClick={() => handleGenericShare('Mensagens SMS')}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-active:scale-95 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-neutral-600 dark:text-neutral-400">Mensagens</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: sharePayload.title,
                  text: sharePayload.text,
                  url: sharePayload.url,
                }).catch(() => {});
              } else {
                handleCopyLink();
              }
            }}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center group-active:scale-95 transition-transform">
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-neutral-600 dark:text-neutral-400">Mais</span>
          </button>
        </div>
      </div>
    </div>
  );
};
