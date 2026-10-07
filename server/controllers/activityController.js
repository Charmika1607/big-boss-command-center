import { readDB } from '../database/db.js';

// GET /api/activity
export const getActivities = (req, res) => {
  try {
    const db = readDB();
    let activities = db.activities || [];

    const { search, role, action, target, limit = 50, page = 1 } = req.query;

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      activities = activities.filter(a =>
        (a.actor && a.actor.toLowerCase().includes(q)) ||
        (a.description && a.description.toLowerCase().includes(q)) ||
        (a.action && a.action.toLowerCase().includes(q)) ||
        (a.target && a.target.toLowerCase().includes(q))
      );
    }

    if (role && role !== 'All') {
      activities = activities.filter(a => a.role?.toLowerCase() === role.toLowerCase());
    }

    if (action && action !== 'All') {
      activities = activities.filter(a => a.action?.toLowerCase().includes(action.toLowerCase()));
    }

    if (target && target !== 'All') {
      activities = activities.filter(a => a.target?.toLowerCase().includes(target.toLowerCase()));
    }

    const total = activities.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(200, parseInt(limit, 10) || 50));
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = activities.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      count: paginated.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: paginated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
