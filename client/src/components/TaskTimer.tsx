import React, { useState, useEffect, useRef } from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { soundFX } from '../services/audio';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Bell,
  Clock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export const TaskTimer: React.FC = () => {
  const { makeAnnouncement } = useCommandCenter();

  // Inputs
  const [inputMinutes, setInputMinutes] = useState<number>(15);
  const [inputSeconds, setInputSeconds] = useState<number>(0);

  // Timer State
  const [totalSeconds, setTotalSeconds] = useState<number>(15 * 60);
  const [status, setStatus] = useState<'READY' | 'RUNNING' | 'PAUSED' | 'COMPLETED'>('READY');
  const timerRef = useRef<any>(null);

  // Presets
  const presets = [
    { label: '3 MIN', min: 3, sec: 0 },
    { label: '5 MIN', min: 5, sec: 0 },
    { label: '10 MIN', min: 10, sec: 0 },
    { label: '15 MIN', min: 15, sec: 0 },
    { label: '30 MIN', min: 30, sec: 0 },
    { label: '60 MIN', min: 60, sec: 0 }
  ];

  const applyPreset = (m: number, s: number) => {
    if (status === 'RUNNING') return;
    setInputMinutes(m);
    setInputSeconds(s);
    setTotalSeconds(m * 60 + s);
    setStatus('READY');
    soundFX.playClick();
  };

  const handleStart = () => {
    if (totalSeconds <= 0) return;
    setStatus('RUNNING');
    soundFX.playClick();
  };

  const handlePause = () => {
    setStatus('PAUSED');
    soundFX.playClick();
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTotalSeconds(inputMinutes * 60 + inputSeconds);
    setStatus('READY');
    soundFX.playClick();
  };

  // Timer tick effect
  useEffect(() => {
    if (status === 'RUNNING') {
      timerRef.current = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setStatus('COMPLETED');
            soundFX.playTimerDone();
            makeAnnouncement('🚨 TIME UP! The official Big Boss task countdown timer has expired!', 'emergency', true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, makeAnnouncement]);

  const minutesDisplay = Math.floor(totalSeconds / 60);
  const secondsDisplay = totalSeconds % 60;
  const formattedTime = `${String(minutesDisplay).padStart(2, '0')}:${String(secondsDisplay).padStart(2, '0')}`;

  const progressPercent =
    inputMinutes * 60 + inputSeconds > 0
      ? (totalSeconds / (inputMinutes * 60 + inputSeconds)) * 100
      : 0;

  return (
    <div className="w-full bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-lg relative overflow-hidden">
      {/* Background glow when running or time up */}
      {status === 'RUNNING' && (
        <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-600/5 animate-pulse pointer-events-none" />
      )}
      {status === 'COMPLETED' && (
        <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase font-orbitron tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
              TASK COUNTDOWN RADAR
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Precision reality-show challenge clock with automatic siren broadcast upon expiration.
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-black font-orbitron uppercase tracking-widest border ${
              status === 'RUNNING'
                ? 'bg-blue-500/20 text-blue-500 border-blue-500/40 animate-pulse'
                : status === 'COMPLETED'
                ? 'bg-red-600 text-white border-red-500 animate-bounce'
                : status === 'PAUSED'
                ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700'
            }`}
          >
            {status === 'COMPLETED' ? '🚨 TIME UP' : status}
          </span>
        </div>
      </div>

      {/* Main Digital Clock Display */}
      <div className="flex flex-col items-center justify-center my-6 py-8 px-4 rounded-3xl bg-zinc-950/90 border border-zinc-800 relative shadow-2xl overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 cyber-grid opacity-30" />

        {status === 'COMPLETED' ? (
          <div className="relative z-10 text-center animate-bounce">
            <div className="text-5xl sm:text-7xl md:text-8xl font-black font-orbitron tracking-widest text-red-500 drop-shadow-[0_0_35px_rgba(239,68,68,0.8)]">
              00:00
            </div>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white font-black font-orbitron uppercase text-sm tracking-widest">
              <AlertTriangle className="w-4 h-4" /> TIME EXPIRED • TASK TERMINATED
            </div>
          </div>
        ) : (
          <div className="relative z-10 text-center">
            <div className="text-6xl sm:text-8xl md:text-9xl font-black font-orbitron tracking-widest text-zinc-100 dark:text-zinc-100 drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
              {formattedTime}
            </div>
            <div className="text-xs uppercase font-bold tracking-widest font-rajdhani text-zinc-400 mt-2">
              MINUTES : SECONDS REMAINING
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full max-w-lg mt-6 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              status === 'COMPLETED'
                ? 'bg-red-500'
                : totalSeconds < 60
                ? 'bg-red-500'
                : 'bg-gradient-to-r from-blue-500 to-amber-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Control Buttons: START, PAUSE, RESET */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 my-6">
        {status === 'RUNNING' ? (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-black font-orbitron uppercase tracking-wider text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
          >
            <Pause className="w-4 h-4 fill-black" />
            PAUSE
          </button>
        ) : (
          <button
            onClick={handleStart}
            disabled={totalSeconds <= 0}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black font-orbitron uppercase tracking-wider text-sm shadow-xl shadow-red-600/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 fill-white" />
            START TIMER
          </button>
        )}

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-black font-orbitron uppercase tracking-wider text-sm border border-zinc-200 dark:border-zinc-700 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          RESET
        </button>
      </div>

      {/* Presets and Custom Inputs */}
      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800/80 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Presets */}
        <div>
          <div className="text-[10px] font-black uppercase font-orbitron tracking-wider text-zinc-400 mb-2.5">
            CHALLENGE DURATION PRESETS
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                disabled={status === 'RUNNING'}
                onClick={() => applyPreset(preset.min, preset.sec)}
                className="py-2 px-2 text-center rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 text-xs font-bold font-orbitron text-zinc-700 dark:text-zinc-300 hover:border-red-500 hover:text-red-500 disabled:opacity-50 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div>
          <div className="text-[10px] font-black uppercase font-orbitron tracking-wider text-zinc-400 mb-2.5">
            CUSTOM TARGET DURATION
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 flex-1">
              <input
                type="number"
                min="0"
                max="180"
                disabled={status === 'RUNNING'}
                value={inputMinutes}
                onChange={(e) => {
                  const m = Math.max(0, parseInt(e.target.value) || 0);
                  setInputMinutes(m);
                  if (status !== 'RUNNING') setTotalSeconds(m * 60 + inputSeconds);
                }}
                className="w-full px-3 py-2 rounded-xl text-center font-orbitron font-bold text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 disabled:opacity-50"
              />
              <span className="text-xs font-bold text-zinc-400">MIN</span>
            </div>

            <div className="flex items-center gap-1.5 flex-1">
              <input
                type="number"
                min="0"
                max="59"
                disabled={status === 'RUNNING'}
                value={inputSeconds}
                onChange={(e) => {
                  const s = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                  setInputSeconds(s);
                  if (status !== 'RUNNING') setTotalSeconds(inputMinutes * 60 + s);
                }}
                className="w-full px-3 py-2 rounded-xl text-center font-orbitron font-bold text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 disabled:opacity-50"
              />
              <span className="text-xs font-bold text-zinc-400">SEC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
