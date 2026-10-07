import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import {
  UserPlus,
  PlusCircle,
  Coins,
  AlertOctagon,
  ShieldAlert,
  Crown,
  Megaphone,
  Timer,
  UserX,
  CheckSquare,
  Trophy,
  Activity,
  BarChart3,
  Eye
} from 'lucide-react';

export const QuickActionsBar: React.FC = () => {
  const { openModal, setActiveTab, currentUser } = useCommandCenter();

  // Admin Actions
  const adminActions = [
    {
      id: 'add-contestant',
      label: '+ Contestant',
      icon: UserPlus,
      color: 'hover:border-cyan-500 hover:text-cyan-500 dark:hover:text-cyan-400',
      onClick: () => openModal('add-contestant')
    },
    {
      id: 'create-task',
      label: '+ Create Task',
      icon: PlusCircle,
      color: 'hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400',
      onClick: () => openModal('create-task')
    },
    {
      id: 'award-points',
      label: '+/- Points',
      icon: Coins,
      color: 'hover:border-amber-500 hover:text-amber-500 dark:hover:text-amber-400',
      onClick: () => openModal('adjust-points')
    },
    {
      id: 'nominate',
      label: '⚠ Nominate',
      icon: AlertOctagon,
      color: 'hover:border-red-500 hover:text-red-500 dark:hover:text-red-400',
      onClick: () => openModal('nominate')
    },
    {
      id: 'immunity',
      label: '🛡 Immunity',
      icon: ShieldAlert,
      color: 'hover:border-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400',
      onClick: () => openModal('immunity')
    },
    {
      id: 'captain',
      label: '👑 Captain',
      icon: Crown,
      color: 'hover:border-amber-500 hover:text-amber-500 dark:hover:text-amber-400',
      onClick: () => openModal('captain')
    },
    {
      id: 'announcement',
      label: '📢 Broadcast',
      icon: Megaphone,
      color: 'hover:border-purple-500 hover:text-purple-500 dark:hover:text-purple-400',
      onClick: () => openModal('announcement')
    },
    {
      id: 'timer',
      label: '⏱ Timer',
      icon: Timer,
      color: 'hover:border-yellow-500 hover:text-yellow-500 dark:hover:text-yellow-400',
      onClick: () => setActiveTab('timer')
    },
    {
      id: 'evict',
      label: '🚪 Evict',
      icon: UserX,
      color: 'hover:border-rose-600 hover:text-rose-600 dark:hover:text-rose-500',
      onClick: () => openModal('evict')
    }
  ];

  // Contestant Actions
  const contestantActions = [
    {
      id: 'my-tasks',
      label: 'Assigned Tasks',
      icon: CheckSquare,
      color: 'hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400',
      onClick: () => setActiveTab('tasks')
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: Trophy,
      color: 'hover:border-amber-500 hover:text-amber-500 dark:hover:text-amber-400',
      onClick: () => setActiveTab('leaderboard')
    },
    {
      id: 'my-analytics',
      label: 'My Analytics',
      icon: BarChart3,
      color: 'hover:border-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400',
      onClick: () => setActiveTab('analytics')
    },
    {
      id: 'activity-feed',
      label: 'House Feed',
      icon: Activity,
      color: 'hover:border-cyan-500 hover:text-cyan-500 dark:hover:text-cyan-400',
      onClick: () => setActiveTab('activity')
    },
    {
      id: 'transmissions',
      label: 'Transmissions',
      icon: Megaphone,
      color: 'hover:border-purple-500 hover:text-purple-500 dark:hover:text-purple-400',
      onClick: () => setActiveTab('announcements')
    },
    {
      id: 'timer',
      label: 'Task Timer',
      icon: Timer,
      color: 'hover:border-yellow-500 hover:text-yellow-500 dark:hover:text-yellow-400',
      onClick: () => setActiveTab('timer')
    }
  ];

  // Viewer Actions
  const viewerActions = [
    {
      id: 'live-leaderboard',
      label: 'Leaderboard',
      icon: Trophy,
      color: 'hover:border-amber-500 hover:text-amber-500 dark:hover:text-amber-400',
      onClick: () => setActiveTab('leaderboard')
    },
    {
      id: 'house-feed',
      label: 'Surveillance Feed',
      icon: Activity,
      color: 'hover:border-cyan-500 hover:text-cyan-500 dark:hover:text-cyan-400',
      onClick: () => setActiveTab('activity')
    },
    {
      id: 'analytics-hub',
      label: 'Public Analytics',
      icon: BarChart3,
      color: 'hover:border-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400',
      onClick: () => setActiveTab('analytics')
    },
    {
      id: 'danger-zone',
      label: 'Danger Zone',
      icon: AlertOctagon,
      color: 'hover:border-red-500 hover:text-red-500 dark:hover:text-red-400',
      onClick: () => setActiveTab('dangerzone')
    },
    {
      id: 'transmissions',
      label: 'Broadcasts',
      icon: Megaphone,
      color: 'hover:border-purple-500 hover:text-purple-500 dark:hover:text-purple-400',
      onClick: () => setActiveTab('announcements')
    }
  ];

  const actions =
    currentUser.role === 'admin'
      ? adminActions
      : currentUser.role === 'contestant'
      ? contestantActions
      : viewerActions;

  return (
    <div className="w-full bg-white/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-3.5 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] font-black uppercase font-orbitron tracking-widest text-zinc-400 dark:text-zinc-500">
          {currentUser.role === 'admin'
            ? 'EXECUTIVE COMMAND TRIGGERS'
            : currentUser.role === 'contestant'
            ? 'CONTESTANT QUICK ACCESS'
            : 'SPECTATOR NAVIGATION'}
        </span>
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
          {currentUser.role === 'admin'
            ? 'Big Boss Authority Controls'
            : currentUser.role === 'contestant'
            ? 'Housemate Portal Actions'
            : 'Read-Only Viewer Stream'}
        </span>
      </div>

      <div className={`grid gap-2 ${
        currentUser.role === 'admin'
          ? 'grid-cols-3 sm:grid-cols-5 md:grid-cols-9'
          : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6'
      }`}>
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.onClick}
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/60 text-zinc-700 dark:text-zinc-300 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${act.color} text-center group`}
            >
              <Icon className="w-4 h-4 mb-1.5 transition-transform group-hover:scale-110" />
              <span className="text-[11px] font-semibold tracking-tight truncate max-w-full">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
