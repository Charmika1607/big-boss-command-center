import crypto from 'crypto';
import { readDB, writeDB } from '../database/db.js';

// GET /api/announcements
export const getAnnouncements = (req, res) => {
  try {
    const db = readDB();
    res.json({
      success: true,
      data: db.announcements || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/announcements
export const createAnnouncement = (req, res) => {
  try {
    const { message, type = 'general', pinned = false } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Announcement message cannot be empty.' });
    }

    const db = readDB();
    const newAnnouncement = {
      id: `ann-${crypto.randomUUID().slice(0, 8)}`,
      message: message.trim(),
      type: type || 'general',
      timestamp: new Date().toISOString(),
      pinned: Boolean(pinned)
    };

    db.announcements.unshift(newAnnouncement);
    writeDB(db);

    res.status(201).json({
      success: true,
      message: 'Announcement broadcasted to the House.',
      data: newAnnouncement
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/announcements/:id
export const deleteAnnouncement = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    const index = db.announcements.findIndex(a => a.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    const removed = db.announcements.splice(index, 1)[0];
    writeDB(db);

    res.json({
      success: true,
      message: 'Announcement deleted.',
      data: removed
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
