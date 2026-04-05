import React from 'react';

interface ExternalPortraitViewProps {
  title: string;
  url: string;
  onClose: () => void;
}

export const ExternalPortraitView: React.FC<ExternalPortraitViewProps> = ({ title, url, onClose }) => {
  return (
    <div className="fixed inset-0 z-[205] bg-white dark:bg-slate-950 flex flex-col animate-fadeIn overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 z-20">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
        >
          <i className="fas fa-arrow-left"></i>
          <span>Kembali</span>
        </button>

        <div className="min-w-0 flex-1 text-center px-2">
          <h2 className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.18em] text-slate-900 dark:text-white truncate">
            {title}
          </h2>
          <p className="text-[8px] md:text-[9px] font-bold text-emerald-600 uppercase tracking-[0.24em] mt-1">
            Montana AI
          </p>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          data-open-raw="true"
          className="shrink-0 inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-2xl bg-emerald-600 text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.18em] active:scale-95 transition-all shadow-lg shadow-emerald-600/20"
        >
          <i className="fas fa-up-right-from-square text-[8px]"></i>
          <span className="hidden sm:inline">Buka Asli</span>
        </a>
      </header>

      <div className="flex-1 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_42%),linear-gradient(180deg,rgba(248,250,252,1),rgba(241,245,249,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_32%),linear-gradient(180deg,rgba(2,6,23,1),rgba(15,23,42,1))] px-3 py-4 md:px-8 md:py-8 overflow-auto">
        <div className="min-h-full flex items-center justify-center">
          <div className="w-full max-w-[560px] h-[calc(100vh-7.5rem)] md:h-auto md:aspect-[9/16] md:max-h-[calc(100vh-8.5rem)] rounded-[30px] md:rounded-[38px] overflow-hidden border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 shadow-[0_30px_100px_rgba(15,23,42,0.22)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.55)] ring-1 ring-white/60 dark:ring-white/5">
            <iframe
              src={url}
              title={title}
              className="w-full h-full border-none bg-white"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="clipboard-read; clipboard-write; geolocation; camera; microphone; fullscreen"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};