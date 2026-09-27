/**
 * Central de Ofertas Android
 * Criado por Ronaldo Costa
 * @license Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { testFirestoreConnection } from './services/firebase';
import { AndroidDeviceFrame } from './components/android/AndroidDeviceFrame';
import { SplashScreen } from './components/screens/SplashScreen';
import { ActivationScreen } from './components/screens/ActivationScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { ProductDetailsScreen } from './components/screens/ProductDetailsScreen';
import { PrepareOfferScreen } from './components/screens/PrepareOfferScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { QueueScreen } from './components/screens/QueueScreen';
import { SavedScreen } from './components/screens/SavedScreen';
import { VideoDownloaderScreen } from './components/screens/VideoDownloaderScreen';
import { MyMediaScreen } from './components/screens/MyMediaScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { ShareSheetModal } from './components/common/ShareSheetModal';
import { VideoPlayerModal } from './components/common/VideoPlayerModal';
import { Toast } from './components/common/Toast';
import { AdminPanelModal } from './components/admin/AdminPanelModal';
import { AdminAuthModal } from './components/admin/AdminAuthModal';

const ScreenRouter: React.FC = () => {
  const { currentScreen, activeLicense } = useApp();

  // If not activated and not in splash, enforce activation
  if (!activeLicense && currentScreen !== 'splash' && currentScreen !== 'activation') {
    return <ActivationScreen />;
  }

  switch (currentScreen) {
    case 'splash':
      return <SplashScreen />;
    case 'activation':
      return <ActivationScreen />;
    case 'home':
      return <HomeScreen />;
    case 'details':
      return <ProductDetailsScreen />;
    case 'prepare':
      return <PrepareOfferScreen />;
    case 'search':
      return <SearchScreen />;
    case 'queue':
      return <QueueScreen />;
    case 'saved':
      return <SavedScreen />;
    case 'downloader':
      return <VideoDownloaderScreen />;
    case 'media':
      return <MyMediaScreen />;
    case 'settings':
      return <SettingsScreen />;
    default:
      return <HomeScreen />;
  }
};

export default function App() {
  useEffect(() => {
    testFirestoreConnection().catch(err => {
      console.warn('Firestore initial boot check:', err);
    });
  }, []);

  return (
    <AppProvider>
      <AndroidDeviceFrame>
        <ScreenRouter />
        <ShareSheetModal />
        <VideoPlayerModal />
        <Toast />
        <AdminAuthModal />
        <AdminPanelModal />
      </AndroidDeviceFrame>
    </AppProvider>
  );
}
