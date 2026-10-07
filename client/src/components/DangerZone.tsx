import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import {
  AlertOctagon,
  AlertTriangle,
  Shield,
  ShieldAlert,
  Flame,
  Check,
  UserX,
  Plus
} from 'lucide-react';

export const DangerZone: React.FC = () => {
  const { nominees, removeNomination, openModal, currentUser } = useCommandCenter();

  return (
    <div className="w-full rounded-3xl border-2 border-red-600/60 bg-gradient-to-b from-red-950/40 via-red-900/10 to-zinc-950/60 p-5 sm:p-7 backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-red-900/30">
      {/* Hazard Background Stripes */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_12px,#000_12px,#000_24px)]" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-2">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/40 animate-pulse border border-red-400">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black uppercase font-orbitron tracking-wider text-red-600 dark:text-red-500 flex items-center gap-2">
                ⚠ DANGER ZONE
              </h2>
              <span className="text-[11px] font-black uppercase font-orbitron px-2.5 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                ELIMINATION THREAT
              </span>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 mt-1">
              Contestants in this sector are vulnerable to imminent eviction from the House.
            </p>
          </div>
        </div>

        {currentUser.role === 'admin' && (
          <button
            onClick={() => openModal('nominate')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-orbitron uppercase bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nominate Housemate
          </button>
        )}
      </div>

      {/* Nominees List */}
      {nominees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nominees.map((nominee) => (
            <div
              key={nominee.id}
              className="rounded-2xl border-2 border-red-500/50 bg-black/60 dark:bg-zinc-900/80 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between relative group hover:border-red-400 transition-all"
            >
              {/* Warning badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={nominee.avatar}
                      alt={nominee.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-red-500 shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-red-600 text-white animate-bounce">
                      <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-base text-white tracking-wide">
                      {nominee.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-600/20 text-red-400 border border-red-500/30">
                        {nominee.team} Team
                      </span>
                      <span className="text-[10px] font-black font-orbitron text-amber-400">
                        {nominee.points} pts
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-black uppercase font-orbitron text-red-500 bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/30">
                  AT RISK
                </span>
              </div>

              {/* Nomination Reason */}
              <div className="my-3 p-3 rounded-xl bg-red-950/40 border border-red-600/30 text-red-200 text-xs">
                <div className="text-[10px] font-bold uppercase font-orbitron text-red-400 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  GROUNDS FOR NOMINATION
                </div>
                <p className="leading-relaxed">
                  "{nominee.nominationReason || 'Nominated by Big Boss executive mandate.'}"
                </p>
              </div>

              {/* Immunity Status info */}
              <div className="flex items-center justify-between text-xs py-2 border-t border-red-900/40 mb-3 text-zinc-300">
                <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <ShieldAlert className="w-3.5 h-3.5 text-zinc-400" />
                  Immunity Shield:
                </span>
                <span className="font-bold text-red-400 uppercase text-[11px] font-orbitron">
                  UNSHIELDED (VULNERABLE)
                </span>
              </div>

              {/* Action buttons (Admin only) */}
              {currentUser.role === 'admin' ? (
                <div className="flex items-center gap-2 pt-1">
                  {/* Revoke Nomination button */}
                  <button
                    onClick={() => removeNomination(nominee.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Pardon / Revoke
                  </button>

                  {/* Evict from Danger Zone */}
                  <button
                    onClick={() => openModal('evict', { contestantId: nominee.id, contestantName: nominee.name })}
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors shadow-md"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    Evict
                  </button>
                </div>
              ) : (
                <div className="pt-2 text-center text-[11px] text-zinc-400 font-rajdhani">
                  Contestant under active eviction vote tally
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 px-4 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800 text-zinc-400 flex flex-col items-center justify-center">
          <Shield className="w-10 h-10 text-emerald-500 mb-2 opacity-80" />
          <h3 className="font-bold font-orbitron text-white text-sm">DANGER ZONE IS CLEAR</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm">
            No contestants are currently placed on the elimination chopping block.
          </p>
        </div>
      )}
    </div>
  );
};
