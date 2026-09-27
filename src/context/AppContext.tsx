import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, License, MediaItem, QueueItem, ShopeeApiConfig, ScreenType, AppTheme } from '../types';
import { INITIAL_PRODUCTS, INITIAL_QUEUE_ITEMS } from '../data/seedData';
import { getActiveLicense, logoutLicense } from '../services/licenseService';
import { getStoredShopeeConfig, saveStoredShopeeConfig } from '../services/shopeeService';
import { getStoredMedia, deleteMediaItem as removeStoredMedia } from '../services/videoDownloaderService';

interface AppContextType {
  currentScreen: ScreenType;
  selectedProduct: Product | null;
  activeLicense: License | null;
  theme: AppTheme;
  products: Product[];
  savedProducts: Product[];
  queueItems: QueueItem[];
  mediaItems: MediaItem[];
  shopeeConfig: ShopeeApiConfig;
  toastMessage: string | null;
  
  // Navigation
  navigateTo: (screen: ScreenType, product?: Product | null) => void;
  goBack: () => void;
  
  // State Mutators
  setTheme: (theme: AppTheme) => void;
  setActiveLicenseState: (license: License | null) => void;
  updateShopeeConfig: (config: ShopeeApiConfig) => void;
  toggleSaveProduct: (productId: string) => void;
  addToQueue: (product: Product, customTitle?: string, customHighlights?: string[], customPrice?: number) => void;
  removeFromQueue: (queueId: string) => void;
  markQueuePublished: (queueId: string) => void;
  refreshMediaList: () => void;
  deleteMedia: (id: string) => void;
  showToast: (msg: string) => void;
  
  // Modals & Panels
  shareSheetOpen: boolean;
  openShareSheet: (payload: { title: string; text: string; url: string; imageUrl?: string }) => void;
  closeShareSheet: () => void;
  sharePayload: { title: string; text: string; url: string; imageUrl?: string } | null;
  
  videoModalOpen: boolean;
  videoModalData: { url: string; title: string } | null;
  openVideoModal: (url: string, title: string) => void;
  closeVideoModal: () => void;
  
  adminPanelOpen: boolean;
  setAdminPanelOpen: (open: boolean) => void;
  adminAuthModalOpen: boolean;
  setAdminAuthModalOpen: (open: boolean) => void;
  openAdminPanelSecurely: () => void;
  
  // Theme state
  isEffectiveDark: boolean;

  // Device Frame View
  isPhoneFrame: boolean;
  setIsPhoneFrame: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'central_ofertas_theme';
const SAVED_STORAGE_KEY = 'central_ofertas_saved_v1';
const QUEUE_STORAGE_KEY = 'central_ofertas_queue_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation stack
  const [screenStack, setScreenStack] = useState<ScreenType[]>(['splash']);
  const currentScreen = screenStack[screenStack.length - 1] || 'splash';
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(INITIAL_PRODUCTS[0]);

  // Auth / License
  const [activeLicense, setActiveLicense] = useState<License | null>(() => getActiveLicense());

