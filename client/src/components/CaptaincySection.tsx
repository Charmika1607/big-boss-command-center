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
  const { currentCaptain, removeCaptain, openModal, currentUser } = useCommandCenter();

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

          {/* Action buttons (Admin only) */}
          {currentUser.role === 'admin' && (
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
          )}
        </div>

        {/* Current Captain Spotlight */}
        {currentCaptain ? (
          <div className="relative z-10 bg-white/60 dark:bg-zinc-900/80 border border-amber-500/30 rounded-3xl p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="relative">
                <img
                  src={currentCaptain.avatar}
                  alt={currentCaptain.name}
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-amber-500 shadow-xl"
                />
                <div className="absolute -top-2 -right-2 p-1.5 rounded-full bg-amber-500 text-black shadow-md">
                  <Crown className="w-4 h-4 fill-black" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[10px] font-black uppercase font-orbitron px-2.5 py-0.5 rounded-full bg-amber-500 text-black">
                    REIGNING CAPTAIN
                  </span>
                  <span className="text-xs font-bold text-zinc-400">
                    Team {currentCaptain.team}
                  </span>
                </div>

                <h3 className="text-2xl font-black font-orbitron text-zinc-900 dark:text-white mt-1">
                  {currentCaptain.name}
                </h3>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md leading-relaxed">
                  {currentCaptain.bio || 'House leader commanding respect and enforcing task compliance.'}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-4 pt-2 text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
                    <ShieldCheck className="w-4 h-4" /> Captaincy Immunity Protected
                  </span>
                  <span className="text-amber-500 font-black font-orbitron">
                    {currentCaptain.points} Points Standing
                  </span>
                </div>
              </div>
            </div>

            {/* Privileges Box */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2 max-w-xs w-full">
              <div className="font-orbitron font-bold text-amber-700 dark:text-amber-300 uppercase text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                CONSTITUTIONAL PRIVILEGES
              </div>
              <ul className="space-y-1 text-zinc-600 dark:text-zinc-300 text-[11px] list-disc list-inside">
                <li>Exclusive Private Captain's Quarters</li>
                <li>Absolute immunity from Danger Zone</li>
                <li>Power to allocate luxury rations</li>
                <li>Weekly leadership bonus of +15 points</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="relative z-10 py-16 text-center text-zinc-400 flex flex-col items-center justify-center">
            <Crown className="w-12 h-12 mb-3 opacity-30 text-amber-500" />
            <h3 className="font-orbitron font-bold text-sm text-zinc-700 dark:text-zinc-300">
              CAPTAINCY IS CURRENTLY VACANT
            </h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              No housemate is currently appointed as Captain. Executive Big Boss action is required to commission the next captaincy task.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
