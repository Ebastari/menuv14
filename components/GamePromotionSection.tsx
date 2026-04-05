
import React from 'react';

export const GamePromotionSection: React.FC = () => {
  // 6 Foto asli dari link yang diberikan oleh user
  const photos = [
    {
      src: "https://i.ibb.co.com/PZphKq1K/pokemon1.jpg",
      label: "Simulation Core"
    },
    {
      src: "https://i.ibb.co.com/KcBMnh47/pokemon2.jpg",
      label: "Strategic Planning"
    },
    {
      src: "https://i.ibb.co.com/HTqTzXKm/pokemon3.jpg",
      label: "Ecosystem Analysis"
    },
    {
      src: "https://i.ibb.co.com/Y7pQ4MNP/pokemon4.jpg",
      label: "Target Mapping"
    },
    {
      src: "https://i.ibb.co.com/yBFmDstz/pokemon5.jpg",
      label: "Growth Engine"
    },
    {
      src: "https://i.ibb.co.com/Txk5KQKn/pokemon6.jpg",
      label: "Final Objective"
    }
  ];

  return (
    <section className="px-3 md:px-6 py-10 md:py-16 max-w-[1440px] mx-auto animate-fadeIn">
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[28px] md:rounded-[56px] p-4 md:p-16 border border-white/40 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:shadow-[0_32px_120px_rgba(0,0,0,0.1)] relative overflow-hidden group/card">
        
        {/* Dekorasi Latar Belakang - Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover/card:bg-emerald-500/20 transition-colors duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-2 md:gap-3 bg-slate-900 dark:bg-emerald-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-[7px] md:text-[10px] font-black uppercase tracking-[0.18em] md:tracking-[0.4em] mb-2 md:mb-4 shadow-xl md:shadow-2xl shadow-emerald-500/20">
              <i className="fas fa-gamepad animate-bounce"></i>
              Interactive Simulation
            </div>
            <h2 className="text-xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
              Game <span className="text-emerald-600">Pokemonkey</span> <br className="hidden md:block" />
              <span className="opacity-80">Planing Target 2026 Reklamasi</span>
            </h2>
            <div className="flex items-center justify-center gap-2 md:gap-4">
               <div className="h-[1px] w-6 md:w-12 bg-slate-200 dark:bg-slate-700"></div>
               <p className="text-[11px] md:text-2xl font-medium italic text-slate-500 dark:text-slate-400">
                “Pekerjaan serasa bermain tapi hasil bukan main-main”
               </p>
               <div className="h-[1px] w-6 md:w-12 bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>

          {/* 6 Photo Layout - Mobile Horizontal, Desktop Grid */}
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-6 w-full mb-8 md:mb-16 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {photos.map((item, idx) => (
              <div 
                key={idx} 
                className="min-w-[31%] md:min-w-0 aspect-square md:aspect-video rounded-[16px] md:rounded-[32px] overflow-hidden border-2 md:border-4 border-white dark:border-slate-800 shadow-md md:shadow-xl group relative cursor-pointer transform hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500 shrink-0"
              >
                <img 
                  src={item.src} 
                  alt={item.label} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Fallback ke unslash jika link bermasalah
                    target.src = `https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-2 md:p-6">
                  <span className="text-[6px] md:text-[10px] font-black text-emerald-400 uppercase tracking-[0.16em] md:tracking-[0.3em] mb-0.5 md:mb-1">Aset {idx + 1}</span>
                  <h4 className="text-white font-black text-[9px] md:text-lg uppercase tracking-tight leading-tight">{item.label}</h4>
                </div>
                {/* Overlay Subtle Glow */}
                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[16px] md:rounded-[32px]"></div>
              </div>
            ))}
          </div>

          {/* Call to Action Button */}
          <div className="relative group/btn">
            <div className="absolute -inset-4 bg-emerald-500/30 rounded-[40px] blur-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
            <a
              href="https://pokemonkey.montana-tech.info/"
              target="_blank"
              rel="noopener noreferrer"
              data-viewer-title="Pokemonkey Simulation"
              className="relative flex items-center gap-3 md:gap-6 px-6 md:px-16 py-3.5 md:py-8 bg-slate-900 dark:bg-emerald-600 text-white rounded-[18px] md:rounded-[32px] font-black text-[10px] md:text-base uppercase tracking-[0.14em] md:tracking-[0.3em] shadow-[0_12px_28px_rgba(16,185,129,0.2)] md:shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite]"></div>
              <i className="fas fa-play-circle text-lg md:text-3xl group-hover:rotate-12 transition-transform"></i>
              <span>Mulai Simulasi Sekarang</span>
            </a>
          </div>
          
          <div className="mt-6 md:mt-12 flex items-center gap-4 md:gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
            <i className="fab fa-unity text-lg md:text-2xl"></i>
            <i className="fas fa-vr-cardboard text-lg md:text-2xl"></i>
            <i className="fas fa-microchip text-lg md:text-2xl"></i>
          </div>

          <p className="text-[7px] md:text-[10px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-[0.16em] md:tracking-[0.5em] mt-5 md:mt-10 text-center">
            Professional Reclamation Simulation Engine
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
};
