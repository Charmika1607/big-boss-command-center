import {
  Contestant,
  Task,
  Announcement,
  HouseStats,
  PointLog,
  EvictionRecord,
  User,
  UserRole,
  ActivityLog,
  HouseNotification,
  OverviewAnalytics,
  ContestantAnalytics
} from '../types';

const API_BASE = '/api';

// Current active auth session in client
interface SessionState {
  role: UserRole;
  userId: string;
  contestantId?: string;
  token?: string;
}

let activeSession: SessionState = {
  role: 'admin',
  userId: 'u-admin',
  contestantId: undefined,
  token: undefined
};

// Initialize from localStorage if exists
try {
  const saved = localStorage.getItem('bb_session');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.role) activeSession = parsed;
  }
} catch {
  // Ignore localStorage failure
}

export const setApiAuthSession = (session: Partial<SessionState>) => {
  activeSession = {
    ...activeSession,
    ...session
  };
  try {
    localStorage.setItem('bb_session', JSON.stringify(activeSession));
  } catch {
    // Ignore
  }
};

export const getApiAuthSession = (): SessionState => activeSession;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-user-role': activeSession.role,
    ...(activeSession.userId ? { 'x-user-id': activeSession.userId } : {}),
    ...(activeSession.contestantId ? { 'x-contestant-id': activeSession.contestantId } : {}),
    ...(activeSession.token
      ? { 'Authorization': `Bearer ${activeSession.token}` }
      : { 'Authorization': `Bearer ${activeSession.role}` }),
    ...((options.headers as Record<string, string>) || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const json = await response.json().catch(() => ({
    success: false,
    message: 'Invalid server response or connection failure'
  }));

  if (!response.ok || json.success === false) {
    const errorMsg = json.message || `API Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return json.data !== undefined ? json.data : json;
}

export const api = {
  // ---------------- Authentication & Roles ----------------
  getCurrentUser: () => request<User>('/auth/current'),
  getUsers: () => request<User[]>('/auth/users'),
  switchRole: (role: UserRole, contestantId?: string) =>
    request<{ user: User; token: string }>('/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role, contestantId })
    }),

  // ---------------- Contestants ----------------
  getContestants: () => request<Contestant[]>('/contestants'),
  createContestant: (data: Partial<Contestant>) =>
    request<Contestant>('/contestants', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateContestant: (id: string, data: Partial<Contestant>) =>
    request<Contestant>(`/contestants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  deleteContestant: (id: string) =>
    request<void>(`/contestants/${id}`, {
      method: 'DELETE'
    }),
  updatePoints: (id: string, amount: number, reason: string) =>
    request<{ contestant: Contestant; log: PointLog }>(`/contestants/${id}/points`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason })
    }),
  evictContestant: (id: string, reason: string) =>
    request<{ contestant: Contestant; evictionRecord: EvictionRecord }>(`/contestants/${id}/evict`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    }),
  grantImmunity: (id: string) =>
    request<Contestant>(`/contestants/${id}/immunity`, {
      method: 'POST'
    }),
  removeImmunity: (id: string) =>
    request<Contestant>(`/contestants/${id}/immunity`, {
      method: 'DELETE'
    }),

  // ---------------- Tasks ----------------
  getTasks: () => request<Task[]>('/tasks'),
  createTask: (data: Partial<Task>) =>
    request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateTask: (id: string, data: Partial<Task>) =>
    request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  deleteTask: (id: string) =>
    request<void>(`/tasks/${id}`, {
      method: 'DELETE'
    }),

  // ---------------- Captaincy ----------------
  getCaptain: () => request<Contestant | null>('/captain'),
  setCaptain: (contestantId: string | null, action: 'assign' | 'remove' = 'assign') =>
    request<Contestant | null>('/captain', {
      method: 'POST',
      body: JSON.stringify({ contestantId, action })
    }),

  // ---------------- Nominations ----------------
  getNominations: () => request<Contestant[]>('/nominations'),
  createNomination: (contestantId: string, reason: string) =>
    request<Contestant>('/nominations', {
      method: 'POST',
      body: JSON.stringify({ contestantId, reason })
    }),
  removeNomination: (contestantId: string) =>
    request<Contestant>(`/nominations/${contestantId}`, {
      method: 'DELETE'
    }),

  // ---------------- Announcements ----------------
  getAnnouncements: () => request<Announcement[]>('/announcements'),
  createAnnouncement: (message: string, type: string = 'general', pinned: boolean = false) =>
    request<Announcement>('/announcements', {
      method: 'POST',
      body: JSON.stringify({ message, type, pinned })
    }),
  deleteAnnouncement: (id: string) =>
    request<void>(`/announcements/${id}`, {
      method: 'DELETE'
    }),

  // ---------------- Real-Time Activity Log ----------------
  getActivities: (params?: { search?: string; role?: string; action?: string; limit?: number; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.role) query.set('role', params.role);
    if (params?.action) query.set('action', params.action);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.page) query.set('page', String(params.page));
    const qs = query.toString();
    return request<ActivityLog[]>(`/activity${qs ? `?${qs}` : ''}`);
  },

  // ---------------- Event Notifications ----------------
  getNotifications: () => request<HouseNotification[]>('/notifications'),
  markNotificationRead: (id: string) =>
    request<HouseNotification>(`/notifications/${id}/read`, {
      method: 'PATCH'
    }),
  markAllNotificationsRead: () =>
    request<{ success: boolean; message: string }>('/notifications/read-all', {
      method: 'PATCH'
    }),
  deleteNotification: (id: string) =>
    request<HouseNotification>(`/notifications/${id}`, {
      method: 'DELETE'
    }),

  // ---------------- Performance Analytics ----------------
  getAnalyticsOverview: () => request<OverviewAnalytics>('/analytics/overview'),
  getContestantAnalytics: (id: string) => request<ContestantAnalytics>(`/analytics/contestants/${id}`),
  getPointsAnalytics: () => request<any>('/analytics/points'),
  getTasksAnalytics: () => request<any>('/analytics/tasks'),

  // ---------------- Statistics & Logs ----------------
  getStatistics: () => request<HouseStats>('/statistics'),
  getPointLogs: () => request<PointLog[]>('/point-logs'),
  getEvictions: () => request<EvictionRecord[]>('/evictions'),
  resetSeed: () => request<unknown>('/seed/reset', { method: 'POST' })
};
