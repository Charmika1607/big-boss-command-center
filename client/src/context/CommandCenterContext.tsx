import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Contestant,
  Task,
  Announcement,
  HouseStats,
  PointLog,
  EvictionRecord,
  ToastMessage,
  TaskStatus,
  User,
  UserRole,
  ActivityLog,
  HouseNotification,
  OverviewAnalytics
} from '../types';
import { api, setApiAuthSession, getApiAuthSession } from '../services/api';
import { soundFX } from '../services/audio';

interface CommandCenterContextType {
  // Existing State
  contestants: Contestant[];
  activeContestants: Contestant[];
  evictedContestants: Contestant[];
  nominees: Contestant[];
  tasks: Task[];
  announcements: Announcement[];
  latestAnnouncement: Announcement | null;
  statistics: HouseStats | null;
  pointLogs: PointLog[];
  evictions: EvictionRecord[];
  currentCaptain: Contestant | null;
  loading: boolean;
  error: string | null;
  toasts: ToastMessage[];

  // Sound
  isMuted: boolean;
  toggleMute: () => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Modals
  activeModal: string | null;
  modalPayload: any;
  openModal: (modalName: string, payload?: any) => void;
  closeModal: () => void;

  // Actions
  refreshAll: () => Promise<void>;
  addToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info', title?: string) => void;
  removeToast: (id: string) => void;

  // Business Actions
  createContestant: (data: Partial<Contestant>) => Promise<boolean>;
  adjustPoints: (id: string, amount: number, reason: string) => Promise<boolean>;
  createTask: (data: Partial<Task>) => Promise<boolean>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  assignCaptain: (id: string) => Promise<boolean>;
  removeCaptain: () => Promise<boolean>;
  nominateContestant: (id: string, reason: string) => Promise<boolean>;
  removeNomination: (id: string) => Promise<boolean>;
  grantImmunity: (id: string) => Promise<boolean>;
  removeImmunity: (id: string) => Promise<boolean>;
  evictContestant: (id: string, reason: string) => Promise<boolean>;
  makeAnnouncement: (message: string, type?: string, pinned?: boolean) => Promise<boolean>;
  resetToFactorySeed: () => Promise<boolean>;

  // 1. RBAC & Current User Session
  currentUser: User;
  allUsers: User[];
  switchUserRole: (role: UserRole, contestantId?: string) => Promise<boolean>;
  canPerform: (action: string) => boolean;

  // 2. Real-Time Activity Log
  activities: ActivityLog[];
  activitiesLoading: boolean;
  refreshActivities: (params?: { search?: string; role?: string; action?: string }) => Promise<void>;

  // 3. Event Notifications
  notifications: HouseNotification[];
  unreadNotificationsCount: number;
  notificationPanelOpen: boolean;
  setNotificationPanelOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;

  // 4. Performance Analytics
  overviewAnalytics: OverviewAnalytics | null;
  analyticsLoading: boolean;
  refreshAnalytics: () => Promise<void>;
}

const CommandCenterContext = createContext<CommandCenterContextType | undefined>(undefined);

