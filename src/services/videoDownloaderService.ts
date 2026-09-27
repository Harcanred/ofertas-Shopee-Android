import { ExtractedVideoInfo, MediaItem } from '../types';
import { INITIAL_MEDIA_ITEMS } from '../data/seedData';

const MEDIA_STORAGE_KEY = 'central_ofertas_media_v1';

export interface VideoProvider {
  platform: 'shopee' | 'mercadolivre';
  canHandle(url: string): boolean;
  extractVideo(url: string): Promise<ExtractedVideoInfo>;
}

export class ShopeeVideoProvider implements VideoProvider {
  platform: 'shopee' = 'shopee';

  canHandle(url: string): boolean {
    const lower = url.toLowerCase();
    return lower.includes('shopee.com') || lower.includes('shope.ee') || lower.includes('s.shopee.com');
  }

  async extractVideo(url: string): Promise<ExtractedVideoInfo> {
    // Simulate real extraction delay
    await new Promise(r => setTimeout(r, 900));

    // Realistic video samples for Shopee products
    return {
      platform: 'shopee',
      title: 'Vídeo Promocional Produto Shopee',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      duration: '00:28',
      quality: '720p HD',
      originalUrl: url,
      fileSize: '12,4 MB',
    };
  }
}

export class MercadoLivreVideoProvider implements VideoProvider {
  platform: 'mercadolivre' = 'mercadolivre';

  canHandle(url: string): boolean {
    const lower = url.toLowerCase();
    return lower.includes('mercadolivre.com') || lower.includes('mercadolibre.com') || lower.includes('mlb.sh') || lower.includes('mercadolivre.com.br');
  }

  async extractVideo(url: string): Promise<ExtractedVideoInfo> {
    // Simulate real extraction delay
    await new Promise(r => setTimeout(r, 900));

    return {
      platform: 'mercadolivre',
      title: 'Vídeo Demonstrativo Mercado Livre',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      duration: '00:35',
      quality: '1080p Full HD',
      originalUrl: url,
      fileSize: '8,7 MB',
    };
  }
}

// Registry of providers
const providers: VideoProvider[] = [
  new ShopeeVideoProvider(),
  new MercadoLivreVideoProvider(),
];

export function detectVideoPlatform(url: string): 'shopee' | 'mercadolivre' | null {
  for (const p of providers) {
    if (p.canHandle(url)) return p.platform;
  }
  return null;
}

export async function analyzeVideoUrl(url: string): Promise<{
  success: boolean;
  videoInfo?: ExtractedVideoInfo;
  error?: string;
}> {
  const trimmed = url.trim();
  if (!trimmed) {
    return { success: false, error: 'Por favor, cole um link válido.' };
  }

  // Validate URL format
  try {
    new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
  } catch {
    return { success: false, error: 'Link inválido. Certifique-se de incluir a URL completa.' };
  }

  const provider = providers.find(p => p.canHandle(trimmed));
  if (!provider) {
    return {
      success: false,
      error: 'Plataforma não compatível. O downloader suporta exclusivamente links da Shopee e Mercado Livre.',
    };
  }

  try {
    const videoInfo = await provider.extractVideo(trimmed);
    return { success: true, videoInfo };
  } catch {
    return {
      success: false,
      error: 'Vídeo não disponível neste anúncio ou link expirado.',
    };
  }
}

// Media storage functions
export function getStoredMedia(): MediaItem[] {
  try {
    const raw = localStorage.getItem(MEDIA_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading media', e);
  }
  localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(INITIAL_MEDIA_ITEMS));
  return INITIAL_MEDIA_ITEMS;
}

export function saveStoredMedia(media: MediaItem[]) {
  localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(media));
}

export function saveDownloadedVideo(videoInfo: ExtractedVideoInfo): MediaItem {
  const current = getStoredMedia();
  const timestamp = Date.now();
  const dateStr = new Date().toISOString();
  
  const newItem: MediaItem = {
    id: `media-${timestamp}`,
    title: videoInfo.title,
    fileName: `video_${videoInfo.platform}_${String(current.length + 1).padStart(3, '0')}.mp4`,
    type: 'video',
    platform: videoInfo.platform,
    url: videoInfo.videoUrl,
    thumbnailUrl: videoInfo.thumbnailUrl,
    duration: videoInfo.duration,
    fileSize: videoInfo.fileSize,
    createdAt: dateStr,
  };

  current.unshift(newItem);
  saveStoredMedia(current);
  return newItem;
}

export function deleteMediaItem(id: string): void {
  const current = getStoredMedia();
  const filtered = current.filter(m => m.id !== id);
  saveStoredMedia(filtered);
}
