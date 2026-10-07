import crypto from 'crypto';
import { readDB, writeDB } from '../database/db.js';

// POST /api/contestants/:id/immunity
export const grantImmunity = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    const contestant = db.contestants.find(c => c.id === id);

    if (!contestant) {
      return res.status(404).json({ success: false, message: 'Contestant not found.' });
    }

    if (contestant.status === 'Evicted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot grant immunity to an evicted contestant.'
      });
    }

    contestant.isImmune = true;

    // If contestant was nominated, immunity breaks nomination
    if (contestant.isNominated) {
      contestant.isNominated = false;
      contestant.nominationReason = undefined;
    }

    if (!contestant.isCaptain) {
      contestant.status = 'Immune';
    }

    // Add announcement
    db.announcements.unshift({
      id: `ann-${crypto.randomUUID().slice(0, 8)}`,
      message: `🛡 IMMUNITY SHIELD: ${contestant.name} has been granted Immunity by Big Boss! Protected from Danger Zone.`,
      type: 'general',
      timestamp: new Date().toISOString(),
      pinned: false
    });

    writeDB(db);

    res.json({
      success: true,
      message: `Immunity granted to ${contestant.name}.`,
      data: contestant
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/contestants/:id/immunity
export const removeImmunity = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    const contestant = db.contestants.find(c => c.id === id);

    if (!contestant) {
      return res.status(404).json({ success: false, message: 'Contestant not found.' });
    }

    contestant.isImmune = false;
    if (contestant.status === 'Immune') {
      contestant.status = contestant.isCaptain ? 'Captain' : (contestant.isNominated ? 'Nominated' : 'Active');
    }

    db.announcements.unshift({
      id: `ann-${crypto.randomUUID().slice(0, 8)}`,
      message: `🛡 IMMUNITY REVOKED: ${contestant.name} is no longer protected by the Immunity shield.`,
      type: 'general',
      timestamp: new Date().toISOString(),
      pinned: false
    });

    writeDB(db);

    res.json({
      success: true,
      message: `Immunity removed for ${contestant.name}.`,
      data: contestant
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
