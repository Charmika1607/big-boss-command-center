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
  Info,
  CheckCircle2
} from 'lucide-react';
import { Team, ContestantStatus } from '../types';

export const ContestantsView: React.FC = () => {
  const {
    contestants,
    openModal,
    grantImmunity,
    removeImmunity,
    assignCaptain,
    currentUser
  } = useCommandCenter();

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

          {currentUser.role === 'admin' && (
            <button
              onClick={() => openModal('add-contestant')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-orbitron uppercase bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 transition-all hover:scale-[1.02] shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              + Induct Contestant
            </button>
          )}
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
            <Filter className="w-4 h-4 text-zinc-400" />
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              <option value="All">All Teams</option>
              <option value="Gold">Gold Team</option>
              <option value="Red">Red Team</option>
              <option value="Blue">Blue Team</option>
              <option value="Green">Green Team</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active In House</option>
              <option value="Captain">House Captain</option>
              <option value="Immune">Immune</option>
              <option value="Nominated">Nominated (Danger)</option>
              <option value="Evicted">Evicted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contestant Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredContestants.map((c) => {
          const isEvicted = c.status === 'Evicted';
          const isCurrentContestant = currentUser.role === 'contestant' && currentUser.contestantId === c.id;

          return (
            <div
              key={c.id}
              className={`rounded-2xl border p-4 backdrop-blur-md transition-all duration-200 flex flex-col justify-between ${
                isCurrentContestant
                  ? 'border-blue-500 bg-blue-500/5 ring-2 ring-blue-500/40 shadow-lg'
                  : isEvicted
                  ? 'opacity-60 bg-zinc-100 dark:bg-zinc-900/40 border-zinc-300 dark:border-zinc-800'
                  : c.isNominated
                  ? 'border-red-500/50 bg-red-500/5 shadow-sm'
                  : c.isImmune
                  ? 'border-emerald-500/50 bg-emerald-500/5 shadow-sm'
                  : c.isCaptain
                  ? 'border-amber-500/50 bg-amber-500/5 shadow-sm'
                  : 'bg-white/80 dark:bg-zinc-900/70 border-zinc-200 dark:border-zinc-800/80 shadow-sm'
              }`}
            >
              <div>
                {/* Header row: Status badges & Team */}
                <div className="flex items-center justify-between gap-1 mb-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTeamColor(
                      c.team
                    )}`}
                  >
                    {c.team} Team
                  </span>

                  <div className="flex items-center gap-1">
                    {isCurrentContestant && (
                      <span className="text-[9px] font-black uppercase font-orbitron px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                        YOU
                      </span>
                    )}

                    {c.isCaptain && (
                      <span className="text-[10px] font-extrabold uppercase font-orbitron px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 flex items-center gap-1">
                        <Crown className="w-3 h-3 fill-amber-500/30" /> CAPTAIN
                      </span>
                    )}

                    {c.isImmune && (
                      <span className="text-[10px] font-extrabold uppercase font-orbitron px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> IMMUNE
                      </span>
                    )}

                    {c.isNominated && (
                      <span className="text-[10px] font-extrabold uppercase font-orbitron px-2 py-0.5 rounded-full bg-red-600/20 text-red-600 dark:text-red-400 border border-red-500/40 flex items-center gap-1 animate-pulse">
                        <AlertOctagon className="w-3 h-3" /> DANGER
                      </span>
                    )}

                    {isEvicted && (
                      <span className="text-[10px] font-bold uppercase font-orbitron px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 border border-zinc-300 dark:border-zinc-700">
                        EVICTED
                      </span>
                    )}
                  </div>
                </div>

                {/* Avatar & Main Details */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="relative">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className={`w-14 h-14 rounded-2xl object-cover ring-2 shadow-md ${
                        isCurrentContestant
                          ? 'ring-blue-500'
                          : isEvicted
                          ? 'ring-zinc-400 grayscale'
                          : c.isCaptain
                          ? 'ring-amber-500'
                          : 'ring-zinc-300 dark:ring-zinc-700'
                      }`}
                    />
                    {isEvicted && (
                      <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                        <UserX className="w-6 h-6 text-red-500" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                      {c.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-base font-black font-orbitron text-zinc-900 dark:text-white">
                        {c.points} <span className="text-xs font-normal text-zinc-400">pts</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio text */}
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
                  {c.bio || 'Housemate participating in Big Boss competition.'}
                </p>

                {/* Nomination reason if nominated */}
                {c.isNominated && c.nominationReason && (
                  <div className="mb-3 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[11px]">
                    <span className="font-bold font-orbitron">RISK REASON: </span>
                    {c.nominationReason}
                  </div>
                )}
              </div>

              {/* Action Buttons Row (Admin only) */}
              {currentUser.role === 'admin' && (
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 space-y-2">
                  {/* Points modification row */}
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
              )}
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
