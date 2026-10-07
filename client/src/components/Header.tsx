import React, { useState, useEffect } from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Crown,
  RotateCcw,
  Radio,
  Eye,
  Megaphone,
  Menu
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileNav?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const {
    currentCaptain,
    latestAnnouncement,
    isMuted,
    toggleMute,
    resetToFactorySeed,
    openModal
  } = useCommandCenter();

  const { theme, toggleTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }).toUpperCase()
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors duration-200 bg-white/80 dark:bg-zinc-950/85 border-zinc-200 dark:border-zinc-800/80 shadow-md">
      {/* Top emergency announcement bar if pinned/available */}
      {latestAnnouncement && (
        <div className="bg-gradient-to-r from-red-600/90 via-red-700/90 to-red-600/90 text-white text-xs py-1.5 px-4 flex items-center justify-between font-medium tracking-wide">
          <div className="flex items-center gap-2 overflow-hidden mx-auto max-w-7xl w-full">
            <span className="flex items-center gap-1.5 font-bold uppercase font-orbitron bg-black/30 px-2 py-0.5 rounded text-[10px] shrink-0 border border-white/20">
              <Megaphone className="w-3 h-3 text-amber-300 animate-pulse" />
              BIG BOSS TRANSMISSION
            </span>
            <div className="truncate text-white/95 text-xs font-semibold">
              "{latestAnnouncement.message}"
            </div>
          </div>
          <button
            onClick={() => openModal('announcement')}
            className="text-[10px] uppercase font-bold tracking-wider hover:underline ml-3 shrink-0 opacity-90 hover:opacity-100"
          >
            Broadcast +
          </button>
        </div>
      )}

      {/* Main command bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Branding & Eye */}
        <div className="flex items-center gap-3.5">
          {onToggleMobileNav && (
            <button
              onClick={onToggleMobileNav}
              className="md:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          <div className="flex items-center gap-3">
            {/* High tech eye logo */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-rose-950 text-white shadow-lg shadow-red-600/30 border border-red-500/50">
              <Eye className="w-6 h-6 animate-pulse text-white" />
              <div className="absolute inset-0 rounded-xl ring-2 ring-red-500/20 animate-ping pointer-events-none" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-wider uppercase font-orbitron text-zinc-900 dark:text-white leading-none">
                  BIG BOSS
                </h1>
                {/* Live Pill Indicator */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/15 border border-red-500/40 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest font-orbitron">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-live-pulse" />
                  LIVE
                </div>
              </div>
              <p className="text-[11px] font-bold tracking-widest uppercase font-rajdhani text-zinc-500 dark:text-zinc-400 mt-0.5">
                HOUSE COMMAND CENTER
              </p>
            </div>
          </div>
        </div>

        {/* Center / Captain Quick Badge */}
        <div className="hidden lg:flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800/80 px-3.5 py-1.5 rounded-xl shadow-inner">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/30">
              <Crown className="w-4 h-4 fill-amber-500/20" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-orbitron">
                HOUSE CAPTAIN
              </div>
              <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[140px]">
                {currentCaptain ? currentCaptain.name : 'VACANT'}
              </div>
            </div>
          </div>
          {currentCaptain && (
            <img
              src={currentCaptain.avatar}
              alt={currentCaptain.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-500/50"
            />
          )}
        </div>

        {/* Right: Controls & Digital Clock */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live digital clock */}
          <div className="hidden sm:flex flex-col items-end pr-2 border-r border-zinc-200 dark:border-zinc-800">
            <div className="text-xs font-black font-orbitron tracking-widest text-red-600 dark:text-red-400">
              {currentTime}
            </div>
            <div className="text-[9px] font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 font-rajdhani">
              {currentDate}
            </div>
          </div>

          {/* Sound Mute/Unmute */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-xl border transition-all duration-200 ${
              isMuted
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-zinc-800'
                : 'bg-zinc-100 dark:bg-zinc-800 text-red-600 dark:text-red-400 border-zinc-300 dark:border-zinc-700 shadow-sm'
            }`}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            aria-label="Toggle Sound Effects"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Theme Switcher: Dark / Light */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-amber-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Reset seed button */}
          <button
            onClick={resetToFactorySeed}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            title="Reset DB to official demo seed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="font-orbitron text-[10px]">RESET SEED</span>
          </button>
        </div>
      </div>
    </header>
  );
};
