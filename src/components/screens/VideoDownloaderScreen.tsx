import React, { useState } from 'react';
import { ArrowLeft, Clipboard, Loader2, Play, Download, AlertCircle, CheckCircle, ExternalLink, Film } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AndroidStatusBar } from '../android/AndroidStatusBar';
import { analyzeVideoUrl, saveDownloadedVideo } from '../../services/videoDownloaderService';
import { ExtractedVideoInfo } from '../../types';

export const VideoDownloaderScreen: React.FC = () => {
  const { goBack, navigateTo, openVideoModal, showToast, refreshMediaList } = useApp();
  const [urlInput, setUrlInput] = useState('https://shopee.com.br/produto/1234');
  const [loading, setLoading] = useState(false);
  const [analyzedVideo, setAnalyzedVideo] = useState<ExtractedVideoInfo | null>({
    platform: 'shopee',
    title: 'Vídeo Fone Bluetooth TWS',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    duration: '00:28',
    quality: '720p',
    originalUrl: 'https://shopee.com.br/produto/1234',
    fileSize: '12,4 MB',
  });
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrlInput(text.trim());
          setErrorMessage(null);
          showToast('Link colado da área de transferência!');
          return;
        }
      }
    } catch {
      // Fallback
    }
    setUrlInput('https://shopee.com.br/produto/1234');
    showToast('Link de exemplo colado!');
  };

  const handleAnalyze = async () => {
    setErrorMessage(null);
    setLoading(true);

    const result = await analyzeVideoUrl(urlInput);
    setLoading(false);

    if (result.success && result.videoInfo) {
      setAnalyzedVideo(result.videoInfo);
      showToast('Vídeo encontrado com sucesso!');
    } else {
      setAnalyzedVideo(null);
      setErrorMessage(result.error || 'Não foi possível encontrar vídeo neste anúncio.');
    }
  };

  const handleDownloadVideo = () => {
    if (!analyzedVideo) return;

    setDownloadProgress(10);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev === null) return 10;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadProgress(null);
            const savedItem = saveDownloadedVideo(analyzedVideo);
            refreshMediaList();
            showToast('Vídeo salvo em Minha Mídia com sucesso!');
            
            // Trigger actual browser download
            const a = document.createElement('a');
            a.href = analyzedVideo.videoUrl;
            a.download = savedItem.fileName;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors">
      <AndroidStatusBar />

      {/* Header (Matching Screen 10) */}
      <div className="bg-[#ee4d2d] text-white px-4 py-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-base font-bold text-white">Baixar Vídeo</h2>
          </div>

          <button
            onClick={() => navigateTo('media')}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            Minha Mídia
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Input Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
            Cole o link da Shopee ou Mercado Livre
          </label>

          <div className="relative flex items-center">
            <input
              type="text"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="https://shopee.com.br/... ou https://mercadolivre.com.br/..."
              className="w-full pl-3.5 pr-10 py-3 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]"
            />
            <button
              onClick={handlePasteFromClipboard}
              className="absolute right-2.5 p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg"
              title="Colar link"
            >
              <Clipboard className="w-4 h-4" />
            </button>
          </div>

          {/* Quick test links */}
          <div className="flex items-center gap-2 pt-1 text-[11px]">
            <span className="text-neutral-400">Exemplos:</span>
            <button
              onClick={() => {
                setUrlInput('https://shopee.com.br/produto/fone-bluetooth-tws-1234');
                setErrorMessage(null);
              }}
              className="px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:underline"
            >
              Shopee
            </button>
            <button
              onClick={() => {
                setUrlInput('https://produto.mercadolivre.com.br/MLB-883921-smartwatch-ultra');
                setErrorMessage(null);
              }}
              className="px-2 py-0.5 rounded bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 hover:underline"
            >
              Mercado Livre
            </button>
          </div>

          {/* Analisar Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold text-xs shadow-md shadow-orange-600/20 active:scale-98 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analisando vídeo...</span>
              </>
            ) : (
              <span>Analisar</span>
            )}
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-medium border border-red-200 dark:border-red-900/50">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Video Found Card (Matching Screen 10) */}
        {analyzedVideo && (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4 animate-slideUp">
            <div className="flex gap-3">
              {/* Video Thumbnail with Play icon */}
              <div
                onClick={() => openVideoModal(analyzedVideo.videoUrl, analyzedVideo.title)}
                className="relative w-28 aspect-video rounded-xl bg-neutral-900 overflow-hidden shrink-0 cursor-pointer group"
              >
                <img
                  src={analyzedVideo.thumbnailUrl}
                  alt="Thumb"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#ee4d2d]" />
                  <span className="text-xs font-bold text-neutral-900 dark:text-white capitalize">
                    {analyzedVideo.platform === 'shopee' ? 'Shopee' : 'Mercado Livre'}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Vídeo encontrado!</span>
                </div>

                <div className="text-[10px] text-neutral-400 mt-1 space-y-0.5">
                  <p>Duração: <span className="font-semibold text-neutral-600 dark:text-neutral-300">{analyzedVideo.duration}</span></p>
                  <p>Qualidade: <span className="font-semibold text-neutral-600 dark:text-neutral-300">{analyzedVideo.quality}</span></p>
                </div>
              </div>
            </div>

            {/* Download Progress Bar if active */}
            {downloadProgress !== null && (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                  <span>Baixando vídeo...</span>
                  <span>{downloadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ee4d2d] transition-all duration-200"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons (Matching Screen 10) */}
            <div className="space-y-2">
              <button
                onClick={handleDownloadVideo}
                disabled={downloadProgress !== null}
                className="w-full py-3.5 rounded-xl bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold text-xs shadow-md shadow-orange-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Vídeo</span>
              </button>

              <button
                onClick={() => openVideoModal(analyzedVideo.videoUrl, analyzedVideo.title)}
                className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 font-semibold text-xs transition-colors"
              >
                Pré-visualizar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
