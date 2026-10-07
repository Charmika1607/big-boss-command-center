import React, { useState } from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  Coins,
  CheckSquare,
  AlertOctagon,
  ShieldAlert,
  Crown,
  Megaphone,
  UserX,
  UserPlus,
  Clock,
  Sparkles,
  Radio,
  SlidersHorizontal
} from 'lucide-react';
import { ActivityLog } from '../types';

export const ActivityLogView: React.FC = () => {
  const { activities, activitiesLoading, refreshActivities, setActiveTab } = useCommandCenter();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      !searchTerm.trim() ||
      (act.actor && act.actor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (act.description && act.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (act.action && act.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (act.target && act.target.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole =
      roleFilter === 'All' ||
      (act.role && act.role.toLowerCase() === roleFilter.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' ||
      (act.action && act.action.toLowerCase().includes(categoryFilter.toLowerCase()));

    return matchesSearch && matchesRole && matchesCategory;
  });

  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('POINT') || act.includes('BONUS')) {
      return {
        icon: Coins,
        color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
        label: act.replace(/_/g, ' ')
      };
    }
    if (act.includes('TASK')) {
      return {
        icon: CheckSquare,
        color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
        label: act.replace(/_/g, ' ')
      };
    }
    if (act.includes('NOMINATION')) {
      return {
        icon: AlertOctagon,
        color: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 animate-pulse',
        label: act.replace(/_/g, ' ')
      };
    }
    if (act.includes('IMMUNITY')) {
      return {
        icon: ShieldAlert,
        color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        label: act.replace(/_/g, ' ')
      };
    }
    if (act.includes('CAPTAIN')) {
      return {
        icon: Crown,
        color: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
        label: act.replace(/_/g, ' ')
      };
    }
    if (act.includes('EVICT')) {
      return {
        icon: UserX,
        color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
        label: act.replace(/_/g, ' ')
      };
    }
    if (act.includes('ANNOUNCEMENT')) {
      return {
        icon: Megaphone,
        color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
        label: act.replace(/_/g, ' ')
      };
    }
    if (act.includes('CONTESTANT')) {
      return {
        icon: UserPlus,
        color: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
        label: act.replace(/_/g, ' ')
      };
    }
    return {
      icon: Activity,
      color: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/30',
      label: act.replace(/_/g, ' ')
    };
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-600/15 text-red-600 dark:text-red-400 border-red-500/30';
      case 'contestant':
        return 'bg-blue-600/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'viewer':
        return 'bg-purple-600/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
      default:
        return 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/30';
    }
  };

  const formatTimestamp = (ts: string) => {
    try {
      const date = new Date(ts);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return ts;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header Card */}
      <div className="bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-5 backdrop-blur-md shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-red-600 to-rose-950 text-white shadow-lg shadow-red-600/20 border border-red-500/40">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-black tracking-wide uppercase font-orbitron text-zinc-900 dark:text-white">
                  REAL-TIME ACTIVITY AUDIT LOG
                </h2>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider font-orbitron">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  FEED LIVE
                </div>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Surveillance stream capturing all executive decrees, contestant actions, point audits, nominations and house events.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refreshActivities()}
              disabled={activitiesLoading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${activitiesLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Feed</span>
            </button>
            <span className="px-3 py-2 rounded-xl text-xs font-bold font-orbitron bg-red-600/10 text-red-600 dark:text-red-400 border border-red-500/20">
              {activities.length} EVENTS RECORDED
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by actor, action, description or target..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>

          {/* Role Filter */}
          <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['All', 'Admin', 'Contestant'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold font-orbitron uppercase transition-all shrink-0 ${
                  roleFilter === role
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {role === 'Admin' ? 'Big Boss' : role}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              <option value="All">All Categories</option>
              <option value="POINT">Points & Demerits</option>
              <option value="TASK">Challenges & Tasks</option>
              <option value="NOMINATION">Danger Zone / Nominations</option>
              <option value="IMMUNITY">Immunity Vault</option>
              <option value="CAPTAIN">Captaincy</option>
              <option value="EVICT">Evictions</option>
              <option value="ANNOUNCEMENT">Announcements</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activities Timeline Feed */}
      <div className="space-y-3">
        {filteredActivities.map((act) => {
          const badge = getActionBadge(act.action);
          const ActionIcon = badge.icon;

          return (
            <div
              key={act.id}
              className="bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 backdrop-blur-md shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3.5">
                {/* Action Icon Box */}
                <div className={`p-2.5 rounded-xl border shrink-0 ${badge.color}`}>
                  <ActionIcon className="w-4 h-4" />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Actor */}
                    <span className="font-bold text-xs text-zinc-900 dark:text-white">
                      {act.actor}
                    </span>

                    {/* Role Badge */}
                    <span className={`text-[9px] font-black uppercase font-orbitron px-2 py-0.5 rounded-md border ${getRoleBadge(act.role)}`}>
                      {act.role === 'admin' ? 'BIG BOSS' : act.role}
                    </span>

                    {/* Action Type Badge */}
                    <span className={`text-[9px] font-bold uppercase font-orbitron px-2 py-0.5 rounded-md border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>

              {/* Target & Timestamp info */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                {act.target && (
                  <span className="text-[10px] font-medium font-rajdhani text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    Target: <strong className="text-zinc-700 dark:text-zinc-200">{act.target}</strong>
                  </span>
                )}
                <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-rajdhani">
                  <Clock className="w-3 h-3 text-red-500" />
                  <span>{formatTimestamp(act.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredActivities.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-white/60 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-zinc-400">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-40 text-red-500" />
            <p className="font-semibold text-sm">No activity records found matching filters.</p>
            <p className="text-xs text-zinc-500 mt-1">Actions performed across the house will appear here in real time.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('All');
                setCategoryFilter('All');
              }}
              className="mt-4 px-4 py-1.5 rounded-xl text-xs font-bold font-orbitron bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
