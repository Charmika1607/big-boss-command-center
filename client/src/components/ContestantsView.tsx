import React, { useState } from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import {
  Users,
  Search,
  Filter,
  Plus,
  Minus,
  AlertOctagon,
  ShieldAlert,
  ShieldCheck,
  Crown,
  UserX,
  UserPlus,
  Info
} from 'lucide-react';
import { Team, ContestantStatus } from '../types';

export const ContestantsView: React.FC = () => {
  const { contestants, openModal, grantImmunity, removeImmunity, assignCaptain } = useCommandCenter();
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredContestants = contestants.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesTeam = teamFilter === 'All' || c.team === teamFilter;
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Evicted'
        ? c.status === 'Evicted'
        : statusFilter === 'Nominated'
        ? c.isNominated && c.status !== 'Evicted'
        : statusFilter === 'Immune'
        ? c.isImmune && c.status !== 'Evicted'
        : statusFilter === 'Captain'
        ? c.isCaptain && c.status !== 'Evicted'
        : c.status !== 'Evicted';

    return matchesSearch && matchesTeam && matchesStatus;
  });

  const getTeamColor = (team: Team) => {
    switch (team) {
      case 'Red':
        return 'border-red-500/40 text-red-500 bg-red-500/10';
      case 'Blue':
        return 'border-blue-500/40 text-blue-500 bg-blue-500/10';
      case 'Gold':
        return 'border-amber-500/40 text-amber-500 bg-amber-500/10';
      case 'Green':
        return 'border-emerald-500/40 text-emerald-500 bg-emerald-500/10';
      default:
        return 'border-zinc-500/40 text-zinc-500 bg-zinc-500/10';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Controls bar */}
      <div className="bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-red-600 dark:text-red-500" />
              <h2 className="text-lg font-black tracking-wide uppercase font-orbitron text-zinc-900 dark:text-white">
                CONTESTANT ROSTER & SURVEILLANCE
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Active surveillance profiles, team allocations, point audits and disciplinary controls.
            </p>
          </div>

          <button
            onClick={() => openModal('add-contestant')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-orbitron uppercase bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 transition-all hover:scale-[1.02] shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            + Induct Contestant
          </button>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search contestants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>

          {/* Team Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 shrink-0">
              Team:
            </span>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              <option value="All">All Teams</option>
              <option value="Red">Red Team</option>
              <option value="Blue">Blue Team</option>
              <option value="Gold">Gold Team</option>
              <option value="Green">Green Team</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 shrink-0">
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Housemates</option>
              <option value="Nominated">Nominated / Danger Zone</option>
              <option value="Immune">Immune Shielded</option>
              <option value="Captain">Current Captain</option>
              <option value="Evicted">Evicted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contestant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContestants.map((c) => {
          const isEvicted = c.status === 'Evicted';

          return (
            <div
              key={c.id}
              className={`rounded-2xl border p-5 backdrop-blur-md transition-all duration-200 flex flex-col justify-between ${
                isEvicted
                  ? 'bg-zinc-100/60 dark:bg-zinc-950/40 border-zinc-300 dark:border-zinc-800/50 opacity-75'
                  : c.isNominated
                  ? 'bg-red-500/5 dark:bg-red-950/20 border-red-500/50 shadow-md shadow-red-500/5'
                  : c.isCaptain
                  ? 'bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-500/5'
                  : 'bg-white/80 dark:bg-zinc-900/70 border-zinc-200 dark:border-zinc-800/80 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {/* Header profile info */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className={`w-14 h-14 rounded-2xl object-cover ring-2 ${
                          isEvicted
                            ? 'ring-zinc-400 grayscale'
                            : c.isNominated
                            ? 'ring-red-500 animate-pulse'
                            : c.isCaptain
                            ? 'ring-amber-500'
                            : 'ring-zinc-300 dark:ring-zinc-700'
                        }`}
                      />
                      {c.isCaptain && (
                        <div className="absolute -top-1.5 -right-1 bg-amber-500 text-black p-1 rounded-lg shadow-md">
                          <Crown className="w-3.5 h-3.5 fill-black" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-zinc-900 dark:text-white leading-tight">
                        {c.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getTeamColor(c.team)}`}>
                          {c.team}
                        </span>
                        {isEvicted ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            EVICTED
                          </span>
                        ) : c.isNominated ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-600 text-white font-orbitron animate-pulse">
                            NOMINATED
                          </span>
                        ) : c.isImmune ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white font-orbitron">
                            IMMUNE
                          </span>
                        ) : c.isCaptain ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-black font-orbitron">
                            CAPTAIN
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            ACTIVE
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Points Box */}
                  <div className="text-right">
                    <div className="text-xl font-black font-orbitron text-zinc-900 dark:text-zinc-100">
                      {c.points}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-zinc-400 font-orbitron">
                      POINTS
                    </div>
                  </div>
                </div>

                {/* Bio or Nomination Reason */}
                {c.nominationReason && !isEvicted ? (
                  <div className="text-[11px] p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 mb-3">
                    <span className="font-bold">Nomination Reason:</span> {c.nominationReason}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2">
                    {c.bio || 'Housemate participating in Big Boss competition.'}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 space-y-2">
                {/* Points Modification Row */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={isEvicted}
                    onClick={() => openModal('adjust-points', { contestantId: c.id, direction: 'add' })}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Points
                  </button>
                  <button
                    disabled={isEvicted}
                    onClick={() => openModal('adjust-points', { contestantId: c.id, direction: 'deduct' })}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" /> - Points
                  </button>
                </div>

                {/* Status & Protocol Row */}
                <div className="grid grid-cols-4 gap-1.5">
                  {/* Nominate button */}
                  <button
                    disabled={isEvicted || c.isImmune}
                    onClick={() => openModal('nominate', { contestantId: c.id })}
                    title={
                      isEvicted
                        ? 'Cannot nominate an evicted contestant'
                        : c.isImmune
                        ? 'CRITICAL RULE: Cannot nominate immune contestant'
                        : 'Nominate for eviction'
                    }
                    className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border transition-colors flex flex-col items-center justify-center ${
                      c.isNominated
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-red-500 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed'
                    }`}
                  >
                    <AlertOctagon className="w-3 h-3 mb-0.5" />
                    <span>{c.isNominated ? 'Nominated' : 'Nominate'}</span>
                  </button>

                  {/* Immunity toggle */}
                  <button
                    disabled={isEvicted}
                    onClick={() => (c.isImmune ? removeImmunity(c.id) : grantImmunity(c.id))}
                    title={c.isImmune ? 'Revoke Immunity Shield' : 'Grant Immunity Shield'}
                    className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border transition-colors flex flex-col items-center justify-center ${
                      c.isImmune
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 hover:text-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed'
                    }`}
                  >
                    <ShieldAlert className="w-3 h-3 mb-0.5" />
                    <span>{c.isImmune ? 'Immune' : 'Shield'}</span>
                  </button>

                  {/* Captain button */}
                  <button
                    disabled={isEvicted}
                    onClick={() => assignCaptain(c.id)}
                    title={c.isCaptain ? 'Current House Captain' : 'Appoint as House Captain'}
                    className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border transition-colors flex flex-col items-center justify-center ${
                      c.isCaptain
                        ? 'bg-amber-500 text-black border-amber-400 font-extrabold'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-amber-500 hover:text-amber-500 disabled:opacity-40 disabled:cursor-not-allowed'
                    }`}
                  >
                    <Crown className="w-3 h-3 mb-0.5" />
                    <span>{c.isCaptain ? 'Captain' : 'Captain'}</span>
                  </button>

                  {/* Evict button */}
                  <button
                    disabled={isEvicted}
                    onClick={() => openModal('evict', { contestantId: c.id, contestantName: c.name })}
                    title={isEvicted ? 'Contestant already evicted' : 'Evict from Big Boss House'}
                    className="py-1.5 px-1 rounded-xl text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-red-600 dark:text-red-400 border border-zinc-200 dark:border-zinc-700 hover:bg-red-600 hover:text-white hover:border-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex flex-col items-center justify-center"
                  >
                    <UserX className="w-3 h-3 mb-0.5" />
                    <span>Evict</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredContestants.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-white/60 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-zinc-400">
          <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="font-semibold text-sm">No contestants matched your filter criteria.</p>
        </div>
      )}
    </div>
  );
};
