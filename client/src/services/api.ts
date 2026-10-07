import { Contestant, Task, Announcement, HouseStats, PointLog, EvictionRecord } from '../types';

const API_BASE = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
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
  // Contestants
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

  // Tasks
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

  // Captaincy
  getCaptain: () => request<Contestant | null>('/captain'),
  setCaptain: (contestantId: string | null, action: 'assign' | 'remove' = 'assign') =>
    request<Contestant | null>('/captain', {
      method: 'POST',
      body: JSON.stringify({ contestantId, action })
    }),

  // Nominations
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

  // Announcements
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

  // Statistics & Logs
  getStatistics: () => request<HouseStats>('/statistics'),
  getPointLogs: () => request<PointLog[]>('/point-logs'),
  getEvictions: () => request<EvictionRecord[]>('/evictions'),
  resetSeed: () => request<unknown>('/seed/reset', { method: 'POST' })
};
