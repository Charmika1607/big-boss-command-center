import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import {
  Users,
  UserCheck,
  UserX,
  Trophy,
  CheckCircle2,
  Clock,
  AlertOctagon,
  ShieldAlert,
  Crown
} from 'lucide-react';

export const StatCards: React.FC = () => {
  const { statistics, loading } = useCommandCenter();

  if (loading || !statistics) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-zinc-200 dark:bg-zinc-800/50" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      id: 'active',
      title: 'Active Contestants',
      value: `${statistics.activeContestants} / ${statistics.totalContestants}`,
      subtitle: `${statistics.evictedContestants} Evicted`,
      icon: UserCheck,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 'leader',
      title: 'Highest Scorer',
      value: statistics.highestScorer ? `${statistics.highestScorer.points} pts` : '0 pts',
      subtitle: statistics.highestScorer ? statistics.highestScorer.name : 'None',
      icon: Trophy,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      id: 'captain',
      title: 'House Captain',
      value: statistics.currentCaptain ? statistics.currentCaptain.name : 'Vacant',
      subtitle: statistics.currentCaptain ? `${statistics.currentCaptain.team} Team` : 'No Captain',
      icon: Crown,
      color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
    },
    {
      id: 'danger',
      title: 'Danger Zone',
      value: `${statistics.nomineesCount} Nominees`,
      subtitle: statistics.nomineesCount > 0 ? 'Facing Eviction' : 'All Safe',
      icon: AlertOctagon,
      color: statistics.nomineesCount > 0
        ? 'text-red-500 bg-red-500/10 border-red-500/30 ring-1 ring-red-500/30'
        : 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20'
    },
    {
      id: 'tasks',
      title: 'House Tasks',
      value: `${statistics.completedTasks} Done`,
      subtitle: `${statistics.pendingTasks + statistics.inProgressTasks} In Progress`,
      icon: CheckCircle2,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    },
    {
      id: 'immune',
      title: 'Immune Contestants',
      value: `${statistics.immuneCount} Shielded`,
      subtitle: 'Safe from Nominations',
      icon: ShieldAlert,
      color: 'text-teal-500 bg-teal-500/10 border-teal-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="flex flex-col justify-between p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md shadow-sm transition-all duration-200 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-orbitron truncate">
                {item.title}
              </span>
              <div className={`p-1.5 rounded-xl border ${item.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="text-lg font-black tracking-tight font-orbitron text-zinc-900 dark:text-zinc-100 truncate">
                {item.value}
              </div>
              <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                {item.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