  // Theme
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return (saved as AppTheme) || 'light';
  });

  // Data
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [savedProductIds, setSavedProductIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_STORAGE_KEY);
      return raw ? JSON.parse(raw) : ['prod-001', 'prod-002', 'prod-004', 'prod-005', 'prod-006', 'prod-007'];
    } catch {
      return ['prod-001', 'prod-002'];
    }
  });

  const [queueItems, setQueueItems] = useState<QueueItem[]>(() => {
    try {
      const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : INITIAL_QUEUE_ITEMS;
    } catch {
      return INITIAL_QUEUE_ITEMS;
    }
  });

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => getStoredMedia());
  const [shopeeConfig, setShopeeConfig] = useState<ShopeeApiConfig>(() => getStoredShopeeConfig());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [sharePayload, setSharePayload] = useState<{ title: string; text: string; url: string; imageUrl?: string } | null>(null);

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoModalData, setVideoModalData] = useState<{ url: string; title: string } | null>(null);

  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [adminAuthModalOpen, setAdminAuthModalOpen] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Compute effective dark mode
  const [isEffectiveDark, setIsEffectiveDark] = useState<boolean>(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
  });

  // Apply theme class to DOM
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    let shouldBeDark = false;
    if (theme === 'dark') {
      shouldBeDark = true;
    } else if (theme === 'light') {
      shouldBeDark = false;
    } else {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    setIsEffectiveDark(shouldBeDark);

    if (shouldBeDark) {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const openAdminPanelSecurely = () => {
    // If not authenticated, open authentication password prompt
    const session = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('central_ofertas_admin_session_v1') : null;
    if (session && session.startsWith('authenticated_')) {
      setAdminPanelOpen(true);
    } else {
      setAdminAuthModalOpen(true);
    }
  };

  // Sync saved items
  useEffect(() => {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedProductIds));
  }, [savedProductIds]);

  // Sync queue items
  useEffect(() => {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queueItems));
  }, [queueItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const navigateTo = (screen: ScreenType, product?: Product | null) => {
    if (product !== undefined) {
      setSelectedProduct(product);
    }
    setScreenStack(prev => {
      // If navigating to home, reset stack to home
      if (screen === 'home') return ['home'];
      // If already at top, replace
      if (prev[prev.length - 1] === screen) return prev;
      return [...prev, screen];
    });
  };

  const goBack = () => {
    setScreenStack(prev => {
      if (prev.length <= 1) return ['home'];
      return prev.slice(0, prev.length - 1);
    });
  };

  const setTheme = (t: AppTheme) => {
    setThemeState(t);
  };

  const setActiveLicenseState = (license: License | null) => {
    setActiveLicense(license);
    if (!license) {
      logoutLicense();
      navigateTo('activation');
    } else {
      navigateTo('home');
    }
  };

  const updateShopeeConfig = (cfg: ShopeeApiConfig) => {
    setShopeeConfig(cfg);
    saveStoredShopeeConfig(cfg);
  };

  const toggleSaveProduct = (productId: string) => {
    setSavedProductIds(prev => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      showToast(exists ? 'Produto removido dos salvos' : 'Produto salvo com sucesso!');
      return updated;
    });
  };

  const addToQueue = (product: Product, customTitle?: string, customHighlights?: string[], customPrice?: number) => {
    const newItem: QueueItem = {
      id: `queue-${Date.now()}`,
      productId: product.id,
      product,
      customTitle: customTitle || `🔥 ${product.title} com ${product.discountPercent}% OFF!`,
      customHighlights: customHighlights || product.highlights,
      customPrice: customPrice || product.price,
      affiliateLink: product.affiliateUrl,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setQueueItems(prev => [newItem, ...prev]);
    showToast('Oferta adicionada à fila com sucesso!');
  };

  const removeFromQueue = (queueId: string) => {
    setQueueItems(prev => prev.filter(q => q.id !== queueId));
    showToast('Oferta removida da fila');
  };

  const markQueuePublished = (queueId: string) => {
    setQueueItems(prev =>
      prev.map(q => (q.id === queueId ? { ...q, status: 'published', publishedAt: new Date().toISOString() } : q))
    );
    showToast('Marcado como publicado!');
  };

  const refreshMediaList = () => {
    setMediaItems(getStoredMedia());
  };

  const deleteMedia = (id: string) => {
    removeStoredMedia(id);
    refreshMediaList();
    showToast('Arquivo excluído com sucesso');
  };

  const openShareSheet = (payload: { title: string; text: string; url: string; imageUrl?: string }) => {
    setSharePayload(payload);
    setShareSheetOpen(true);
  };

  const closeShareSheet = () => {
    setShareSheetOpen(false);
  };

  const openVideoModal = (url: string, title: string) => {
    setVideoModalData({ url, title });
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setVideoModalOpen(false);
    setVideoModalData(null);
  };

  const savedProducts = products.filter(p => savedProductIds.includes(p.id));

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        selectedProduct,
        activeLicense,
        theme,
        products,
        savedProducts,
        queueItems,
        mediaItems,
        shopeeConfig,
        toastMessage,
        navigateTo,
        goBack,
        setTheme,
        setActiveLicenseState,
        updateShopeeConfig,
        toggleSaveProduct,
        addToQueue,
        removeFromQueue,
        markQueuePublished,
        refreshMediaList,
        deleteMedia,
        showToast,
        shareSheetOpen,
        openShareSheet,
        closeShareSheet,
        sharePayload,
        videoModalOpen,
        videoModalData,
        openVideoModal,
        closeVideoModal,
        adminPanelOpen,
        setAdminPanelOpen,
        adminAuthModalOpen,
        setAdminAuthModalOpen,
        openAdminPanelSecurely,
        isEffectiveDark,
        isPhoneFrame,
        setIsPhoneFrame,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
