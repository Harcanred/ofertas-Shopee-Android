import React, { useRef } from 'react';
import { X, Play, Pause, Download, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getWhatsAppShareUrl } from '../../services/shareService';

export const VideoPlayerModal: React.FC = () => {
  const { videoModalOpen, closeVideoModal, videoModalData, showToast } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(true);

  if (!videoModalOpen || !videoModalData) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleShareVideo = () => {
    const text = `🎬 Confira o vídeo demonstrativo do produto: ${videoModalData.title}\n\n${videoModalData.url}`;
    window.open(getWhatsAppShareUrl(text), '_blank');
    showToast('Compartilhando vídeo no WhatsApp!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-sm bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
          <h4 className="text-sm font-semibold text-white truncate max-w-[220px]">
            {videoModalData.title}
          </h4>
          <button
            onClick={closeVideoModal}
            className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Element */}
        <div className="relative aspect-[9/16] max-h-[70vh] bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoModalData.url}
            autoPlay
            loop
            playsInline
            className="w-full h-full object-contain"
            onClick={togglePlay}
          />

          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute w-16 h-16 rounded-full bg-black/60 text-white flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Play className="w-8 h-8 ml-1 fill-white" />
            </button>
          )}
        </div>

        {/* Bottom bar controls */}
        <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between gap-3">
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-800 text-white text-xs font-medium hover:bg-neutral-700"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pausar' : 'Reproduzir'}</span>
          </button>

          <button
            onClick={handleShareVideo}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartilhar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
