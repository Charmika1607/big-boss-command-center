import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import {
  LayoutDashboard,
  Users,
  Trophy,
  CheckSquare,
  AlertOctagon,
  ShieldAlert,
  Crown,
  Timer,
  Megaphone,
  UserX,
  X,
  Activity,
  BarChart3,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    nominees,
    tasks,
    activeContestants,
    evictedContestants,
    activities,
    currentUser
  } = useCommandCenter();

  const pendingTasksCount = tasks.filter(t => t.status !== 'Completed').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Command Hub',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'contestants',
      label: 'Contestants',
      icon: Users,
      badge: activeContestants.length > 0 ? `${activeContestants.length}` : null,
      badgeColor: 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
    },
    {
      id: 'leaderboard',
      label: 'Live Leaderboard',
      icon: Trophy,
      badge: 'LIVE',
      badgeColor: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
    },
    {
      id: 'activity',
      label: 'Activity Log',
      icon: Activity,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
    },
    {
      id: 'analytics',
      label: 'Analytics Hub',
      icon: BarChart3,
      badge: 'METRICS',
      badgeColor: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
    },
    {
      id: 'tasks',
      label: 'Tasks & Challenges',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : null,
      badgeColor: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
    },
    {
      id: 'dangerzone',
      label: 'Danger Zone',
      icon: AlertOctagon,
      badge: nominees.length > 0 ? `${nominees.length} AT RISK` : 'CLEAR',
      badgeColor: nominees.length > 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-500'
    },
    {
      id: 'immunity',
      label: 'Immunity Vault',
      icon: ShieldAlert,
      badge: null
    },
    {
      id: 'captain',
      label: "Captain's Quarters",
      icon: Crown,
      badge: null
    },
    {
      id: 'timer',
      label: 'Task Timer',
      icon: Timer,
      badge: null
    },
    {
      id: 'announcements',
      label: 'Transmissions',
      icon: Megaphone,
      badge: null
    },
    {
      id: 'evictions',
      label: 'Eviction Log',
      icon: UserX,
      badge: evictedContestants.length > 0 ? `${evictedContestants.length}` : null,
      badgeColor: 'bg-red-500/20 text-red-500 border border-red-500/30'
    }
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 md:top-18 z-40 md:z-20 h-screen md:h-[calc(100vh-4.5rem)] w-68 shrink-0 flex flex-col justify-between border-r transition-all duration-300 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800/80 ${
          mobileOpen ? 'left-0' : '-left-72 md:left-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-6">
          {/* Mobile close button header */}
          <div className="flex items-center justify-between md:hidden pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <span className="font-orbitron font-bold text-sm tracking-wider uppercase text-zinc-900 dark:text-white">
              NAVIGATION
            </span>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section title */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest font-orbitron text-zinc-400 dark:text-zinc-500 mb-2 px-3">
              CONTROL MODULES
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isDanger = item.id === 'dangerzone' && nominees.length > 0;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 ${
                      isActive
                        ? isDanger
                          ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/30 ring-1 ring-red-400'
                          : 'bg-red-600 dark:bg-red-600 text-white font-bold shadow-md shadow-red-600/20'
                        : isDanger
                        ? 'text-red-600 dark:text-red-400 hover:bg-red-500/10'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive ? 'scale-110' : ''
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 font-orbitron ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeColor || 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Operator Role & Surveillance Status Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] font-black uppercase font-orbitron text-zinc-700 dark:text-zinc-300">
                ACTIVE OPERATOR
              </span>
            </div>
            <span className={`text-[9px] font-black uppercase font-orbitron px-1.5 py-0.5 rounded ${
              currentUser.role === 'admin'
                ? 'bg-red-600/15 text-red-600 dark:text-red-400 border border-red-500/30'
                : currentUser.role === 'contestant'
                ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                : 'bg-purple-600/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
            }`}>
              {currentUser.role.toUpperCase()}
            </span>
          </div>
          <div className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 truncate">
            {currentUser.name}
          </div>
        </div>
      </aside>
    </>
  );
};
