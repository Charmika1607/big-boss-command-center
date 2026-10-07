import crypto from 'crypto';
import { readDB, writeDB } from '../database/db.js';
import { logActivity, createNotification } from '../services/realtime.js';

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

    const actorName = req.user?.name || 'Big Boss (Admin)';
    const actorRole = req.user?.role || 'admin';

    logActivity(db, {
      actor: actorName,
      role: actorRole,
      action: 'IMMUNITY_GRANTED',
      description: `Granted Immunity Shield to ${contestant.name}`,
      target: contestant.name,
      targetId: contestant.id
    });

    createNotification(db, {
      recipient: contestant.id,
      title: 'Immunity Shield Activated',
      message: `You are shielded from nominations and the Danger Zone!`,
      type: 'immunity',
      relatedEntity: { type: 'immunity', id: contestant.id }
    });

    createNotification(db, {
      recipient: 'all',
      title: 'Immunity Shield Bestowed',
      message: `🛡 ${contestant.name} has been granted Immunity protection by Big Boss!`,
      type: 'immunity',
      relatedEntity: { type: 'immunity', id: contestant.id }
    });

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

    const actorName = req.user?.name || 'Big Boss (Admin)';
    const actorRole = req.user?.role || 'admin';

    logActivity(db, {
      actor: actorName,
      role: actorRole,
      action: 'IMMUNITY_REVOKED',
      description: `Immunity Shield revoked for ${contestant.name}`,
      target: contestant.name,
      targetId: contestant.id
    });

    createNotification(db, {
      recipient: contestant.id,
      title: 'Immunity Shield Revoked',
      message: `Your Immunity protection has expired or been revoked. You are now eligible for nomination.`,
      type: 'immunity',
      relatedEntity: { type: 'immunity', id: contestant.id }
    });

    res.json({
      success: true,
      message: `Immunity removed for ${contestant.name}.`,
      data: contestant
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
