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
