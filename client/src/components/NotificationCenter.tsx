import React, { useState } from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import {
  Bell,
  CheckCheck,
  CheckSquare,
  AlertTriangle,
  Shield,
  Crown,
  Coins,
  Megaphone,
  UserX,
  X,
  Clock,
  ArrowRight
} from 'lucide-react';
import { HouseNotification } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    setActiveTab,
    currentUser
  } = useCommandCenter();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'mine'>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'mine') {
      if (currentUser.role === 'contestant') {
        return n.recipient === currentUser.contestantId;
      }
      return n.recipient !== 'all';
    }
    return true;
  });

  const getNotificationIcon = (type: HouseNotification['type']) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="w-4 h-4 text-blue-400" />;
      case 'nomination':
        return <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />;
      case 'immunity':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      case 'captain':
        return <Crown className="w-4 h-4 text-amber-400" />;
      case 'points':
        return <Coins className="w-4 h-4 text-yellow-400" />;
      case 'eviction':
        return <UserX className="w-4 h-4 text-rose-500" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getNotificationColor = (type: HouseNotification['type']) => {
    switch (type) {
      case 'task':
        return 'border-blue-500/30 bg-blue-500/5';
      case 'nomination':
        return 'border-red-500/40 bg-red-500/10 shadow-sm shadow-red-500/10';
      case 'immunity':
        return 'border-emerald-500/30 bg-emerald-500/5';
      case 'captain':
        return 'border-amber-500/30 bg-amber-500/5';
      case 'points':
        return 'border-yellow-500/30 bg-yellow-500/5';
      case 'eviction':
        return 'border-rose-500/40 bg-rose-500/10';
      case 'announcement':
        return 'border-purple-500/30 bg-purple-500/5';
      default:
        return 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50';
    }
  };

  const formatTimestamp = (ts: string) => {
    try {
      const date = new Date(ts);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return ts;
    }
  };

  const handleNotificationClick = (n: HouseNotification) => {
    // Mark as read
    if (!n.read) {
      markNotificationRead(n.id);
    }

    // Navigate to related module if applicable
    if (n.relatedEntity?.type) {
      switch (n.relatedEntity.type) {
        case 'task':
          setActiveTab('tasks');
          break;
        case 'dangerzone':
          setActiveTab('dangerzone');
          break;
        case 'immunity':
          setActiveTab('immunity');
          break;
        case 'captain':
          setActiveTab('captain');
          break;
        case 'leaderboard':
          setActiveTab('leaderboard');
          break;
        case 'announcements':
          setActiveTab('announcements');
          break;
        case 'evictions':
          setActiveTab('evictions');
          break;
        case 'contestant':
          setActiveTab('contestants');
          break;
        default:
          break;
      }
    } else {
      switch (n.type) {
        case 'task':
          setActiveTab('tasks');
          break;
        case 'nomination':
          setActiveTab('dangerzone');
          break;
        case 'immunity':
          setActiveTab('immunity');
          break;
        case 'captain':
          setActiveTab('captain');
          break;
        case 'points':
          setActiveTab('leaderboard');
          break;
        case 'announcement':
          setActiveTab('announcements');
          break;
        case 'eviction':
          setActiveTab('evictions');
          break;
        default:
          break;
      }
    }

    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Popover Card */}
      <div className="fixed top-20 right-4 sm:right-8 z-50 w-[92vw] max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400 border border-red-500/20">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-orbitron font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white">
                  HOUSE TRANSMISSIONS
                </h3>
                {unreadNotificationsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold font-orbitron bg-red-600 text-white animate-pulse">
                    {unreadNotificationsCount} NEW
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-400 font-rajdhani">
                Real-time surveillance alerts & decrees
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold font-orbitron uppercase text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors"
                title="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                Read All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-2 bg-zinc-100/50 dark:bg-zinc-900/30 border-b border-zinc-200/70 dark:border-zinc-800/70 flex gap-2 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              activeFilter === 'unread'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Unread ({unreadNotificationsCount})
          </button>
          <button
            onClick={() => setActiveFilter('mine')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              activeFilter === 'mine'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Targeted Alerts
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[55vh]">
          {filteredNotifications.map((n) => {
            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer relative group hover:border-zinc-400 dark:hover:border-zinc-700 ${getNotificationColor(
                  n.type
                )} ${!n.read ? 'ring-1 ring-red-500/20' : 'opacity-85'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shrink-0 shadow-xs">
                    {getNotificationIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-rajdhani shrink-0 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {formatTimestamp(n.timestamp)}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 font-orbitron">
                      <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-zinc-200/50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
                        {n.type}
                      </span>
                      <span className="flex items-center gap-1 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                        View details <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-600 shadow-sm shadow-red-500" />
                )}

                {/* Dismiss button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(n.id);
                  }}
                  className="absolute bottom-2 right-2 p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Dismiss notification"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          {filteredNotifications.length === 0 && (
            <div className="py-12 text-center text-zinc-400 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="font-semibold">No notifications in this filter.</p>
              <p className="text-[11px] text-zinc-500 mt-1">Transmissions will appear automatically as events occur.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
