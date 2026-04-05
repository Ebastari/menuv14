import React, { useEffect, useState } from 'react';

interface AppSheetBibitViewProps {
  onClose: () => void;
}

const APPSHEET_BIBIT_URL = 'https://www.appsheet.com/start/91bfe218-36d0-4f6e-ac9e-ca32b4ddb0c7?platform=desktop#appName=RimbaRaya-863683625-25-05-22&vss=H4sIAAAAAAAAA6WOMQ7CMBAE_7K1X-ASRIEQNCAaTOHEZ8kisaPYASLLf-cSQNQR5c1pdjfj7uhxTLq-QV7y79rRCImscBo7UpAK6-BTHxoFoXDQ7RuuXOWSQkG5iq-cKELmBa78o1fAGfLJWU+9FDRpHPCR-D0pDGYBRaAdkq4amneyUAozG-ohkjnziKXlces3z057sw-G86xuIpUXf0AzE1YBAAA=&view=Bibit';

export const AppSheetBibitView: React.FC<AppSheetBibitViewProps> = ({ onClose }) => {
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 720,
  }));

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  const isPortraitMobile = viewport.width < 768 && viewport.height > viewport.width;

  return (
    <div className="fixed inset-0 z-[211] bg-white dark:bg-slate-950 flex flex-col animate-fadeIn overflow-hidden">
      {isPortraitMobile ? (
        <>
          <div className="absolute top-3 left-3 right-3 z-50 flex items-center justify-between gap-2 pointer-events-none">
            <button
              onClick={onClose}
              className="pointer-events-auto flex items-center gap-2 px-3 py-2 bg-slate-900/85 dark:bg-emerald-600/90 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.14em] backdrop-blur-xl active:scale-95 transition-all shadow-lg"
            >
              <i className="fas fa-arrow-left"></i>
              <span>Kembali</span>
            </button>

            <a
              href={APPSHEET_BIBIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto px-3 py-2 bg-white/85 dark:bg-slate-900/85 text-slate-700 dark:text-slate-100 rounded-2xl text-[8px] font-black uppercase tracking-[0.12em] border border-slate-200/70 dark:border-slate-700/70 backdrop-blur-xl"
            >
              Buka Asli
            </a>
          </div>

          <div className="absolute inset-0 bg-slate-950 overflow-hidden">
            <div
              className="absolute top-1/2 left-1/2 overflow-hidden bg-white shadow-2xl"
              style={{
                width: `${viewport.height}px`,
                height: `${viewport.width}px`,
                transform: 'translate(-50%, -50%) rotate(90deg)',
                transformOrigin: 'center center',
              }}
            >
              <iframe
                src={APPSHEET_BIBIT_URL}
                className="w-full h-full border-none bg-white"
                title="AppSheet Form Bibit"
                loading="lazy"
                frameBorder="0"
                style={{ border: 0 }}
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </>
      ) : (
        <>
          <header className="flex items-center justify-between gap-3 px-4 md:px-6 py-4 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 z-50">
            <button
              onClick={onClose}
              className="flex items-center gap-3 px-4 md:px-5 py-2.5 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.18em] active:scale-95 transition-all shadow-lg"
            >
              <i className="fas fa-arrow-left"></i>
              <span>Kembali</span>
            </button>

            <div className="flex-1 min-w-0 text-center px-2">
              <h2 className="text-[12px] md:text-[14px] font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none truncate">
                Form Bibit AppSheet
              </h2>
              <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-[0.18em] mt-1 truncate">
                Embedded Input View
              </p>
            </div>

            <a
              href={APPSHEET_BIBIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-3 md:px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100 rounded-2xl text-[9px] font-black uppercase tracking-[0.14em] border border-slate-200 dark:border-slate-700 hover:border-emerald-500/40 transition-all"
            >
              Buka Asli
            </a>
          </header>

          <div className="flex-1 bg-slate-100 dark:bg-slate-900 relative flex items-center justify-center p-3 md:p-6 overflow-auto">
            <div className="w-full max-w-[1800px] aspect-[16/9] rounded-[22px] md:rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.16)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)] bg-white ring-1 ring-black/5 dark:ring-white/5">
              <iframe
                src={APPSHEET_BIBIT_URL}
                className="w-full h-full border-none bg-white"
                title="AppSheet Form Bibit"
                loading="lazy"
                frameBorder="0"
                style={{ border: 0 }}
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <footer className="px-4 md:px-6 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between gap-3">
            <span className="text-[7px] md:text-[8px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-[0.18em] truncate">
              Example embedded AppSheet form inside Montana AI
            </span>
            <div className="flex gap-2 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-75"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-150"></div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};