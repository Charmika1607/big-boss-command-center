import React from 'react';
import { motion } from 'framer-motion';
import { useCommandCenter } from '../context/CommandCenterContext';
import {
  Trophy,
  Crown,
  Shield,
  AlertTriangle,
  Plus,
  Minus,
  Sparkles
} from 'lucide-react';
import { Contestant } from '../types';

export const Leaderboard: React.FC = () => {
  const { activeContestants, openModal, pointLogs } = useCommandCenter();

  // Sort active contestants descending by points
  const sortedContestants = [...activeContestants].sort((a, b) => b.points - a.points);

  const getTeamBadge = (team: string) => {
    switch (team) {
      case 'Red':
        return 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30';
      case 'Blue':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'Gold':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Green':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-zinc-500/15 text-zinc-600 border-zinc-500/30';
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 text-black font-black text-sm shadow-lg shadow-amber-500/40 border border-yellow-200">
          🥇
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-slate-200 via-slate-400 to-zinc-500 text-black font-black text-sm shadow-md border border-slate-300">
          🥈
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-amber-700 via-yellow-800 to-amber-900 text-amber-100 font-black text-sm shadow-md border border-amber-600/50">
          🥉
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold text-xs font-orbitron border border-zinc-200 dark:border-zinc-700/60">
        #{rank}
      </div>
    );
  };

  // Find recent point change for each contestant
  const getRecentChange = (id: string) => {
    const recent = pointLogs.find(l => l.contestantId === id);
    if (!recent) return null;
    return recent.amount > 0 ? `+${recent.amount}` : `${recent.amount}`;
  };

  return (
    <div className="w-full bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-wide uppercase font-orbitron text-zinc-900 dark:text-white">
                LIVE HOUSE LEADERBOARD
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold font-orbitron border border-emerald-500/30">
                ACTIVE STANDINGS
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Rankings dynamically recalculate as points are awarded or deducted.
            </p>
          </div>
        </div>

        <button
          onClick={() => openModal('adjust-points')}
          className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-orbitron uppercase bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Audit Points
        </button>
      </div>

      {/* Podium Top 3 Cards for Desktop */}
      {sortedContestants.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
          {/* Rank 2 */}
          <div className="order-2 md:order-1 p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 relative flex flex-col items-center text-center">
            <span className="text-2xl mb-1">🥈</span>
            <span className="text-[10px] font-black uppercase tracking-wider font-orbitron text-slate-500">
              RANK 2 • SILVER
            </span>
            <img
              src={sortedContestants[1].avatar}
              alt={sortedContestants[1].name}
              className="w-16 h-16 rounded-full object-cover my-2 ring-2 ring-slate-400/50 shadow-md"
            />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white truncate max-w-full">
              {sortedContestants[1].name}
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${getTeamBadge(sortedContestants[1].team)}`}>
              {sortedContestants[1].team} Team
            </span>
            <div className="mt-2 text-xl font-black font-orbitron text-zinc-900 dark:text-white">
              {sortedContestants[1].points} <span className="text-xs text-zinc-400 font-sans">pts</span>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="order-1 md:order-2 p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/40 relative flex flex-col items-center text-center shadow-lg shadow-amber-500/10">
            <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-[10px] font-orbitron uppercase tracking-widest shadow">
              👑 HOUSE LEADER
            </div>
            <span className="text-3xl mb-1 mt-1">🥇</span>
            <img
              src={sortedContestants[0].avatar}
              alt={sortedContestants[0].name}
              className="w-20 h-20 rounded-full object-cover my-2 ring-4 ring-amber-400/80 shadow-xl"
            />
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-white truncate max-w-full">
              {sortedContestants[0].name}
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${getTeamBadge(sortedContestants[0].team)}`}>
              {sortedContestants[0].team} Team
            </span>
            <div className="mt-2 text-2xl font-black font-orbitron text-amber-500 dark:text-amber-400">
              {sortedContestants[0].points} <span className="text-sm font-sans text-zinc-400">pts</span>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="order-3 md:order-3 p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 relative flex flex-col items-center text-center">
            <span className="text-2xl mb-1">🥉</span>
            <span className="text-[10px] font-black uppercase tracking-wider font-orbitron text-amber-700 dark:text-amber-600">
              RANK 3 • BRONZE
            </span>
            <img
              src={sortedContestants[2].avatar}
              alt={sortedContestants[2].name}
              className="w-16 h-16 rounded-full object-cover my-2 ring-2 ring-amber-700/50 shadow-md"
            />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white truncate max-w-full">
              {sortedContestants[2].name}
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${getTeamBadge(sortedContestants[2].team)}`}>
              {sortedContestants[2].team} Team
            </span>
            <div className="mt-2 text-xl font-black font-orbitron text-zinc-900 dark:text-white">
              {sortedContestants[2].points} <span className="text-xs text-zinc-400 font-sans">pts</span>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table / Rows */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-wider font-orbitron text-zinc-400 dark:text-zinc-500">
              <th className="py-3 px-3">Rank</th>
              <th className="py-3 px-3">Contestant</th>
              <th className="py-3 px-3">Team</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Points</th>
              <th className="py-3 px-3 text-right">Quick Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {sortedContestants.map((c, index) => {
              const rank = index + 1;
              const recentDelta = getRecentChange(c.id);

              return (
                <motion.tr
                  key={c.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors ${
                    rank === 1
                      ? 'bg-amber-500/5 font-semibold'
                      : rank === 2
                      ? 'bg-slate-500/5'
                      : rank === 3
                      ? 'bg-amber-800/5'
                      : ''
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {getRankBadge(rank)}
                  </td>

                  {/* Contestant */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-300 dark:ring-zinc-700 shadow-sm"
                        />
                        {c.isCaptain && (
                          <div className="absolute -top-1.5 -right-1 bg-amber-500 text-black p-0.5 rounded-full shadow" title="House Captain">
                            <Crown className="w-3 h-3 fill-black" />
                          </div>
                        )}
                        {c.isImmune && (
                          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full shadow" title="Immune">
                            <Shield className="w-3 h-3 fill-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                          {c.name}
                          {c.isCaptain && (
                            <span className="text-[10px] font-black font-orbitron text-amber-500">
                              (CAPTAIN)
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 dark:text-zinc-500 max-w-xs truncate">
                          {c.bio || 'Active Competitor'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Team */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getTeamBadge(
                        c.team
                      )}`}
                    >
                      {c.team}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {c.isNominated ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-600/15 text-red-600 dark:text-red-400 border border-red-500/30">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        NOMINATED
                      </span>
                    ) : c.isImmune ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        <Shield className="w-3 h-3 text-emerald-500" />
                        IMMUNE
                      </span>
                    ) : c.isCaptain ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        <Crown className="w-3 h-3 text-amber-500" />
                        CAPTAIN
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                        ACTIVE
                      </span>
                    )}
                  </td>

                  {/* Points */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-base font-black font-orbitron text-zinc-900 dark:text-zinc-100">
                        {c.points} <span className="text-xs text-zinc-400 font-sans">pts</span>
                      </span>
                      {recentDelta && (
                        <span
                          className={`text-[10px] font-bold font-orbitron ${
                            recentDelta.startsWith('+') ? 'text-emerald-500' : 'text-red-500'
                          }`}
                        >
                          {recentDelta} recent
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Action +/- */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openModal('adjust-points', { contestantId: c.id, direction: 'add' })}
                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                        title="Award Points"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openModal('adjust-points', { contestantId: c.id, direction: 'deduct' })}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                        title="Deduct Points"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
