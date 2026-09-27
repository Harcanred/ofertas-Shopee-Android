import React from 'react';
import { Home, Search, ListFilter, Bookmark, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenType } from '../../types';

export const AndroidNavBar: React.FC = () => {
  const { currentScreen, navigateTo, queueItems } = useApp();

  const pendingQueueCount = queueItems.filter(q => q.status === 'pending').length;

  const tabs: { id: ScreenType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'search', label: 'Buscar', icon: Search },
    { id: 'queue', label: 'Fila', icon: ListFilter },
    { id: 'saved', label: 'Salvos', icon: Bookmark },
    { id: 'settings', label: 'Config.', icon: Settings },
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="grid grid-cols-5 items-center h-14 max-w-lg mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => navigateTo(tab.id)}
              className={`flex flex-col items-center justify-center h-full relative transition-colors ${
                isActive
                  ? 'text-[#ee4d2d] dark:text-[#ff5e3a]'
                  : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.id === 'queue' && pendingQueueCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#ee4d2d] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {pendingQueueCount}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 font-medium tracking-tight ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Android navigation home gesture pill */}
      <div className="w-full flex justify-center pb-1 pt-0.5">
        <div className="w-32 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
      </div>
    </div>
  );
};
