
import React, { useState, useEffect } from 'react';
import { UserProfile, WeatherCondition } from '../types';

const LOGO_URL = "https://i.ibb.co.com/pjNwjtj0/montana-AI-1-1.jpg";

interface TopNavbarProps {
  user: UserProfile;
  isAuthenticated: boolean;
  currentTime: string;
  weatherCondition: WeatherCondition;
  temp: number;
  humidity: number;
  precipitation: number;
  windspeed: number;
  windDirection: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLiteMode: boolean;
  toggleLiteMode: () => void;
  language: 'id' | 'en';
  setLanguage: (lang: 'id' | 'en') => void;
  onProfileClick: () => void;
}

interface NavBoxProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
}

const NavBox: React.FC<NavBoxProps> = ({ children, className = "", label }) => (
  <div className={`bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[24px] sm:rounded-[32px] p-3 sm:p-5 shadow-sm flex flex-col gap-2 sm:gap-2.5 transition-all hover:shadow-lg ring-1 ring-black/5 dark:ring-white/5 group ${className}`}>
    {label && <span className="text-[8px] sm:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] ml-1">{label}</span>}
    <div className="flex items-center gap-2 sm:gap-4">
      {children}
    </div>
  </div>
);

export const TopNavbar: React.FC<TopNavbarProps> = ({
  user,
  isAuthenticated,
  currentTime,
  weatherCondition,
  temp,
  humidity,
  precipitation,
  windspeed,
  windDirection,
  isDarkMode,
  toggleDarkMode,
  isLiteMode,
  toggleLiteMode,
  language,
  setLanguage,
  onProfileClick
}) => {
  const [coords, setCoords] = useState<{ lat: string; lon: string }>({ lat: "...", lon: "..." });
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [gpsStatus, setGpsStatus] = useState<'searching' | 'locked' | 'error'>('searching');
  const [compassHeading, setCompassHeading] = useState(0); // New: for accurate compass
  const [isMobileWeatherOpen, setIsMobileWeatherOpen] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState<Array<{ label: string; time: string }>>([]);
  const [isPrayerLoading, setIsPrayerLoading] = useState(false);

  useEffect(() => {
    // Handle Device Orientation for accurate compass
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setCompassHeading(event.alpha); // Alpha is Z-axis rotation (compass heading)
      }
    };

    // Request permission if needed (iOS 13+)
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permission: string) => {
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
          }
        })
        .catch(() => {
          // Fallback: Add listener anyway (Android)
          window.addEventListener('deviceorientation', handleDeviceOrientation);
        });
    } else {
      // Non-iOS devices
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    let watchId: number | null = null;
    if (navigator.geolocation) {
      setGpsStatus('searching');
      watchId = navigator.geolocation.watchPosition((pos) => {
        setAccuracy(pos.coords.accuracy);
        setCoords({
          lat: pos.coords.latitude.toFixed(6),
          lon: pos.coords.longitude.toFixed(6)
        });
        setGpsStatus('locked');
      }, (err) => {
        setGpsStatus('error');
      }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
    }

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const latitude = Number(coords.lat);
    const longitude = Number(coords.lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return;
    }

    let isCancelled = false;

    const loadPrayerTimes = async () => {
      try {
        setIsPrayerLoading(true);
        const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=3`);
        const payload = await response.json();
        const timings = payload?.data?.timings;

        if (!timings || isCancelled) {
          return;
        }

        setPrayerTimes([
          { label: language === 'id' ? 'Subuh' : 'Fajr', time: String(timings.Fajr).slice(0, 5) },
          { label: language === 'id' ? 'Dzuhur' : 'Dhuhr', time: String(timings.Dhuhr).slice(0, 5) },
          { label: language === 'id' ? 'Ashar' : 'Asr', time: String(timings.Asr).slice(0, 5) },
          { label: language === 'id' ? 'Magrib' : 'Maghrib', time: String(timings.Maghrib).slice(0, 5) },
          { label: language === 'id' ? 'Isya' : 'Isha', time: String(timings.Isha).slice(0, 5) },
        ]);
      } catch {
        if (!isCancelled) {
          setPrayerTimes([]);
        }
      } finally {
        if (!isCancelled) {
          setIsPrayerLoading(false);
        }
      }
    };

    loadPrayerTimes();

    return () => {
      isCancelled = true;
    };
  }, [coords.lat, coords.lon, language]);

  const getWeatherLabel = (condition: WeatherCondition) => {
    switch (condition) {
      case 'clear': return language === 'id' ? 'CERAH' : 'CLEAR';
      case 'rain': return language === 'id' ? 'HUJAN' : 'RAIN';
      case 'cloudy': return language === 'id' ? 'BERAWAN' : 'CLOUDY';
      case 'storm': return language === 'id' ? 'BADAI' : 'STORM';
      default: return 'SCANNING';
    }
  };

  const getWindDirectionRotation = (dir: string) => {
    const mapping: Record<string, number> = {
      'N': 0, 'NE': 45, 'E': 90, 'SE': 135,
      'S': 180, 'SW': 225, 'W': 270, 'NW': 315
    };
    return mapping[dir] || 0;
  };

  const getSignalStrength = () => {
    if (!accuracy) return 0;
    if (accuracy < 10) return 4;
    if (accuracy < 30) return 3;
    if (accuracy < 100) return 2;
    return 1;
  };

  const normalizedCompassHeading = Math.round(((compassHeading % 360) + 360) % 360);

  const weatherIconClass = weatherCondition === 'clear'
    ? 'fa-sun'
    : weatherCondition === 'rain'
      ? 'fa-cloud-showers-heavy'
      : weatherCondition === 'storm'
        ? 'fa-bolt'
        : 'fa-cloud';

  return (
    <header className={`fixed top-0 left-0 right-0 w-full z-[100] bg-gradient-to-b from-white/80 via-white/70 to-white/50 dark:from-slate-950/80 dark:via-slate-950/70 dark:to-slate-950/40 backdrop-blur-3xl border-b border-gradient transition-all duration-500 ${isLiteMode ? 'py-1.5 sm:py-2 md:py-2.5 px-2 sm:px-4 md:px-8 lg:px-10' : 'py-1.5 sm:py-2 md:py-3 px-2 sm:px-4 md:px-8 lg:px-10'}`} 
      style={{
        borderBottomImage: 'linear-gradient(90deg, rgba(16,185,129,0.3) 0%, rgba(52,211,153,0.1) 50%, rgba(16,185,129,0.3) 100%)',
        borderBottomImageSlice: 1,
        boxShadow: '0 4px 32px rgba(16, 185, 129, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 20px rgb(0 0 0 / 0.02)'
      }}>
      <div className="max-w-[1440px] mx-auto flex flex-col gap-0 md:gap-2.5 lg:gap-3">
        
        <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-4 lg:gap-5">
          <div 
            className={`flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 pl-1.5 sm:pl-2 md:pl-4 pr-1.5 sm:pr-2.5 md:pr-5 lg:pr-6 py-1 sm:py-1.5 md:py-2.5 lg:py-3 rounded-[16px] sm:rounded-[18px] md:rounded-[24px] lg:rounded-[28px] bg-gradient-to-br from-slate-900/95 to-slate-800/90 dark:from-emerald-600/95 dark:to-emerald-700/90 text-white cursor-pointer hover:shadow-xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-600/30 hover:scale-[1.02] active:scale-95 transition-all shadow-lg ring-1 ring-white/10 dark:ring-emerald-400/20 backdrop-blur-xl ${isLiteMode ? 'shrink-0' : ''}`}
            onClick={onProfileClick}
          >
            <div className="relative group shrink-0">
              <img 
                src={isAuthenticated ? user.photo : LOGO_URL} 
                className={`${isLiteMode ? 'w-5 h-5 sm:w-6 sm:h-6 md:w-9 md:h-9 lg:w-10 lg:h-10' : 'w-6 h-6 sm:w-7 sm:h-7 md:w-10 md:h-10 lg:w-11 lg:h-11'} rounded-[10px] sm:rounded-[12px] md:rounded-[16px] lg:rounded-[18px] object-cover border-2 border-white/20 bg-white shadow-lg`}
                alt="Profile"
              />
              <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 rounded-full border-2 border-slate-900 ${isAuthenticated ? 'bg-emerald-400' : 'bg-slate-400'} shadow-[0_0_10px_rgba(52,211,153,0.5)]`}></div>
            </div>
            <div className={`flex flex-col min-w-0 ${isLiteMode ? 'hidden md:flex' : 'hidden md:flex'}`}>
              <span className={`text-[11px] md:text-[13px] lg:text-[15px] font-black uppercase tracking-tight leading-none mb-0.5 truncate text-white`}>
                {isAuthenticated ? user.name : (language === 'id' ? 'AKSES PUBLIK' : 'PUBLIC ACCESS')}
              </span>
              <span className="text-[8px] md:text-[9px] lg:text-[10px] font-black text-white/80 uppercase tracking-[0.16em] truncate">
                {isAuthenticated ? user.jabatan : (language === 'id' ? 'IDENTITAS TERKUNCI' : 'IDENTITY LOCKED')}
              </span>
            </div>
          </div>

          <div className={`flex items-center gap-0.5 sm:gap-1.5 md:gap-2.5 lg:gap-3 bg-white/80 dark:bg-slate-900/80 border border-white/20 dark:border-slate-700/40 rounded-[20px] sm:rounded-[26px] md:rounded-[28px] lg:rounded-[32px] p-1 sm:p-1.5 md:p-2 lg:p-2.5 px-1.5 sm:px-2 md:px-4 lg:px-5 shadow-xl backdrop-blur-2xl ring-1 ring-white/30 dark:ring-emerald-400/10 transition-all duration-300 hover:bg-white/90 dark:hover:bg-slate-900/90 hover:ring-emerald-400/20 ${isLiteMode ? 'gap-0.5' : ''}`}>
             
             {/* BILINGUAL SWITCHER - hidden on mobile completely */}
             <div className={`hidden md:flex flex-col items-center gap-1 mr-0 md:mr-1 lg:mr-1.5`}>
               <div className="flex bg-slate-100/60 dark:bg-slate-800/60 backdrop-blur-lg p-1 md:p-1 lg:p-1.5 rounded-full ring-1 ring-black/5 dark:ring-emerald-400/10 border border-slate-200/40 dark:border-emerald-500/10">
                   <button 
                    onClick={() => setLanguage('id')}
                  className={`px-2.5 md:px-3 lg:px-3.5 py-0.5 md:py-0.5 lg:py-1 rounded-full text-[7px] md:text-[8px] lg:text-[9px] font-black transition-all ${language === 'id' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                   >ID</button>
                   <button 
                    onClick={() => setLanguage('en')}
                  className={`px-2.5 md:px-3 lg:px-3.5 py-0.5 md:py-0.5 lg:py-1 rounded-full text-[7px] md:text-[8px] lg:text-[9px] font-black transition-all ${language === 'en' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                   >EN</button>
                </div>
             </div>

             <div className={`flex flex-col items-center gap-0 ${isLiteMode ? 'gap-0' : ''}`}>
                <div className="toggle-btn-container shadow-lg shadow-emerald-500/20 dark:shadow-emerald-600/30 scale-50 sm:scale-60 md:scale-75 lg:scale-90 origin-center transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={isLiteMode}
                    onChange={toggleLiteMode}
                  />
                  <div className="knobs"></div>
                  <div className="layer"></div>
                </div>
             </div>

             <div className={`flex items-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-2.5 border-r border-slate-200/60 dark:border-emerald-500/20 pr-0.5 sm:pr-1 md:pr-2.5 lg:pr-3.5 ml-0 sm:ml-0.5 md:ml-1 lg:ml-1.5 ${isLiteMode ? 'gap-0.5' : ''}`}>
                <div className="flex flex-col items-end">
                 <span className={`text-[10px] sm:text-[11px] md:text-[14px] lg:text-[16px] font-black text-slate-900 dark:text-emerald-200 tabular-nums tracking-tighter leading-none`}>
                     {currentTime}
                   </span>
                </div>
               <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)] animate-pulse'}`}></div>
             </div>
             
             <button onClick={toggleDarkMode} className={`w-6 h-6 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-[14px] md:rounded-[16px] lg:rounded-[18px] bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-700 dark:text-emerald-300 active:scale-90 transition-all border border-slate-200/60 dark:border-emerald-500/20 hover:bg-gradient-to-br hover:from-slate-200 hover:to-slate-100 dark:hover:from-slate-600 dark:hover:to-slate-700 shadow-md hover:shadow-lg dark:hover:shadow-emerald-500/20`}>
               <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-[9px] sm:text-[10px] md:text-[13px] lg:text-[14px]`}></i>
             </button>
          </div>
        </div>

        {/* Row 2: Expandable Weather Strip - Mobile */}
        {!isLiteMode && (
          <div className="md:hidden px-0.5 pt-1.5">
            <button
              type="button"
              onClick={() => setIsMobileWeatherOpen((prev) => !prev)}
              className="w-full rounded-[22px] border border-emerald-200/40 dark:border-emerald-500/20 bg-gradient-to-r from-emerald-50/70 via-white/90 to-white/80 dark:from-emerald-950/35 dark:via-slate-900/90 dark:to-slate-900/80 backdrop-blur-2xl px-3 py-2.5 shadow-lg ring-1 ring-black/5 dark:ring-white/5 transition-all active:scale-[0.98]"
              aria-expanded={isMobileWeatherOpen}
              aria-label={language === 'id' ? 'Buka detail cuaca dan GPS' : 'Open weather and GPS details'}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-[14px] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-emerald-600 dark:to-emerald-700 text-white flex items-center justify-center text-[13px] shrink-0 shadow-lg dark:shadow-emerald-500/25">
                    <i className={`fas ${weatherIconClass}`}></i>
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[15px] font-black text-slate-900 dark:text-white leading-none tabular-nums">{temp}°</span>
                      <span className="text-[8px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.18em] truncate">{getWeatherLabel(weatherCondition)}</span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-[0.14em] truncate">
                      {gpsStatus} • {coords.lat} • {windDirection}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-inner">
                    <i
                      className="fas fa-location-arrow text-[11px] text-slate-700 dark:text-emerald-300 transition-transform duration-300"
                      style={{ transform: `rotate(${getWindDirectionRotation(windDirection)}deg)` }}
                    ></i>
                  </div>
                  <i className={`fas fa-chevron-${isMobileWeatherOpen ? 'up' : 'down'} text-[11px] text-slate-500 dark:text-slate-300`}></i>
                </div>
              </div>
            </button>

            <div className={`grid transition-all duration-500 ease-out ${isMobileWeatherOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
              <div className="overflow-hidden">
                <div className="rounded-[24px] border border-slate-200/70 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-3 shadow-xl ring-1 ring-black/5 dark:ring-white/5 transition-all duration-500 ease-out">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-[18px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-white/5 p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[8px] font-black uppercase tracking-[0.18em] ${gpsStatus === 'locked' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                        {gpsStatus}
                      </span>
                      <div className="flex items-end gap-1 h-4">
                        {[1, 2, 3, 4].map((bar) => (
                          <div
                            key={bar}
                            className={`w-1 rounded-t transition-all ${bar <= getSignalStrength() ? (gpsStatus === 'locked' ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-amber-500 animate-pulse') : 'bg-slate-200 dark:bg-slate-700'}`}
                            style={{ height: `${bar * 22}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 font-mono leading-tight truncate">{coords.lat}</p>
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 font-mono leading-tight truncate">{coords.lon}</p>
                    </div>
                  </div>

                  <div className="rounded-[18px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-white/5 p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[14px] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-emerald-600 dark:to-emerald-700 text-white flex items-center justify-center text-sm shrink-0 shadow-lg dark:shadow-emerald-500/25">
                      <i className={`fas ${weatherIconClass}`}></i>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.18em]">{getWeatherLabel(weatherCondition)}</p>
                      <p className="text-[18px] font-black text-slate-950 dark:text-white leading-none">{temp}°</p>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-300">{windspeed} km/h</p>
                    </div>
                  </div>

                  <div className="rounded-[18px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-white/5 p-3 space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[8px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-[0.18em]">Kompas</p>
                        <p className="text-[13px] font-black text-slate-950 dark:text-white leading-none mt-1">{windDirection}</p>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-300 mt-1">{getWindDirectionRotation(windDirection)}°</p>
                      </div>
                      <div className="relative w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-inner">
                        <span className="absolute top-1 text-[8px] font-black text-emerald-600 dark:text-emerald-400">N</span>
                        <i
                          className="fas fa-location-arrow text-[14px] text-slate-700 dark:text-emerald-300 transition-transform duration-300"
                          style={{ transform: `rotate(${getWindDirectionRotation(windDirection)}deg)` }}
                        ></i>
                      </div>
                    </div>
                    <div className="rounded-[14px] bg-white/90 dark:bg-slate-900/80 border border-slate-200/70 dark:border-white/5 p-2">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <p className="text-[8px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-[0.18em]">{language === 'id' ? 'Jadwal Salat' : 'Prayer Times'}</p>
                        <span className="text-[7px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.16em]">MWL</span>
                      </div>
                      {isPrayerLoading ? (
                        <div className="space-y-1.5">
                          {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="h-8 rounded-[10px] bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
                          ))}
                        </div>
                      ) : prayerTimes.length > 0 ? (
                        <div className="space-y-1">
                          {prayerTimes.map((prayer) => (
                            <div key={prayer.label} className="rounded-[10px] bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/5 px-2 py-1.5 flex items-center justify-between gap-2">
                              <p className="text-[8px] font-black text-slate-600 dark:text-slate-200 tracking-tight leading-none">{prayer.label}</p>
                              <p className="text-[10px] font-black text-slate-950 dark:text-white leading-none tabular-nums">{prayer.time}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[9px] font-bold text-slate-500 dark:text-slate-300 leading-snug">
                          {language === 'id' ? 'Jadwal salat menunggu GPS terkunci.' : 'Prayer times are waiting for GPS lock.'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[18px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-white/5 p-3 grid grid-cols-2 gap-2">
                    <div className="rounded-[14px] bg-white/90 dark:bg-slate-900/80 border border-slate-200/70 dark:border-white/5 p-2.5 text-center">
                      <div className="w-7 h-7 rounded-[12px] bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-[11px] mx-auto mb-2 shadow-md">
                        <i className="fas fa-compass"></i>
                      </div>
                      <p className="text-[8px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-tight">Perangkat</p>
                      <p className="text-[14px] font-black text-slate-950 dark:text-white leading-none mt-1">{normalizedCompassHeading}°</p>
                    </div>
                    <div className="rounded-[14px] bg-white/90 dark:bg-slate-900/80 border border-slate-200/70 dark:border-white/5 p-2.5 text-center">
                      <div className="w-7 h-7 rounded-[12px] bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-[11px] mx-auto mb-2 shadow-md">
                        <i className="fas fa-droplet"></i>
                      </div>
                      <p className="text-[8px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-tight">{language === 'id' ? 'Lemb' : 'H'}</p>
                      <p className="text-[14px] font-black text-slate-950 dark:text-white leading-none mt-1">{humidity}%</p>
                    </div>
                    <div className="rounded-[14px] bg-white/90 dark:bg-slate-900/80 border border-slate-200/70 dark:border-white/5 p-2.5 text-center">
                      <div className="w-7 h-7 rounded-[12px] bg-gradient-to-br from-cyan-500 to-cyan-600 text-white flex items-center justify-center text-[11px] mx-auto mb-2 shadow-md">
                        <i className="fas fa-cloud-rain"></i>
                      </div>
                      <p className="text-[8px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-tight">{language === 'id' ? 'H' : 'R'}</p>
                      <p className="text-[14px] font-black text-slate-950 dark:text-white leading-none mt-1">{precipitation}mm</p>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Row 2: Minimalist Horizontal Weather Strip - Desktop */}
        {!isLiteMode && (
          <div className="hidden md:flex items-center justify-center gap-2.5 lg:gap-4 px-2 md:px-3 lg:px-4 py-2 md:py-2.5 lg:py-3 bg-gradient-to-r from-emerald-50/40 dark:from-emerald-950/30 to-transparent backdrop-blur-xl border-t border-emerald-200/30 dark:border-emerald-800/30 rounded-b-lg overflow-x-auto scrollbar-hide shadow-inner transition-all duration-300" style={{ boxShadow: 'inset 0 1px 8px rgba(16, 185, 129, 0.05)' }}>
            
            {/* GPS Signal Indicator */}
            <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3 shrink-0">
              <div className="flex flex-col items-center gap-0.5 md:gap-1">
                <div className="flex items-end gap-1 md:gap-1 h-4 md:h-4.5 lg:h-5">
                  {[1,2,3,4].map(bar => (
                    <div 
                      key={bar} 
                      className={`w-1 md:w-1.5 lg:w-2 rounded-t transition-all ${bar <= getSignalStrength() ? (gpsStatus === 'locked' ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse') : 'bg-slate-200 dark:bg-slate-700'}`}
                      style={{ height: `${bar * 20}%` }}
                    />
                  ))}
                </div>
                <span className={`text-[6px] md:text-[7px] lg:text-[8px] font-black uppercase tracking-[0.2em] leading-none ${gpsStatus === 'locked' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {gpsStatus}
                </span>
              </div>
              <div className="flex flex-col gap-0 min-w-0">
                <span className="text-[8px] md:text-[8px] lg:text-[10px] font-bold text-slate-700 dark:text-slate-300 font-mono leading-tight truncate">{coords.lat}</span>
                <span className="text-[8px] md:text-[8px] lg:text-[10px] font-bold text-slate-700 dark:text-slate-300 font-mono leading-tight truncate">{coords.lon}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-5 md:h-6 lg:h-7 bg-slate-200 dark:bg-slate-700 shrink-0"></div>

            {/* Weather Info */}
            <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3 shrink-0">
              <div className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 dark:from-emerald-600 dark:to-emerald-700 text-white flex items-center justify-center text-[10px] md:text-[12px] lg:text-base flex-shrink-0 shadow-lg dark:shadow-emerald-500/30">
                <i className={`fas ${weatherIconClass}`}></i>
              </div>
              <div className="flex flex-col gap-0">
                <div className="flex items-baseline gap-1 md:gap-1.5">
                  <span className="text-[11px] md:text-[14px] lg:text-[18px] font-black text-slate-900 dark:text-white tabular-nums">{temp}°</span>
                  <span className="text-[6px] md:text-[7px] lg:text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase">{getWeatherLabel(weatherCondition)}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-5 md:h-6 lg:h-7 bg-slate-200 dark:bg-slate-700 shrink-0"></div>

            {/* Compass & Wind Info */}
            <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3 shrink-0 group cursor-pointer">
              <div className="relative w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 dark:from-emerald-600 dark:to-emerald-700 border border-slate-300 dark:border-emerald-600 flex items-center justify-center shrink-0 group-hover:shadow-lg dark:group-hover:shadow-emerald-500/30 transition-all">
                <i 
                  className="fas fa-location-arrow text-white text-[9px] md:text-[11px] lg:text-sm transition-transform duration-300"
                  style={{ transform: `rotate(${compassHeading}deg)` }}
                  title="Device Compass"
                ></i>
              </div>
              <div className="flex flex-col gap-0">
                <div className="text-[7px] md:text-[11px] lg:text-[13px] font-bold text-slate-600 dark:text-slate-400 uppercase leading-none">{windspeed} km/h</div>
                <div className="text-[6px] md:text-[10px] lg:text-[12px] font-bold text-slate-500 dark:text-slate-300">{windDirection}</div>
              </div>
              <div className="hidden md:block absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-[7px] md:text-[8px] lg:text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {Math.round(compassHeading)}°
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-5 md:h-6 lg:h-7 bg-slate-200 dark:bg-slate-700 shrink-0"></div>

            {/* Humidity & Rainfall */}
            <div className="flex items-center gap-2.5 md:gap-3 lg:gap-4 shrink-0">
              <div className="flex items-center gap-1.5 md:gap-2 lg:gap-2.5">
                <div className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white flex items-center justify-center text-[9px] md:text-[11px] lg:text-sm flex-shrink-0 shadow-lg dark:shadow-blue-500/30">
                  <i className="fas fa-droplet"></i>
                </div>
                <div className="flex flex-col gap-0">
                  <span className="text-[6px] md:text-[7px] lg:text-[9px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-tight">{language === 'id' ? 'Lemb' : 'H'}</span>
                  <span className="text-[9px] md:text-[14px] lg:text-[18px] font-black text-slate-900 dark:text-white leading-none">{humidity}%</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 lg:gap-2.5">
                <div className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 dark:from-cyan-600 dark:to-cyan-700 text-white flex items-center justify-center text-[9px] md:text-[11px] lg:text-sm flex-shrink-0 shadow-lg dark:shadow-cyan-500/30">
                  <i className="fas fa-cloud-rain"></i>
                </div>
                <div className="flex flex-col gap-0">
                  <span className="text-[6px] md:text-[7px] lg:text-[9px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-tight">{language === 'id' ? 'H' : 'R'}</span>
                  <span className="text-[9px] md:text-[14px] lg:text-[18px] font-black text-slate-900 dark:text-white leading-none">{precipitation}mm</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
