import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import {
  Crown,
  ShieldCheck,
  UserCheck,
  UserMinus,
  Sparkles,
  Award,
  AlertCircle
} from 'lucide-react';

export const CaptaincySection: React.FC = () => {
  const { currentCaptain, removeCaptain, openModal } = useCommandCenter();

  return (
    <div className="w-full space-y-6">
      {/* Main Showcase Card */}
      <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-zinc-900/60 to-zinc-950/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-amber-500/5 relative overflow-hidden">
        {/* Glow & Crown background stamp */}
        <div className="absolute top-2 right-4 text-amber-500/10 pointer-events-none">
          <Crown className="w-64 h-64 -rotate-12" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500 text-black shadow-lg shadow-amber-500/30">
              <Crown className="w-6 h-6 fill-black" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase font-orbitron tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                HOUSE CAPTAIN'S QUARTERS
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Supreme executive authority of the Big Boss House. Enforces tasks and commands immunity privileges.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openModal('captain')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-orbitron uppercase bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/20 transition-all hover:scale-105 shrink-0"
            >
              <Crown className="w-4 h-4 fill-black" />
              {currentCaptain ? 'Change Captain' : 'Appoint Captain'}
            </button>

            {currentCaptain && (
              <button
                onClick={() => removeCaptain()}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold font-orbitron uppercase bg-zinc-200 dark:bg-zinc-800 hover:bg-red-500/20 hover:text-red-500 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 transition-colors"
                title="Relieve current captain of command"
              >
                <UserMinus className="w-4 h-4" />
                Vacate
              </button>
            )}
          </div>
        </div>

        {/* Current Captain Profile */}
        {currentCaptain ? (
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center pt-4 border-t border-amber-500/20">
            {/* Avatar & Badges */}
            <div className="flex flex-col sm:flex-row items-center gap-5 lg:col-span-2">
              <div className="relative">
                <img
                  src={currentCaptain.avatar}
                  alt={currentCaptain.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-amber-400 shadow-2xl"
                />
                <div className="absolute -top-3 -right-2 p-2 rounded-2xl bg-amber-500 text-black shadow-lg animate-bounce">
                  <Crown className="w-5 h-5 fill-black" />
                </div>
              </div>

              <div className="text-center sm:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[10px] font-black uppercase font-orbitron px-2.5 py-0.5 rounded-full bg-amber-500 text-black">
                    SUPREME CAPTAIN
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    {currentCaptain.team} Team
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                  {currentCaptain.name}
                </h3>

                <p className="text-xs text-zinc-500 dark:text-zinc-300 max-w-md leading-relaxed">
                  {currentCaptain.bio || 'House leader overseeing duties, rations, and discipline.'}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 font-orbitron text-xs">
                  <span className="text-amber-500 font-bold">
                    Score: {currentCaptain.points} pts
                  </span>
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Direct Captaincy Immunity
                  </span>
                </div>
              </div>
            </div>

            {/* Captain Privileges Panel */}
            <div className="rounded-2xl bg-black/40 border border-amber-500/30 p-4 space-y-2.5 text-xs">
              <div className="font-bold text-[11px] uppercase tracking-wider font-orbitron text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                CONSTITUTIONAL PRIVILEGES
              </div>
              <ul className="space-y-2 text-zinc-300 text-[11px]">
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span> Immunity from public nomination
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span> Exclusive access to Captain's Suite
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span> Authority to allocate kitchen & chore duties
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span> Tie-breaker vote in House Council disputes
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="relative z-10 py-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 text-zinc-400 flex flex-col items-center justify-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mb-3 opacity-80" />
            <h3 className="font-orbitron font-bold text-base text-zinc-200">
              CAPTAINCY IS CURRENTLY VACANT
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mb-4">
              No contestant is currently assigned House Captain. Big Boss may decree a new leader at any time.
            </p>
            <button
              onClick={() => openModal('captain')}
              className="px-4 py-2 rounded-xl text-xs font-bold font-orbitron uppercase bg-amber-500 hover:bg-amber-600 text-black transition-all shadow-md"
            >
              Assign House Captain Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
