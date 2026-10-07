import express from 'express';
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
  getStatistics,
  getPointLogs,
  getEvictions,
  resetDatabase
} from '../controllers/statsController.js';

const router = express.Router();

// Contestants
router.get('/contestants', getContestants);
router.post('/contestants', createContestant);
router.patch('/contestants/:id', updateContestant);
router.delete('/contestants/:id', deleteContestant);
router.post('/contestants/:id/points', updatePoints);
router.post('/contestants/:id/evict', evictContestant);
router.post('/contestants/:id/immunity', grantImmunity);
router.delete('/contestants/:id/immunity', removeImmunity);

// Tasks
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.patch('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

// Captain
router.get('/captain', getCaptain);
router.post('/captain', setCaptain);

// Nominations
router.get('/nominations', getNominations);
router.post('/nominations', createNomination);
router.delete('/nominations/:id', removeNomination);

// Announcements
router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

// Statistics & Reports
router.get('/statistics', getStatistics);
router.get('/point-logs', getPointLogs);
router.get('/evictions', getEvictions);
router.post('/seed/reset', resetDatabase);

export default router;
