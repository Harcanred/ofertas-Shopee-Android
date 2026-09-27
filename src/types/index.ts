export type ScreenType = 
  | 'splash'
  | 'activation'
  | 'home'
  | 'details'
  | 'prepare'
  | 'search'
  | 'queue'
  | 'saved'
  | 'downloader'
  | 'media'
  | 'settings';

export type AppTheme = 'light' | 'dark' | 'system';

export interface Product {
  id: string;
  title: string;
  category: 'Eletrônicos' | 'Casa' | 'Beleza' | 'Moda' | 'Esportes' | 'Acessórios';
  oldPrice: number;
  price: number;
  discountPercent: number;
  commissionPercent: number;
  commissionValue: number;
  rating: number;
  reviewsCount: number;
  soldCount: number;
  imageUrl: string;
  galleryImages: string[];
  hasVideo: boolean;
  videoUrl?: string;
  videoDuration?: string;
  videoQuality?: string;
  brand: string;
  affiliateUrl: string;
  highlights: string[];
  opportunityScore: number;
  description: string;
  specifications: Record<string, string>;
  isSaved?: boolean;
}

export interface QueueItem {
  id: string;
  productId: string;
  product: Product;
  customTitle: string;
  customHighlights: string[];
  customPrice: number;
  affiliateLink: string;
  status: 'pending' | 'published';
  createdAt: string;
  publishedAt?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  fileName: string;
  type: 'video' | 'image';
  platform: 'shopee' | 'mercadolivre';
  url: string;
  thumbnailUrl: string;
  duration?: string;
  fileSize: string;
  createdAt: string;
}

export interface License {
  id: string;
  key: string;
  clientName: string;
  notes?: string;
  status: 'active' | 'available' | 'blocked' | 'expired';
  createdAt: string;
  activatedAt?: string;
  expiresAt: string;
  deviceLimit: number;
  activeDeviceId?: string;
  activeDeviceModel?: string;
}

export interface ShopeeApiConfig {
  partnerId: string;
  appKey: string;
  appSecret: string;
  connected: boolean;
  lastTested?: string;
  status: 'disconnected' | 'testing' | 'connected' | 'invalid_credential' | 'error';
}

export interface ExtractedVideoInfo {
  platform: 'shopee' | 'mercadolivre';
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  quality: string;
  originalUrl: string;
  fileSize: string;
}
