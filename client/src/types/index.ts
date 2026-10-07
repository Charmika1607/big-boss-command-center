export type Team = 'Red' | 'Blue' | 'Gold' | 'Green';

export type ContestantStatus = 'Active' | 'Nominated' | 'Immune' | 'Captain' | 'Evicted';

export interface Contestant {
  id: string;
  name: string;
  avatar: string;
  team: Team;
  points: number;
  status: ContestantStatus;
  isCaptain: boolean;
  isNominated: boolean;
  isImmune: boolean;
  nominationReason?: string;
  evictedAt?: string;
  finalPoints?: number;
  bio?: string;
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface TaskContestant {
  id: string;
  name: string;
  avatar: string;
  team: Team;
  status: ContestantStatus;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedContestantIds: string[];
  assignedContestants?: TaskContestant[];
  rewardPoints: number;
  deadline: string;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

export interface PointLog {
  id: string;
  contestantId: string;
  contestantName: string;
  amount: number;
  reason: string;
  timestamp: string;
}

export type AnnouncementType = 'general' | 'task' | 'eviction' | 'captain' | 'nomination' | 'emergency';

export interface Announcement {
  id: string;
  message: string;
  type: AnnouncementType;
  timestamp: string;
  pinned?: boolean;
}

export interface EvictionRecord {
  id: string;
  contestantId: string;
  name: string;
  team: Team;
  finalPoints: number;
  evictedAt: string;
  reason?: string;
}

export interface HouseStats {
  totalContestants: number;
  activeContestants: number;
  evictedContestants: number;
  highestScorer: {
    id: string;
    name: string;
    points: number;
    avatar: string;
    team: Team;
  } | null;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  nomineesCount: number;
  immuneCount: number;
  currentCaptain: {
    id: string;
    name: string;
    avatar: string;
    team: Team;
  } | null;
}

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
}

// ---------------- NEW FEATURE TYPES ----------------

// 1. Roles & RBAC
export type UserRole = 'admin' | 'contestant' | 'viewer';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  contestantId?: string;
  avatar?: string;
}

// 2. Real-Time Activity Log
export interface ActivityLog {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole | 'system';
  action: string;
  description: string;
  target: string;
  targetId?: string;
}

// 3. Event Notifications
export interface HouseNotification {
  id: string;
  recipient: string;
  title: string;
  message: string;
  type: 'task' | 'nomination' | 'immunity' | 'captain' | 'points' | 'announcement' | 'eviction' | 'timer' | 'system';
  timestamp: string;
  read: boolean;
  relatedEntity?: {
    type: string;
    id?: string;
  };
}

// 4. Performance Analytics
export interface OverviewAnalytics {
  summary: {
    totalContestants: number;
    activeContestants: number;
    evictedContestants: number;
    totalPoints: number;
    averagePoints: number;
    pointsGainedTotal: number;
    pointsDeductedTotal: number;
    netPoints: number;
  };
  taskAnalytics: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    taskCompletionRate: number;
    totalRewardsAwarded: number;
  };
  teamPerformance: {
    team: Team;
    activeCount: number;
    totalPoints: number;
    averagePoints: number;
    topScorer: { name: string; points: number } | null;
  }[];
  topPerformers: {
    rank: number;
    id: string;
    name: string;
    team: Team;
    avatar: string;
    points: number;
    status: ContestantStatus;
    isCaptain: boolean;
    isImmune: boolean;
  }[];
  nominationFrequencies: {
    id: string;
    name: string;
    team: Team;
    count: number;
  }[];
  pointsTimeline: {
    timestamp: string;
    contestantName: string;
    amount: number;
    reason: string;
  }[];
}

export interface ContestantAnalytics {
  contestant: Contestant;
  currentRank: number | string;
  totalPoints: number;
  pointsGained: number;
  pointsLost: number;
  netPoints: number;
  tasksAssigned: number;
  tasksCompleted: number;
  tasksInProgress: number;
  tasksPending: number;
  taskCompletionRate: number;
  nominationCount: number;
  immunityCount: number;
  captaincyCount: number;
  performanceScore: number;
  performanceTier: string;
  pointsTrend: {
    timestamp: string;
    amount: number;
    cumulative: number;
    reason: string;
  }[];
  recentLogs: PointLog[];
  assignedTasks: {
    id: string;
    title: string;
    rewardPoints: number;
    status: TaskStatus;
    deadline: string;
  }[];
}
