import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

// High quality initial seed data
export const getInitialData = () => ({
  contestants: [
    {
      id: 'c-aarav',
      name: 'Aarav Sharma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      team: 'Gold',
      points: 135,
      status: 'Captain',
      isCaptain: true,
      isNominated: false,
      isImmune: false,
      bio: 'Former athlete, highly strategic leader and house disciplinarian.'
    },
    {
      id: 'c-meera',
      name: 'Meera Rajput',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      team: 'Green',
      points: 120,
      status: 'Immune',
      isCaptain: false,
      isNominated: false,
      isImmune: true,
      bio: 'Master negotiator, won the immunity idol during the Iron Vault task.'
    },
    {
      id: 'c-diya',
      name: 'Diya Patel',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
      team: 'Red',
      points: 110,
      status: 'Nominated',
      isCaptain: false,
      isNominated: true,
      isImmune: false,
      nominationReason: 'Failed to manage luxury rations and house conflict.',
      bio: 'Vocal, fearless challenger who speaks her mind in every confrontation.'
    },
    {
      id: 'c-ananya',
      name: 'Ananya Roy',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      team: 'Gold',
      points: 105,
      status: 'Active',
      isCaptain: false,
      isNominated: false,
      isImmune: false,
      bio: 'Calm under pressure, analytical planner and kitchen anchor.'
    },
    {
      id: 'c-siddharth',
      name: 'Siddharth Sen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      team: 'Blue',
      points: 100,
      status: 'Active',
      isCaptain: false,
      isNominated: false,
      isImmune: false,
      bio: 'Tech enthusiast, master of endurance and physical showdowns.'
    },
    {
      id: 'c-kabir',
      name: 'Kabir Verma',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      team: 'Blue',
      points: 95,
      status: 'Active',
      isCaptain: false,
      isNominated: false,
      isImmune: false,
      bio: 'Charismatic playmaker, constantly surveying house alliances.'
    },
    {
      id: 'c-ishita',
      name: 'Ishita Nair',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      team: 'Green',
      points: 90,
      status: 'Active',
      isCaptain: false,
      isNominated: false,
      isImmune: false,
      bio: 'Sharp wit, skilled in mental puzzles and house diplomacy.'
    },
    {
      id: 'c-arjun',
      name: 'Arjun Singhal',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
      team: 'Gold',
      points: 85,
      status: 'Active',
      isCaptain: false,
      isNominated: false,
      isImmune: false,
      bio: 'Enthusiastic team booster, passionate performer.'
    },
    {
      id: 'c-rohan',
      name: 'Rohan Malhotra',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
      team: 'Red',
      points: 80,
      status: 'Nominated',
      isCaptain: false,
      isNominated: true,
      isImmune: false,
      nominationReason: 'Direct rule violation during house quiet hours.',
      bio: 'Aggressive competitor with a fiery temperament.'
    },
    {
      id: 'c-vihaan',
      name: 'Vihaan Joshi',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
      team: 'Blue',
      points: 70,
      status: 'Nominated',
      isCaptain: false,
      isNominated: true,
      isImmune: false,
      nominationReason: 'Nominated by team vote during sudden-death drill.',
      bio: 'Creative mind, finds alternative angles to outmaneuver tasks.'
    },
    {
      id: 'c-kavya',
      name: 'Kavya Rao',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      team: 'Red',
      points: 60,
      status: 'Evicted',
      isCaptain: false,
      isNominated: false,
      isImmune: false,
      evictedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      finalPoints: 60,
      bio: 'Evicted on Week 2 Elimination night by public vote tally.'
    }
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Kitchen Protocol & Ration Distribution',
      description: 'Cook, inventory and allocate weekly rations strictly under budget for all 10 housemates without wastage.',
      assignedContestantIds: ['c-aarav', 'c-ananya'],
      rewardPoints: 25,
      deadline: 'Day 14 - 18:00',
      status: 'Completed',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      completedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'task-2',
      title: 'Physical Endurance: The Iron Vault',
      description: 'Endurance challenge inside the high-gravity quarantine vault. Last contestant standing secures immunity.',
      assignedContestantIds: ['c-meera'],
      rewardPoints: 30,
      deadline: 'Day 15 - 14:00',
      status: 'Completed',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      completedAt: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: 'task-3',
      title: 'Surveillance Spy Challenge',
      description: 'Identify 3 coded transmissions hidden across the house cameras within the allotted 60-minute cycle.',
      assignedContestantIds: ['c-kabir', 'c-ishita'],
      rewardPoints: 20,
      deadline: 'Day 16 - 21:00',
      status: 'In Progress',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'task-4',
      title: 'House Cleaning & Sanitization Drill',
      description: 'Complete rigorous full-house deep cleanse and sanitization inspection before Big Boss inspection siren.',
      assignedContestantIds: ['c-diya', 'c-rohan'],
      rewardPoints: 15,
      deadline: 'Day 17 - 11:00',
      status: 'In Progress',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'task-5',
      title: 'Midnight Luxury Budget Cryptogram',
      description: 'Decipher the central house cipher without triggering laser tripwires to unlock premium rations.',
      assignedContestantIds: ['c-arjun', 'c-vihaan'],
      rewardPoints: 40,
      deadline: 'Day 17 - 23:59',
      status: 'Pending',
      createdAt: new Date(Date.now() - 1800000).toISOString()
    }
  ],
  pointLogs: [
    {
      id: 'log-1',
      contestantId: 'c-aarav',
      contestantName: 'Aarav Sharma',
      amount: 25,
      reason: 'Task completed: Kitchen Protocol & Ration Distribution',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'log-2',
      contestantId: 'c-ananya',
      contestantName: 'Ananya Roy',
      amount: 25,
      reason: 'Task completed: Kitchen Protocol & Ration Distribution',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'log-3',
      contestantId: 'c-meera',
      contestantName: 'Meera Rajput',
      amount: 30,
      reason: 'Challenge Winner: Iron Vault Endurance',
      timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: 'log-4',
      contestantId: 'c-rohan',
      contestantName: 'Rohan Malhotra',
      amount: -10,
      reason: 'Rule violation: Speaking in forbidden dialect during quiet hours',
      timestamp: new Date(Date.now() - 3600000 * 18).toISOString()
    },
    {
      id: 'log-5',
      contestantId: 'c-diya',
      contestantName: 'Diya Patel',
      amount: -5,
      reason: 'Rule violation: Refusing morning siren lineup',
      timestamp: new Date(Date.now() - 3600000 * 8).toISOString()
    },
    {
      id: 'log-6',
      contestantId: 'c-aarav',
      contestantName: 'Aarav Sharma',
      amount: 15,
      reason: 'Captaincy bonus for maintaining house discipline',
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
    }
  ],
  announcements: [
    {
      id: 'ann-1',
      message: 'Aarav Sharma has been appointed as the official House Captain. Full house compliance is mandatory.',
      type: 'captain',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      pinned: true
    },
    {
      id: 'ann-2',
      message: 'Meera Rajput has secured Immunity for Week 3 through her victory in the Iron Vault challenge.',
      type: 'general',
      timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
      pinned: false
    },
    {
      id: 'ann-3',
      message: 'WARNING: Diya, Rohan, and Vihaan are officially placed in the DANGER ZONE for upcoming elimination.',
      type: 'nomination',
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      pinned: true
    },
    {
      id: 'ann-4',
      message: 'Attention housemates: The Midnight Luxury Budget task is approaching. Keep all surveillance zones clear.',
      type: 'task',
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
      pinned: false
    }
  ],
  evictions: [
    {
      id: 'evict-1',
      contestantId: 'c-kavya',
      name: 'Kavya Rao',
      team: 'Red',
      finalPoints: 60,
      evictedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      reason: 'Week 2 Public Eviction vote with lowest audience index.'
    }
  ],
  activities: [
    {
      id: 'act-1',
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
      actor: 'Big Boss (Admin)',
      role: 'admin',
      action: 'ANNOUNCEMENT_CREATED',
      description: 'Broadcasted luxury budget cipher task alert to House',
      target: 'House Broadcast',
      targetId: 'ann-4'
    },
    {
      id: 'act-2',
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      actor: 'Big Boss (Admin)',
      role: 'admin',
      action: 'POINTS_AWARDED',
      description: 'Awarded +15 captaincy bonus to Aarav Sharma for maintaining house discipline',
      target: 'Aarav Sharma',
      targetId: 'c-aarav'
    },
    {
      id: 'act-3',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      actor: 'Big Boss (Admin)',
      role: 'admin',
      action: 'TASK_CREATED',
      description: 'Commissioned "Surveillance Spy Challenge" for Kabir Verma & Ishita Nair',
      target: 'Surveillance Spy Challenge',
      targetId: 'task-3'
    },
    {
      id: 'act-4',
      timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
      actor: 'Big Boss (Admin)',
      role: 'admin',
      action: 'POINTS_DEDUCTED',
      description: 'Deducted 5 points from Diya Patel for refusing morning siren lineup',
      target: 'Diya Patel',
      targetId: 'c-diya'
    },
    {
      id: 'act-5',
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      actor: 'Big Boss (Admin)',
      role: 'admin',
      action: 'NOMINATION_CREATED',
      description: 'Placed Diya Patel, Rohan Malhotra & Vihaan Joshi in the Danger Zone',
      target: 'Danger Zone Nominees',
      targetId: 'c-diya'
    },
    {
      id: 'act-6',
      timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
      actor: 'Big Boss (Admin)',
      role: 'admin',
      action: 'POINTS_DEDUCTED',
      description: 'Deducted 10 points from Rohan Malhotra for forbidden dialect violation',
      target: 'Rohan Malhotra',
      targetId: 'c-rohan'
    },
    {
      id: 'act-7',
      timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
      actor: 'Meera Rajput',
      role: 'contestant',
      action: 'TASK_COMPLETED',
      description: 'Completed "The Iron Vault" endurance challenge, securing +30 points & immunity',
      target: 'The Iron Vault',
      targetId: 'task-2'
    },
    {
      id: 'act-8',
      timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
      actor: 'Big Boss (Admin)',
      role: 'admin',
      action: 'IMMUNITY_GRANTED',
      description: 'Granted Iron Vault Immunity Shield to Meera Rajput for Week 3',
      target: 'Meera Rajput',
      targetId: 'c-meera'
    },
    {
      id: 'act-9',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      actor: 'Big Boss (Admin)',
      role: 'admin',
      action: 'CAPTAIN_ASSIGNED',
      description: 'Appointed Aarav Sharma as official House Captain',
      target: 'Aarav Sharma',
      targetId: 'c-aarav'
    },
    {
      id: 'act-10',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      actor: 'Big Boss (Admin)',
      role: 'admin',
      action: 'EVICTION_EXECUTED',
      description: 'Evicted Kavya Rao following Week 2 Public Voting tally',
      target: 'Kavya Rao',
      targetId: 'c-kavya'
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      recipient: 'all',
      title: 'Danger Zone Alert',
      message: 'Diya Patel, Rohan Malhotra and Vihaan Joshi are nominated for elimination.',
      type: 'nomination',
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      read: false,
      relatedEntity: { type: 'dangerzone', id: 'c-diya' }
    },
    {
      id: 'notif-2',
      recipient: 'c-aarav',
      title: 'Captaincy Bonus Awarded',
      message: 'You have been awarded +15 points for maintaining supreme house order.',
      type: 'points',
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      read: false,
      relatedEntity: { type: 'leaderboard', id: 'c-aarav' }
    },
    {
      id: 'notif-3',
      recipient: 'c-kabir',
      title: 'New House Task Assigned',
      message: 'Big Boss assigned you to "Surveillance Spy Challenge" (Reward: 20 pts).',
      type: 'task',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      read: false,
      relatedEntity: { type: 'task', id: 'task-3' }
    },
    {
      id: 'notif-4',
      recipient: 'c-meera',
      title: 'Immunity Shield Confirmed',
      message: 'You are protected by the Iron Vault Immunity Shield for Week 3.',
      type: 'immunity',
      timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
      read: true,
      relatedEntity: { type: 'immunity', id: 'c-meera' }
    },
    {
      id: 'notif-5',
      recipient: 'all',
      title: 'New House Captain Proclaimed',
      message: 'Aarav Sharma has taken oath as House Captain. All orders are mandatory.',
      type: 'captain',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      read: true,
      relatedEntity: { type: 'captain', id: 'c-aarav' }
    },
    {
      id: 'notif-6',
      recipient: 'all',
      title: 'Eviction Notice',
      message: 'Kavya Rao has left the Big Boss House.',
      type: 'eviction',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      read: true,
      relatedEntity: { type: 'evictions', id: 'c-kavya' }
    }
  ],
  users: [
    {
      id: 'u-admin',
      username: 'bigboss',
      name: 'Big Boss (Admin)',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'u-c-aarav',
      username: 'aarav',
      name: 'Aarav Sharma',
      role: 'contestant',
      contestantId: 'c-aarav',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'u-c-meera',
      username: 'meera',
      name: 'Meera Rajput',
      role: 'contestant',
      contestantId: 'c-meera',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'u-c-diya',
      username: 'diya',
      name: 'Diya Patel',
      role: 'contestant',
      contestantId: 'c-diya',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'u-c-ananya',
      username: 'ananya',
      name: 'Ananya Roy',
      role: 'contestant',
      contestantId: 'c-ananya',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'u-c-siddharth',
      username: 'siddharth',
      name: 'Siddharth Sen',
      role: 'contestant',
      contestantId: 'c-siddharth',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'u-c-kabir',
      username: 'kabir',
      name: 'Kabir Verma',
      role: 'contestant',
      contestantId: 'c-kabir',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'u-c-ishita',
      username: 'ishita',
      name: 'Ishita Nair',
      role: 'contestant',
      contestantId: 'c-ishita',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'u-c-arjun',
      username: 'arjun',
      name: 'Arjun Singhal',
      role: 'contestant',
      contestantId: 'c-arjun',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'u-c-rohan',
      username: 'rohan',
      name: 'Rohan Malhotra',
      role: 'contestant',
      contestantId: 'c-rohan',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'u-c-vihaan',
      username: 'vihaan',
      name: 'Vihaan Joshi',
      role: 'contestant',
      contestantId: 'c-vihaan',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'u-viewer',
      username: 'viewer',
      name: 'Public Spectator',
      role: 'viewer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    }
  ]
});

// In-memory cache for speed with persistent disk synchronization
let cache = null;

export const readDB = () => {
  if (cache) return cache;
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      cache = JSON.parse(data);

      // Verify and populate newly introduced collections if reading an older db.json
      const initial = getInitialData();
      let modified = false;

      if (!Array.isArray(cache.activities)) {
        cache.activities = initial.activities;
        modified = true;
      }
      if (!Array.isArray(cache.notifications)) {
        cache.notifications = initial.notifications;
        modified = true;
      }
      if (!Array.isArray(cache.users)) {
        cache.users = initial.users;
        modified = true;
      }

      if (modified) {
        writeDB(cache);
      }

      return cache;
    }
  } catch (err) {
    console.error('Error reading db.json, reinitializing seed data:', err.message);
  }

  // Initialize with seed data
  cache = getInitialData();
  writeDB(cache);
  return cache;
};

export const writeDB = (data) => {
  cache = data;
  try {
    const tempPath = `${DB_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_PATH);
  } catch (err) {
    // Fallback direct write
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (writeErr) {
      console.error('Failed to write db.json:', writeErr.message);
    }
  }
};

export const resetDB = () => {
  const seed = getInitialData();
  writeDB(seed);
  return seed;
};
