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
  UserX
} from 'lucide-react';

export const QuickActionsBar: React.FC = () => {
  const { openModal, setActiveTab } = useCommandCenter();

  const actions = [
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

  return (
    <div className="w-full bg-white/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-3.5 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] font-black uppercase font-orbitron tracking-widest text-zinc-400 dark:text-zinc-500">
          QUICK PROTOCOL CONTROLS
        </span>
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
          Instant Command Triggers
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
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
