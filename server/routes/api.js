import express from 'express';
import {
  authenticate,
  requireAdmin,
  requireAuth
} from '../middleware/auth.js';

import {
  getCurrentUser,
  getUsers,
  switchRole
} from '../controllers/authController.js';

import { subscribeSSE } from '../services/realtime.js';

import {
  getContestants,
  createContestant,
  updateContestant,
  updatePoints,
  evictContestant,
  deleteContestant
} from '../controllers/contestantsController.js';

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/tasksController.js';

import {
  getCaptain,
  setCaptain
} from '../controllers/captainController.js';

import {
  getNominations,
  createNomination,
  removeNomination
} from '../controllers/nominationsController.js';

import {
  grantImmunity,
  removeImmunity
} from '../controllers/immunityController.js';

import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
} from '../controllers/announcementsController.js';

import {
  getActivities
} from '../controllers/activityController.js';

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} from '../controllers/notificationsController.js';

import {
  getOverviewAnalytics,
  getContestantAnalytics,
  getPointsAnalytics,
  getTasksAnalytics
} from '../controllers/analyticsController.js';

import {
  getStatistics,
  getPointLogs,
  getEvictions,
  resetDatabase
} from '../controllers/statsController.js';

const router = express.Router();

// Non-blocking user extractor for all API routes
router.use(authenticate);

// ---------------- Authentication & Sessions ----------------
router.get('/auth/current', getCurrentUser);
router.get('/auth/users', getUsers);
router.post('/auth/switch-role', switchRole);

// ---------------- Real-time Live Event Streaming (SSE) ----------------
router.get('/realtime/stream', subscribeSSE);

// ---------------- Contestants (Admin-Protected Mutations) ----------------
router.get('/contestants', getContestants);
router.post('/contestants', requireAdmin, createContestant);
router.patch('/contestants/:id', requireAdmin, updateContestant);
router.delete('/contestants/:id', requireAdmin, deleteContestant);
router.post('/contestants/:id/points', requireAdmin, updatePoints);
router.post('/contestants/:id/evict', requireAdmin, evictContestant);
router.post('/contestants/:id/immunity', requireAdmin, grantImmunity);
router.delete('/contestants/:id/immunity', requireAdmin, removeImmunity);

// ---------------- Tasks ----------------
router.get('/tasks', getTasks);
router.post('/tasks', requireAdmin, createTask);
// PATCH /tasks/:id allows Admin, plus Contestant for their own assigned tasks
router.patch('/tasks/:id', requireAuth, updateTask);
router.delete('/tasks/:id', requireAdmin, deleteTask);

// ---------------- Captaincy (Admin-Protected) ----------------
router.get('/captain', getCaptain);
router.post('/captain', requireAdmin, setCaptain);

// ---------------- Nominations & Danger Zone (Admin-Protected) ----------------
router.get('/nominations', getNominations);
router.post('/nominations', requireAdmin, createNomination);
router.delete('/nominations/:id', requireAdmin, removeNomination);

// ---------------- Announcements & Transmissions ----------------
router.get('/announcements', getAnnouncements);
router.post('/announcements', requireAdmin, createAnnouncement);
router.delete('/announcements/:id', requireAdmin, deleteAnnouncement);

// ---------------- Activity Logs (Real-time Feed) ----------------
router.get('/activity', getActivities);

// ---------------- Notifications & Alerts ----------------
router.get('/notifications', getNotifications);
router.patch('/notifications/read-all', markAllNotificationsRead);
router.patch('/notifications/:id/read', markNotificationRead);
router.delete('/notifications/:id', deleteNotification);

// ---------------- Performance Analytics (Real-Data Metrics) ----------------
router.get('/analytics/overview', getOverviewAnalytics);
router.get('/analytics/contestants/:id', getContestantAnalytics);
router.get('/analytics/points', getPointsAnalytics);
router.get('/analytics/tasks', getTasksAnalytics);

// ---------------- Statistics & Seed Control ----------------
router.get('/statistics', getStatistics);
router.get('/point-logs', getPointLogs);
router.get('/evictions', getEvictions);
router.post('/seed/reset', requireAdmin, resetDatabase);

export default router;
