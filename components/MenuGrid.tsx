
import React, { useEffect, useState, useMemo } from 'react';
import { MENU_ITEMS } from '../constants';
import { MenuItem } from '../types';

interface MenuGridProps {
  role: 'admin' | 'guest' | 'none';
  onOpenDashboardAI: () => void;
  onOpenActivityLogs: () => void;
  onOpenLookerStudio: () => void;
  onOpenExternalLink: (item: MenuItem) => void;
  onRequestLogin: () => void;
  searchQuery?: string;
  language?: 'id' | 'en';
}

const GUEST_ALLOWED_IDS = [
  'carbon', 
  'height', 
  'weather', 
  'download-1', 
  'download-2', 
  'report-seed', 
  'looker-live',
  'docs-rr', 
  'notif-bibit', 
  'about-app'
];

export const MenuGrid: React.FC<MenuGridProps> = ({ role, onOpenDashboardAI, onOpenActivityLogs, onOpenLookerStudio, onOpenExternalLink, onRequestLogin, searchQuery = '', language = 'id' }) => {
  const [visibleItemsCount, setVisibleItemsCount] = useState<number>(0);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const title = language === 'id' ? item.title : (item.titleEn || item.title);
      return title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, language]);

  useEffect(() => {
    setVisibleItemsCount(0);
    const interval = setInterval(() => {
      setVisibleItemsCount(prev => {
        if (prev >= filteredItems.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [filteredItems]);
  
  const hasAccess = (itemId: string) => {
    if (role === 'admin') return true;
    if (role === 'guest' && GUEST_ALLOWED_IDS.includes(itemId)) return true;
    return false;
  };

  const handleMenuClick = (e: React.MouseEvent, item: MenuItem) => {
    const canAccessItem = hasAccess(item.id);

    if (role === 'none') {
      e.preventDefault();
      onRequestLogin();
      return;
    }

    if (role === 'guest' && !canAccessItem) {
      e.preventDefault();
      alert(language === 'id' ? "Fitur ini memerlukan hak akses Administrator." : "This feature requires Administrator access.");
      return;
    }

    if (item.id === 'db-bibit-ai' && role === 'admin') {
      e.preventDefault();
      onOpenDashboardAI();
      return;
    }

    if (item.id === 'user-activity' && role === 'admin') {
      e.preventDefault();
      onOpenActivityLogs();
      return;
    }

    if (item.id === 'looker-live' && canAccessItem) {
      e.preventDefault();
      onOpenLookerStudio();
      return;
    }

    if (item.id === 'form-bibit' && role === 'admin') {
      e.preventDefault();
      onOpenExternalLink(item);
      return;
    }

    if (item.href.startsWith('http')) {
      e.preventDefault();
      onOpenExternalLink(item);
      return;
    }
  };

  if (filteredItems.length === 0) {
    return (
      <div className="col-span-3 py-12 text-center animate-fadeIn">
        <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-500">
          <i className="fas fa-search"></i>
        </div>
        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
          {language === 'id' ? 'Fitur tidak ditemukan' : 'Feature not found'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3 md:gap-5 xl:gap-6 p-0.5 md:p-1">
      {filteredItems.map((item, index) => {
        const canAccess = hasAccess(item.id);
        const locked = role === 'none' || !canAccess;
        const isVisible = index < visibleItemsCount;
        const displayTitle = language === 'id' ? item.title : (item.titleEn || item.title);

        return (
          <a 
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            data-skip-global-external="true"
            onClick={(e) => handleMenuClick(e, item)}
            className={`group relative flex min-h-[112px] sm:min-h-[128px] md:min-h-[208px] flex-col items-center justify-center px-2.5 py-3 sm:px-3.5 sm:py-4 md:px-6 md:py-7 bg-white dark:bg-slate-900 rounded-[20px] sm:rounded-[24px] md:rounded-[34px] border border-slate-200 dark:border-white/10 shadow-sm md:shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 active:scale-95 overflow-hidden ${locked ? 'opacity-50 grayscale-[0.4]' : 'opacity-100 cursor-pointer'} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: `${index * 15}ms` }}
          >
            {item.badge && !locked && (
              <span className="absolute top-2 right-2 md:top-4 md:right-4 px-1.5 sm:px-2 md:px-3 py-0.5 md:py-1 text-white text-[6px] md:text-[7px] font-black uppercase rounded-full shadow-md z-10 tracking-[0.12em] md:tracking-widest bg-emerald-600 ring-1 md:ring-2 ring-white dark:ring-slate-900 group-hover:scale-110 transition-all duration-300 max-w-[52px] sm:max-w-none truncate">
                {item.badge}
              </span>
            )}

            {locked && (
               <div className="absolute top-2 right-2 md:top-4 md:right-4 w-4.5 h-4.5 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-slate-900/10 dark:bg-slate-700/30 rounded-md md:rounded-lg flex items-center justify-center z-10">
                  <i className="fas fa-lock text-[7px] md:text-[8px] text-slate-600 dark:text-slate-400"></i>
               </div>
            )}
            
            <div className={`w-10 h-10 sm:w-11 sm:h-11 md:w-16 md:h-16 mb-2.5 sm:mb-3 md:mb-5 rounded-[14px] sm:rounded-[16px] md:rounded-[26px] flex items-center justify-center text-[18px] sm:text-[20px] md:text-[30px] transition-all duration-300 relative ${locked ? 'bg-slate-100 dark:bg-slate-950 text-slate-400' : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:bg-emerald-500/10 shadow-inner'}`}>
              <i className={`fas ${item.icon}`}></i>
            </div>

            <span className={`text-[9px] sm:text-[10px] md:text-[14px] font-black text-center leading-tight md:leading-snug px-0.5 md:px-1 min-h-[2.4rem] sm:min-h-[2.8rem] md:min-h-0 flex items-center transition-colors duration-300 break-words ${locked ? 'text-slate-500 dark:text-slate-300' : 'text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'}`}>
              {displayTitle}
            </span>
          </a>
        );
      })}
    </div>
  );
};
