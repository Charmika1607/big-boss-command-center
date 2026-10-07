import { readDB, writeDB } from '../database/db.js';

// GET /api/notifications
export const getNotifications = (req, res) => {
  try {
    const db = readDB();
    let notifications = db.notifications || [];

    // Filter by authenticated recipient if contestant
    const user = req.user;
    if (user && user.role === 'contestant' && user.contestantId) {
      notifications = notifications.filter(n =>
        n.recipient === 'all' ||
        n.recipient === 'contestant' ||
        n.recipient === user.contestantId
      );
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    res.json({
      success: true,
      unreadCount,
      total: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/notifications/:id/read
export const markNotificationRead = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    const notif = (db.notifications || []).find(n => n.id === id);

    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    notif.read = true;
    writeDB(db);

    res.json({
      success: true,
      message: 'Notification marked as read.',
      data: notif
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/notifications/read-all
export const markAllNotificationsRead = (req, res) => {
  try {
    const db = readDB();
    const user = req.user;

    (db.notifications || []).forEach(n => {
      if (!user || user.role === 'admin' || user.role === 'viewer') {
        n.read = true;
      } else if (user.role === 'contestant') {
        if (n.recipient === 'all' || n.recipient === 'contestant' || n.recipient === user.contestantId) {
          n.read = true;
        }
      }
    });

    writeDB(db);

    res.json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/notifications/:id
export const deleteNotification = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    const index = (db.notifications || []).findIndex(n => n.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    const removed = db.notifications.splice(index, 1)[0];
    writeDB(db);

    res.json({
      success: true,
      message: 'Notification dismissed.',
      data: removed
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
