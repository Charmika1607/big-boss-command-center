import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { QuickActionsBar } from './QuickActionsBar';
import { StatCards } from './StatCards';
import { DangerZone } from './DangerZone';
import { Leaderboard } from './Leaderboard';
import {
  Video,
  Radio,
  Clock,
  Coins,
  CheckSquare,
  AlertTriangle,
  Flame,
  ArrowRight
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    pointLogs,
    tasks,
    setActiveTab,
    nominees,
    activeContestants,
    currentCaptain
  } = useCommandCenter();

  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');

  return (
    <div className="w-full space-y-6">
      {/* 1. Quick Actions Bar */}
      <QuickActionsBar />

      {/* 2. House Live Statistics */}
      <StatCards />

      {/* 3. Live Surveillance Camera + Point Activity Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Surveillance CCTV Feed Simulation */}
        <div className="lg:col-span-2 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/80 p-5 backdrop-blur-xl shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <span className="font-orbitron font-bold text-xs uppercase tracking-wider text-red-600 dark:text-red-500">
                CAM-01 • MAIN LIVING COMPOUND
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-orbitron text-zinc-400">
              <span>FPS: 60.0</span>
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-red-500 font-bold">
                REC ●
              </span>
            </div>
          </div>

          {/* Surveillance Screen Mock */}
          <div className="w-full h-56 sm:h-64 rounded-2xl bg-zinc-950 border border-zinc-800 relative overflow-hidden flex items-center justify-center scanline">
            {/* Background simulated house image */}
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80"
              alt="House Living Area"
              className="absolute inset-0 w-full h-full object-cover opacity-35 filter contrast-125 saturate-50"
            />

            {/* Futuristic HUD overlays */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
              <div className="flex justify-between items-start text-[10px] font-orbitron text-cyan-400/90 tracking-widest">
                <div>BIG BOSS SURVEILLANCE MATRIX</div>
                <div>GRID: 44.18°N 78.22°E</div>
              </div>

              {/* Target tracking box simulation */}
              <div className="self-center border border-red-500/60 rounded-xl px-4 py-2 bg-black/40 backdrop-blur-xs text-center">
                <div className="text-[10px] font-bold font-orbitron text-red-400 uppercase tracking-wider">
                  ACTIVE HOUSEMATES IN AREA
                </div>
                <div className="text-xs font-bold text-white mt-0.5">
                  {activeContestants.length} Competitors Present
                </div>
              </div>

              <div className="flex justify-between items-end text-[10px] font-orbitron text-cyan-400/90 tracking-widest">
                <div>AUDIO: ENCRYPTED SPECTRUM</div>
                <div>STATUS: SECURED</div>
              </div>
            </div>
          </div>

          {/* Camera Selector Footbar */}
          <div className="flex items-center justify-between gap-2 mt-3 pt-2 text-xs text-zinc-500 font-rajdhani">
            <span className="flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-red-500" />
              16 Compound Micro-Sensors Streaming
            </span>
            <span className="text-emerald-500 font-bold">Latency: 12ms (Optimal)</span>
          </div>
        </div>

        {/* Real-time Point Activity Log Panel (Mandatory Section 8) */}
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/70 p-5 backdrop-blur-xl shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500" />
                <h3 className="font-orbitron font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white">
                  POINT AUDIT ACTIVITY
                </h3>
              </div>
              <span className="text-[10px] text-zinc-400 font-orbitron">
                AUDIT LOG
              </span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {pointLogs.slice(0, 7).map((log) => {
                const isPositive = log.amount > 0;
                return (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800/80 flex items-start justify-between gap-2.5"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                        {log.contestantName}
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate">
                        {log.reason}
                      </div>
                    </div>

                    <span
                      className={`text-xs font-black font-orbitron px-2 py-0.5 rounded-lg shrink-0 ${
                        isPositive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30'
                      }`}
                    >
                      {isPositive ? `+${log.amount}` : log.amount}
                    </span>
                  </div>
                );
              })}

              {pointLogs.length === 0 && (
                <div className="py-8 text-center text-zinc-400 text-xs">
                  No point transactions logged yet.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 mt-2 text-right">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 justify-end ml-auto"
            >
              Full Leaderboard Breakdown <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Danger Zone Section (Mandatory Feature #8) */}
      <DangerZone />

      {/* 5. Live Leaderboard (Mandatory Feature #2) */}
      <Leaderboard />
    </div>
  );
};
