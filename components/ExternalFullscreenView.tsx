import React from 'react';

interface ExternalFullscreenViewProps {
  title: string;
  subtitle: string;
  url: string;
  accent: 'emerald' | 'blue';
  onClose: () => void;
}

export const ExternalFullscreenView: React.FC<ExternalFullscreenViewProps> = ({ title, subtitle, url, accent, onClose }) => {
  const accentClass = accent === 'emerald'
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-blue-600 dark:text-blue-400';

  const buttonClass = accent === 'emerald'
    ? 'bg-emerald-600 shadow-emerald-600/20'
    : 'bg-blue-600 shadow-blue-600/20';

  return (
    <div className="fixed inset-0 z-[208] bg-white dark:bg-slate-950 flex flex-col animate-fadeIn overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800 z-20">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.16em] active:scale-95 transition-all shadow-lg"
        >
          <i className="fas fa-arrow-left"></i>
          <span>Kembali</span>
        </button>

        <div className="min-w-0 flex-1 text-center px-2">
          <h2 className="text-[11px] md:text-[14px] font-black uppercase tracking-[0.16em] text-slate-900 dark:text-white truncate">
            {title}
          </h2>
          <p className={`text-[8px] md:text-[9px] font-bold uppercase tracking-[0.22em] mt-1 truncate ${accentClass}`}>
            {subtitle}
          </p>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          data-open-raw="true"
          className={`shrink-0 inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-2xl text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.16em] active:scale-95 transition-all shadow-lg ${buttonClass}`}
        >
          <i className="fas fa-up-right-from-square text-[8px]"></i>
          <span className="hidden sm:inline">Buka Asli</span>
        </a>
      </header>

      <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-2 sm:p-3 md:p-5 overflow-hidden">
        <div className="w-full h-full rounded-[22px] md:rounded-[34px] overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_24px_72px_rgba(15,23,42,0.18)] dark:shadow-[0_24px_72px_rgba(0,0,0,0.45)] ring-1 ring-black/5 dark:ring-white/5 relative">
          <iframe
            src={url}
            title={title}
            className="w-full h-full border-none bg-white"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="geolocation; camera; microphone; clipboard-read; clipboard-write; fullscreen"
          ></iframe>

          <div className="absolute top-3 left-3 md:top-5 md:left-5 flex items-center gap-2 px-3 py-2 bg-black/65 backdrop-blur-xl rounded-full border border-white/15 pointer-events-none shadow-2xl">
            <div className={`w-2 h-2 rounded-full animate-pulse ${accent === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
            <span className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-[0.18em]">Full Screen Internal Viewer</span>
          </div>
        </div>
      </div>
    </div>
  );
};