export const CommandCenterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Existing state
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [statistics, setStatistics] = useState<HouseStats | null>(null);
  const [pointLogs, setPointLogs] = useState<PointLog[]>([]);
  const [evictions, setEvictions] = useState<EvictionRecord[]>([]);
  const [captain, setCaptain] = useState<Contestant | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundFX.getMuted());

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalPayload, setModalPayload] = useState<any>(null);

  // Feature 1: Current User & RBAC
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const session = getApiAuthSession();
    return {
      id: session.userId || 'u-admin',
      username: session.role || 'bigboss',
      name: session.role === 'admin'
        ? 'Big Boss (Admin)'
        : (session.role === 'contestant' ? 'Contestant Housemate' : 'Public Spectator'),
      role: session.role || 'admin',
      contestantId: session.contestantId
    };
  });
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Feature 2: Real-time Activity Log
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState<boolean>(false);

  // Feature 3: Notifications
  const [notifications, setNotifications] = useState<HouseNotification[]>([]);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState<boolean>(false);

  // Feature 4: Analytics
  const [overviewAnalytics, setOverviewAnalytics] = useState<OverviewAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(false);

  // SSE EventSource reference
  const sseRef = useRef<EventSource | null>(null);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, message, type, title, timestamp: Date.now() }]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleMute = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
    addToast(muted ? 'Command Audio Silenced' : 'Command Audio Active', 'info');
  };

  const openModal = (modalName: string, payload?: any) => {
    soundFX.playClick();
    setActiveModal(modalName);
    setModalPayload(payload || null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalPayload(null);
  };

  // RBAC Permission Check
  const canPerform = useCallback((action: string): boolean => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'viewer') return false;

    // Contestant role rules
    if (currentUser.role === 'contestant') {
      if (action === 'complete_own_task' || action === 'view_own' || action === 'view_public') return true;
      return false; // cannot modify other contestants, cannot adjust points, cannot manage users
    }

    return false;
  }, [currentUser]);

  // Fetch activities
  const refreshActivities = useCallback(async (params?: { search?: string; role?: string; action?: string }) => {
    try {
      setActivitiesLoading(true);
      const data = await api.getActivities(params);
      setActivities(data);
    } catch (err: any) {
      console.error('Failed to load activities:', err);
    } finally {
      setActivitiesLoading(false);
    }
  }, []);

  // Fetch notifications
  const refreshNotifications = useCallback(async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err: any) {
      console.error('Failed to load notifications:', err);
    }
  }, []);

  // Fetch analytics
  const refreshAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true);
      const data = await api.getAnalyticsOverview();
      setOverviewAnalytics(data);
    } catch (err: any) {
      console.error('Failed to load analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  // Master fetch
  const refreshAll = useCallback(async () => {
    try {
      setError(null);
      const [cData, tData, aData, sData, pData, eData, capData, uData] = await Promise.all([
        api.getContestants(),
        api.getTasks(),
        api.getAnnouncements(),
        api.getStatistics(),
        api.getPointLogs(),
        api.getEvictions(),
        api.getCaptain(),
        api.getUsers().catch(() => [])
      ]);

      setContestants(cData);
      setTasks(tData);
      setAnnouncements(aData);
      setStatistics(sData);
      setPointLogs(pData);
      setEvictions(eData);
      setCaptain(capData);
      setAllUsers(uData);

      // Refresh ancillary modules
      await Promise.all([
        refreshActivities(),
        refreshNotifications(),
        refreshAnalytics()
      ]);
    } catch (err: any) {
      console.error('Failed to refresh Command Center state:', err);
      setError(err.message || 'Error connecting to Command Center Server');
    } finally {
      setLoading(false);
    }
  }, [refreshActivities, refreshNotifications, refreshAnalytics]);

  // Initial load
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Setup Server-Sent Events (SSE) connection for real-time live events
  useEffect(() => {
    let active = true;

    const setupSSE = () => {
      try {
        const es = new EventSource('/api/realtime/stream');
        sseRef.current = es;

        es.addEventListener('activity', (event) => {
          if (!active) return;
          try {
            const newAct: ActivityLog = JSON.parse(event.data);
            setActivities(prev => [newAct, ...prev.filter(a => a.id !== newAct.id)]);
          } catch (e) {
            console.error('Error parsing SSE activity:', e);
          }
        });

        es.addEventListener('notification', (event) => {
          if (!active) return;
          try {
            const newNotif: HouseNotification = JSON.parse(event.data);
            setNotifications(prev => [newNotif, ...prev.filter(n => n.id !== newNotif.id)]);

            // Trigger notification audio and alert if relevant to user
            const shouldAlert =
              newNotif.recipient === 'all' ||
              currentUser.role === 'admin' ||
              newNotif.recipient === currentUser.contestantId;

            if (shouldAlert) {
              soundFX.playClick();
              addToast(newNotif.message, 'info', newNotif.title.toUpperCase());
            }
          } catch (e) {
            console.error('Error parsing SSE notification:', e);
          }
        });

        es.onerror = () => {
          es.close();
          // Auto reconnect after 5s
          if (active) {
            setTimeout(setupSSE, 5000);
          }
        };
      } catch (err) {
        console.error('SSE initialization failed:', err);
      }
    };

    setupSSE();

    return () => {
      active = false;
      if (sseRef.current) {
        sseRef.current.close();
      }
    };
  }, [currentUser, addToast]);

  // Derived state
  const activeContestants = contestants.filter(c => c.status !== 'Evicted');
  const evictedContestants = contestants.filter(c => c.status === 'Evicted');
  const nominees = contestants.filter(c => c.isNominated && c.status !== 'Evicted');
  const latestAnnouncement = announcements.length > 0 ? announcements[0] : null;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Role switching
  const switchUserRole = async (role: UserRole, contestantId?: string): Promise<boolean> => {
    try {
      const res = await api.switchRole(role, contestantId);
      setCurrentUser(res.user);
      setApiAuthSession({
        role: res.user.role,
        userId: res.user.id,
        contestantId: res.user.contestantId,
        token: res.token
      });

      soundFX.playClick();
      addToast(
        `Session role switched to ${res.user.name} (${res.user.role.toUpperCase()})`,
        'success',
        'ROLE SWITCH'
      );

      // Re-fetch data with new role permissions
      await refreshAll();
      return true;
    } catch (err: any) {
      soundFX.playDangerAlert();
      addToast(err.message || 'Failed to switch role', 'error', 'AUTHORIZATION ERROR');
      return false;
    }
  };

  // Notification actions
  const markNotificationRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err: any) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      soundFX.playClick();
      addToast('All notifications marked as read.', 'info');
    } catch (err: any) {
      console.error('Failed to mark all notifications read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err: any) {
      console.error('Failed to delete notification:', err);
    }
  };

  // Business Actions
  const createContestant = async (data: Partial<Contestant>): Promise<boolean> => {
    try {
      await api.createContestant(data);
      soundFX.playSuccess();
      addToast(`New contestant ${data.name} inducted into the House.`, 'success', 'CONTESTANT REGISTERED');
      await refreshAll();
      closeModal();
      return true;
    } catch (err: any) {
      soundFX.playDangerAlert();
      addToast(err.message, 'error', 'REGISTRATION FAILED');
      return false;
    }
  };

  const adjustPoints = async (id: string, amount: number, reason: string): Promise<boolean> => {
    try {
      const res = await api.updatePoints(id, amount, reason);
      if (amount > 0) {
        soundFX.playSuccess();
      } else {
        soundFX.playDangerAlert();
      }
      addToast(
        `${amount > 0 ? `+${amount}` : amount} points recorded for ${res.contestant?.name || 'contestant'}.`,
        amount > 0 ? 'success' : 'warning',
        'POINT AUDIT UPDATE'
      );
      await refreshAll();
      closeModal();
      return true;
    } catch (err: any) {
      soundFX.playDangerAlert();
      addToast(err.message, 'error', 'POINT MODIFICATION REJECTED');
      return false;
    }
  };

  const createTask = async (data: Partial<Task>): Promise<boolean> => {
    try {
      await api.createTask(data);
      soundFX.playSuccess();
      addToast(`Task "${data.title}" initiated across the House.`, 'success', 'TASK COMMISSIONED');
      await refreshAll();
      closeModal();
      return true;
    } catch (err: any) {
      soundFX.playDangerAlert();
      addToast(err.message, 'error', 'TASK CREATION FAILED');
      return false;
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus): Promise<boolean> => {
    try {
      await api.updateTask(id, { status });
      if (status === 'Completed') {
        soundFX.playSuccess();
        addToast(`Task marked COMPLETED! Points awarded to assignees.`, 'success', 'REWARD GRANTED');
      } else {
        soundFX.playClick();
        addToast(`Task status adjusted to ${status}.`, 'info', 'STATUS UPDATE');
      }
      await refreshAll();
      return true;
    } catch (err: any) {
      soundFX.playDangerAlert();
      addToast(err.message, 'error', 'UPDATE FAILED');
      return false;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      await api.deleteTask(id);
      soundFX.playClick();
      addToast('Task removed from agenda.', 'info', 'TASK PURGED');
      await refreshAll();
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  const assignCaptain = async (id: string): Promise<boolean> => {
    try {
      const newCap = await api.setCaptain(id, 'assign');
      soundFX.playSuccess();
      addToast(`👑 ${newCap?.name || 'Selected housemate'} is now House Captain!`, 'success', 'CAPTAIN DECREE');
      await refreshAll();
      closeModal();
      return true;
    } catch (err: any) {
      soundFX.playDangerAlert();
      addToast(err.message, 'error', 'CAPTAINCY ERROR');
      return false;
    }
  };

  const removeCaptain = async (): Promise<boolean> => {
    try {
      await api.setCaptain(null, 'remove');
      soundFX.playClick();
      addToast('Current captain relieved of duty.', 'info', 'CAPTAINCY VACATED');
      await refreshAll();
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  const nominateContestant = async (id: string, reason: string): Promise<boolean> => {
    try {
      const res = await api.createNomination(id, reason);
      soundFX.playDangerAlert();
      addToast(`⚠ ${res.name} placed in Danger Zone!`, 'warning', 'NOMINATION CONFIRMED');
      await refreshAll();
      closeModal();
      return true;
    } catch (err: any) {
      soundFX.playDangerAlert();
      addToast(err.message, 'error', 'NOMINATION REJECTED');
      return false;
    }
  };

  const removeNomination = async (id: string): Promise<boolean> => {
    try {
      const res = await api.removeNomination(id);
      soundFX.playSuccess();
      addToast(`🕊 ${res.name} safely removed from the Danger Zone.`, 'info', 'NOMINATION REVOKED');
      await refreshAll();
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  const grantImmunity = async (id: string): Promise<boolean> => {
    try {
      const res = await api.grantImmunity(id);
      soundFX.playSuccess();
      addToast(`🛡 ${res.name} granted Immunity shield!`, 'success', 'IMMUNITY ACTIVE');
      await refreshAll();
      closeModal();
      return true;
    } catch (err: any) {
      soundFX.playDangerAlert();
      addToast(err.message, 'error', 'IMMUNITY FAILED');
      return false;
    }
  };

  const removeImmunity = async (id: string): Promise<boolean> => {
    try {
      const res = await api.removeImmunity(id);
      soundFX.playClick();
      addToast(`Immunity protection stripped from ${res.name}.`, 'warning', 'SHIELD DEACTIVATED');
      await refreshAll();
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  const evictContestant = async (id: string, reason: string): Promise<boolean> => {
    try {
      const res = await api.evictContestant(id, reason);
      soundFX.playEvictionHorn();
      addToast(`🚪 ${res.contestant?.name || 'Contestant'} has been evicted from the House!`, 'error', 'EVICTION PROTOCOL');
      await refreshAll();
      closeModal();
      return true;
    } catch (err: any) {
      soundFX.playDangerAlert();
      addToast(err.message, 'error', 'EVICTION ERROR');
      return false;
    }
  };

  const makeAnnouncement = async (message: string, type: string = 'general', pinned: boolean = false): Promise<boolean> => {
    try {
      await api.createAnnouncement(message, type, pinned);
      soundFX.playSuccess();
      addToast('Big Boss announcement transmitted to all screens.', 'info', 'TRANSMISSION SENT');
      await refreshAll();
      closeModal();
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  const resetToFactorySeed = async (): Promise<boolean> => {
    try {
      await api.resetSeed();
      soundFX.playSuccess();
      addToast('House database reseeded to initial state.', 'info', 'SYSTEM REINITIALIZED');
      await refreshAll();
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  return (
    <CommandCenterContext.Provider
      value={{
        contestants,
        activeContestants,
        evictedContestants,
        nominees,
        tasks,
        announcements,
        latestAnnouncement,
        statistics,
        pointLogs,
        evictions,
        currentCaptain: captain,
        loading,
        error,
        toasts,
        isMuted,
        toggleMute,
        activeTab,
        setActiveTab,
        activeModal,
        modalPayload,
        openModal,
        closeModal,
        refreshAll,
        addToast,
        removeToast,
        createContestant,
        adjustPoints,
        createTask,
        updateTaskStatus,
        deleteTask,
        assignCaptain,
        removeCaptain,
        nominateContestant,
        removeNomination,
        grantImmunity,
        removeImmunity,
        evictContestant,
        makeAnnouncement,
        resetToFactorySeed,

        // 1. RBAC
        currentUser,
        allUsers,
        switchUserRole,
        canPerform,

        // 2. Activity Log
        activities,
        activitiesLoading,
        refreshActivities,

        // 3. Notifications
        notifications,
        unreadNotificationsCount,
        notificationPanelOpen,
        setNotificationPanelOpen,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,

        // 4. Analytics
        overviewAnalytics,
        analyticsLoading,
        refreshAnalytics
      }}
    >
      {children}
    </CommandCenterContext.Provider>
  );
};

export const useCommandCenter = () => {
  const ctx = useContext(CommandCenterContext);
  if (!ctx) throw new Error('useCommandCenter must be used within CommandCenterProvider');
  return ctx;
};
