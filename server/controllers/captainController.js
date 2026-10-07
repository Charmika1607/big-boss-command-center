import crypto from 'crypto';
import { readDB, writeDB } from '../database/db.js';
import { logActivity, createNotification } from '../services/realtime.js';

// GET /api/captain
export const getCaptain = (req, res) => {
  try {
    const db = readDB();
    const captain = db.contestants.find(c => c.isCaptain && c.status !== 'Evicted');
    res.json({
      success: true,
      data: captain || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/captain
// Body: { contestantId, action: 'assign' | 'remove' }
export const setCaptain = (req, res) => {
  try {
    const { contestantId, action = 'assign' } = req.body;
    const db = readDB();
    const actorName = req.user?.name || 'Big Boss (Admin)';
    const actorRole = req.user?.role || 'admin';

    // Handling removal
    if (action === 'remove' || (!contestantId && action === 'assign')) {
      const currentCaptain = db.contestants.find(c => c.isCaptain);
      if (currentCaptain) {
        currentCaptain.isCaptain = false;
        currentCaptain.status = currentCaptain.isNominated ? 'Nominated' : (currentCaptain.isImmune ? 'Immune' : 'Active');

        db.announcements.unshift({
          id: `ann-${crypto.randomUUID().slice(0, 8)}`,
          message: `👑 Captaincy Update: ${currentCaptain.name} has been relieved of House Captaincy duties.`,
          type: 'captain',
          timestamp: new Date().toISOString(),
          pinned: false
        });

        writeDB(db);

        logActivity(db, {
          actor: actorName,
          role: actorRole,
          action: 'CAPTAIN_REMOVED',
          description: `${currentCaptain.name} relieved of House Captaincy duties`,
          target: currentCaptain.name,
          targetId: currentCaptain.id
        });

        createNotification(db, {
          recipient: 'all',
          title: 'Captaincy Relinquished',
          message: `${currentCaptain.name} is no longer House Captain.`,
          type: 'captain',
          relatedEntity: { type: 'captain', id: currentCaptain.id }
        });

        return res.json({
          success: true,
          message: `${currentCaptain.name} is no longer House Captain.`,
          data: null
        });
      }
      return res.json({ success: true, message: 'No current captain to remove.', data: null });
    }

    // Assigning new captain
    const target = db.contestants.find(c => c.id === contestantId);
    if (!target) {
      return res.status(404).json({ success: false, message: 'Contestant not found.' });
    }

    // Rule 5: Evicted contestants cannot become captain
    if (target.status === 'Evicted') {
      return res.status(400).json({
        success: false,
        message: 'Rule 5 violation: Evicted contestants cannot be assigned Captaincy.'
      });
    }

    // Rule 4: Only one captain can exist at a time
    db.contestants.forEach(c => {
      if (c.isCaptain && c.id !== target.id) {
        c.isCaptain = false;
        c.status = c.isNominated ? 'Nominated' : (c.isImmune ? 'Immune' : 'Active');
      }
    });

    target.isCaptain = true;
    target.status = 'Captain';

    // Announce new captain
    db.announcements.unshift({
      id: `ann-${crypto.randomUUID().slice(0, 8)}`,
      message: `👑 BIG BOSS PROCLAMATION: ${target.name} is now the official House Captain!`,
      type: 'captain',
      timestamp: new Date().toISOString(),
      pinned: true
    });

    writeDB(db);

    logActivity(db, {
      actor: actorName,
      role: actorRole,
      action: 'CAPTAIN_ASSIGNED',
      description: `Appointed ${target.name} as official House Captain`,
      target: target.name,
      targetId: target.id
    });

    createNotification(db, {
      recipient: 'all',
      title: 'New House Captain Proclaimed',
      message: `👑 ${target.name} is now the House Captain. Full compliance is required.`,
      type: 'captain',
      relatedEntity: { type: 'captain', id: target.id }
    });

    res.json({
      success: true,
      message: `👑 ${target.name} is now the House Captain.`,
      data: target
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
