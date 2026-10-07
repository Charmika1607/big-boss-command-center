import { readDB, resetDB } from '../database/db.js';
import { logActivity, createNotification } from '../services/realtime.js';

// GET /api/statistics
export const getStatistics = (req, res) => {
  try {
    const db = readDB();
    const contestants = db.contestants || [];
    const tasks = db.tasks || [];

    const activeList = contestants.filter(c => c.status !== 'Evicted');
    const evictedList = contestants.filter(c => c.status === 'Evicted');

    // Find highest scorer among active contestants
    let highestScorer = null;
    if (activeList.length > 0) {
      const sorted = [...activeList].sort((a, b) => b.points - a.points);
      highestScorer = {
        id: sorted[0].id,
        name: sorted[0].name,
        points: sorted[0].points,
        avatar: sorted[0].avatar,
        team: sorted[0].team
      };
    }

    const currentCaptainContestant = activeList.find(c => c.isCaptain);
    const currentCaptain = currentCaptainContestant ? {
      id: currentCaptainContestant.id,
      name: currentCaptainContestant.name,
      avatar: currentCaptainContestant.avatar,
      team: currentCaptainContestant.team
    } : null;

    const stats = {
      totalContestants: contestants.length,
      activeContestants: activeList.length,
      evictedContestants: evictedList.length,
      highestScorer,
      completedTasks: tasks.filter(t => t.status === 'Completed').length,
      pendingTasks: tasks.filter(t => t.status === 'Pending').length,
      inProgressTasks: tasks.filter(t => t.status === 'In Progress').length,
      nomineesCount: activeList.filter(c => c.isNominated).length,
      immuneCount: activeList.filter(c => c.isImmune).length,
      currentCaptain
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/point-logs
export const getPointLogs = (req, res) => {
  try {
    const db = readDB();
    res.json({
      success: true,
      data: db.pointLogs || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/evictions
export const getEvictions = (req, res) => {
  try {
    const db = readDB();
    res.json({
      success: true,
      data: db.evictions || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/seed/reset
export const resetDatabase = (req, res) => {
  try {
    const freshData = resetDB();

    logActivity(freshData, {
      actor: req.user?.name || 'Big Boss (Admin)',
      role: 'admin',
      action: 'DATABASE_RESET',
      description: 'System reseeded to official factory state',
      target: 'System Database',
      targetId: 'db-root'
    });

    createNotification(freshData, {
      recipient: 'all',
      title: 'Database Reseeded',
      message: 'System reinitialized to official Big Boss baseline.',
      type: 'system',
      relatedEntity: { type: 'system', id: 'reset' }
    });

    res.json({
      success: true,
      message: 'Big Boss Command Center database reset to official factory seed.',
      data: freshData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
