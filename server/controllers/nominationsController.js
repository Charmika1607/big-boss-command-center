import crypto from 'crypto';
import { readDB, writeDB } from '../database/db.js';
import { logActivity, createNotification } from '../services/realtime.js';

// GET /api/nominations
export const getNominations = (req, res) => {
  try {
    const db = readDB();
    const nominees = db.contestants.filter(c => c.isNominated && c.status !== 'Evicted');
    res.json({
      success: true,
      data: nominees
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/nominations
export const createNomination = (req, res) => {
  try {
    const { contestantId, reason } = req.body;
    if (!contestantId) {
      return res.status(400).json({ success: false, message: 'Contestant ID is required.' });
    }

    const db = readDB();
    const contestant = db.contestants.find(c => c.id === contestantId);

    if (!contestant) {
      return res.status(404).json({ success: false, message: 'Contestant not found.' });
    }

    // Rule 2: Evicted contestants cannot be nominated
    if (contestant.status === 'Evicted') {
      return res.status(400).json({
        success: false,
        message: 'Rule 2 violation: Evicted contestants cannot be nominated.'
      });
    }

    // Rule 3: Immune contestants cannot be nominated
    if (contestant.isImmune) {
      return res.status(400).json({
        success: false,
        message: 'Rule 3 violation: Contestant holds Immunity and cannot be nominated.'
      });
    }

    const nominationReason = reason && reason.trim() ? reason.trim() : 'Nominated by Big Boss authority.';

    contestant.isNominated = true;
    contestant.nominationReason = nominationReason;
    if (!contestant.isCaptain) {
      contestant.status = 'Nominated';
    }

    // Add alert announcement
    db.announcements.unshift({
      id: `ann-${crypto.randomUUID().slice(0, 8)}`,
      message: `⚠ DANGER ZONE ALERT: ${contestant.name} has been nominated for eviction! Reason: "${nominationReason}"`,
      type: 'nomination',
      timestamp: new Date().toISOString(),
      pinned: true
    });

    writeDB(db);

    const actorName = req.user?.name || 'Big Boss (Admin)';
    const actorRole = req.user?.role || 'admin';

    logActivity(db, {
      actor: actorName,
      role: actorRole,
      action: 'NOMINATION_CREATED',
      description: `Placed ${contestant.name} in Danger Zone ("${nominationReason}")`,
      target: contestant.name,
      targetId: contestant.id
    });

    // Notify nominee directly
    createNotification(db, {
      recipient: contestant.id,
      title: 'Danger Zone Alert: You Are Nominated',
      message: `You have been nominated for eviction. Reason: "${nominationReason}". Secure audience votes immediately!`,
      type: 'nomination',
      relatedEntity: { type: 'dangerzone', id: contestant.id }
    });

    // Notify all housemates
    createNotification(db, {
      recipient: 'all',
      title: 'Nomination Alert',
      message: `⚠ DANGER ZONE: ${contestant.name} has been nominated for eviction!`,
      type: 'nomination',
      relatedEntity: { type: 'dangerzone', id: contestant.id }
    });

    res.status(201).json({
      success: true,
      message: `${contestant.name} has been placed in the Danger Zone.`,
      data: contestant
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/nominations/:id
export const removeNomination = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    const contestant = db.contestants.find(c => c.id === id);

    if (!contestant) {
      return res.status(404).json({ success: false, message: 'Contestant not found.' });
    }

    contestant.isNominated = false;
    contestant.nominationReason = undefined;
    if (contestant.status === 'Nominated') {
      contestant.status = contestant.isCaptain ? 'Captain' : (contestant.isImmune ? 'Immune' : 'Active');
    }

    db.announcements.unshift({
      id: `ann-${crypto.randomUUID().slice(0, 8)}`,
      message: `🕊 NOMINATION REVOKED: ${contestant.name} has been removed from the Danger Zone.`,
      type: 'nomination',
      timestamp: new Date().toISOString(),
      pinned: false
    });

    writeDB(db);

    const actorName = req.user?.name || 'Big Boss (Admin)';
    const actorRole = req.user?.role || 'admin';

    logActivity(db, {
      actor: actorName,
      role: actorRole,
      action: 'NOMINATION_REVOKED',
      description: `Revoked Danger Zone nomination for ${contestant.name}`,
      target: contestant.name,
      targetId: contestant.id
    });

    createNotification(db, {
      recipient: contestant.id,
      title: 'Danger Zone Cleared',
      message: `Your nomination has been revoked. You are safe from the current eviction cycle.`,
      type: 'nomination',
      relatedEntity: { type: 'dangerzone', id: contestant.id }
    });

    res.json({
      success: true,
      message: `Nomination revoked for ${contestant.name}.`,
      data: contestant
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
