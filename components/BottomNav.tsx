
import React from 'react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAuthenticated: boolean;
  userRole: 'admin' | 'guest' | 'none';
  onRequestLogin: () => void;
  onOpenExternalLink: (payload: { title: string; url: string }) => void;
  language?: 'id' | 'en';
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  activeTab, 
  setActiveTab, 
  isAuthenticated, 
  userRole,
  onRequestLogin,
  onOpenExternalLink,
  language = 'id'
}) => {

  const navItems = [
    { id: 'home', icon: 'fa-house', label: language === 'id' ? 'Beranda' : 'Home' },
    { id: 'peta', icon: 'fa-map-location-dot', label: language === 'id' ? 'Peta' : 'Maps', external: 'https://ebastari.github.io/Realisasi-pekerjaan/Realisasi2025.html', isAdminOnly: true },
    { id: 'montana', icon: 'fa-camera', label: language === 'id' ? 'Kamera' : 'Capture', external: 'https://camera.montana-tech.info/', isAdminOnly: true },
    { id: 'notif', icon: 'fa-bell', label: language === 'id' ? 'Notif' : 'Alerts', external: 'https://ebastari.github.io/notifikasi/notif.html', isAdminOnly: true },
    { id: 'profile', icon: isAuthenticated ? 'fa-user-gear' : 'fa-door-open', label: isAuthenticated ? (language === 'id' ? 'Profil' : 'Settings') : (language === 'id' ? 'Masuk' : 'Login'), isAuthTrigger: true }
  ];

  const handleNavClick = (item: any) => {
    if (item.isAuthTrigger) {
      if (isAuthenticated) {
        setActiveTab('profile');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        onRequestLogin();
      }
      return;
    }

    if (!isAuthenticated) {
      onRequestLogin();
      return;
    }

    if (item.isAdminOnly && userRole !== 'admin') {
      alert(language === 'id' ? "Akses Administrator diperlukan." : "Administrator access required.");
      return;
    }

    if (item.external) {
      onOpenExternalLink({ title: item.label, url: item.external });
    } else {
      setActiveTab(item.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-3 md:p-6 pointer-events-none pb-[calc(1rem+env(safe-area-inset-bottom,0px))] md:pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]">
      <div className="max-w-[480px] mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[30px] md:rounded-[44px] border border-white/50 dark:border-white/10 shadow-[0_24px_72px_rgba(0,0,0,0.34)] md:shadow-[0_40px_120px_rgba(0,0,0,0.5)] flex justify-around p-1.5 md:p-2 pointer-events-auto ring-1 ring-black/5 dark:ring-white/5 relative">

        {navItems.map((item) => {
          const isCurrent = activeTab === item.id || (item.isAuthTrigger && activeTab === 'profile');
          const isLocked = !isAuthenticated && !item.isAuthTrigger;
          const isRoleLocked = item.isAdminOnly && userRole === 'guest';
          
          return (
            <button 
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-center py-3 md:py-5 px-0.5 md:px-1 rounded-[22px] md:rounded-[32px] transition-all duration-500 relative flex-1 group active:scale-90 ${isCurrent ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'} ${(isLocked || isRoleLocked) ? 'opacity-30' : 'opacity-100'}`}
            >
              {isCurrent && (
                <div className="absolute inset-1 bg-emerald-500/10 dark:bg-emerald-400/15 rounded-[20px] md:rounded-[30px] transition-all animate-pulse-gentle"></div>
              )}
              
              <div className="relative mb-1.5 md:mb-2">
                <i className={`fas ${item.icon} text-[17px] md:text-[22px] transition-all duration-500 relative z-10 ${isCurrent ? 'scale-110 -translate-y-1.5 md:-translate-y-2 drop-shadow-[0_8px_12px_rgba(16,185,129,0.45)]' : 'group-hover:scale-110 group-hover:-translate-y-1'}`}></i>
                
                {(isLocked || isRoleLocked) && (
                  <div className="absolute -top-1.5 -right-2 md:-top-2 md:-right-3 w-3.5 h-3.5 md:w-4 md:h-4 bg-slate-900 dark:bg-slate-800 rounded-full flex items-center justify-center ring-2 md:ring-4 ring-white dark:ring-slate-900 shadow-xl border border-white/10">
                    <i className="fas fa-lock text-[6px] md:text-[7px] text-white"></i>
                  </div>
                )}
              </div>

              <span className={`text-[7px] md:text-[8.5px] font-black uppercase tracking-[0.14em] md:tracking-widest relative z-10 transition-all duration-500 ${isCurrent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 scale-90 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100'}`}>
                  {item.label}
              </span>

              {isCurrent && (
                <div className="absolute bottom-1.5 md:bottom-2.5 w-1 h-1 md:w-1.5 md:h-1.5 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,1)]"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
