import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import {
  UserX,
  DoorOpen,
  Calendar,
  Clock,
  Trophy,
  AlertOctagon,
  ShieldAlert
} from 'lucide-react';

export const EvictionSection: React.FC = () => {
  const { evictions, openModal } = useCommandCenter();

  return (
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/10 text-red-600 border border-red-600/30">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide uppercase font-orbitron text-zinc-900 dark:text-white">
                HOUSE EVICTION REGISTRY & ARCHIVE
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Official elimination archives. Evicted housemates are permanently barred from the active leaderboard and nominations.
              </p>
            </div>
          </div>

          <button
            onClick={() => openModal('evict')}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-orbitron uppercase bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 transition-all hover:scale-[1.02] shrink-0"
          >
            <DoorOpen className="w-4 h-4" />
            Execute Eviction Protocol
          </button>
        </div>
      </div>

      {/* Evicted Contestants Cards / Table */}
      {evictions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {evictions.map((record) => (
            <div
              key={record.id}
              className="rounded-2xl border border-zinc-300 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 p-5 backdrop-blur-md shadow-sm relative overflow-hidden flex flex-col justify-between"
            >
              {/* Red line top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />

              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                      {record.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {record.team} Team
                      </span>
                      <span className="text-[10px] font-black uppercase font-orbitron text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                        EVICTED
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black font-orbitron text-zinc-700 dark:text-zinc-300">
                      {record.finalPoints}
                    </div>
                    <div className="text-[9px] uppercase font-bold text-zinc-400 font-orbitron">
                      FINAL POINTS
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-xs text-zinc-600 dark:text-zinc-400 mb-3 border border-zinc-200 dark:border-zinc-800">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    Eviction Grounds:
                  </span>{' '}
                  {record.reason || 'Eliminated by Big Boss decree.'}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between font-rajdhani">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                  {new Date(record.evictedAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}{' '}
                  at {new Date(record.evictedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="font-bold text-zinc-500">Departed House</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl bg-white/60 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-zinc-400 flex flex-col items-center justify-center">
          <DoorOpen className="w-12 h-12 text-zinc-400 mb-3 opacity-60" />
          <h3 className="font-orbitron font-bold text-base text-zinc-200">
            NO CONTESTANTS EVICTED YET
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm">
            All original housemates remain active inside the Big Boss House compound.
          </p>
        </div>
      )}
    </div>
  );
};
