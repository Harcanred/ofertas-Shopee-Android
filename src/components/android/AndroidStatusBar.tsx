import React, { useState, useEffect } from 'react';
import { Wifi, Signal } from 'lucide-react';

interface AndroidStatusBarProps {
  lightMode?: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({ lightMode = false }) => {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const textColor = lightMode ? 'text-white' : 'text-neutral-900 dark:text-white';

  return (
    <div className={`w-full px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold select-none z-50 ${textColor}`}>
      {/* Clock */}
      <span className="tracking-tight text-[13px]">{time}</span>

      {/* Front camera notch / hole punch */}
      <div className="w-3.5 h-3.5 rounded-full bg-neutral-950 border border-neutral-800 shadow-inner flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-950/60" />
      </div>

      {/* Network and Battery icons */}
      <div className="flex items-center gap-1.5">
        <Signal className="w-3.5 h-3.5" strokeWidth={2.5} />
        <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
        <div className="flex items-center">
          <div className="w-5 h-2.5 rounded-sm border border-current p-0.5 flex items-center">
            <div className="w-3 h-1.5 bg-current rounded-xs" />
          </div>
          <div className="w-0.5 h-1 bg-current rounded-r-xs" />
        </div>
      </div>
    </div>
  );
};
