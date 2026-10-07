import crypto from 'crypto';
import { readDB, writeDB } from '../database/db.js';

// GET /api/contestants
export const getContestants = (req, res) => {
  try {
    const db = readDB();
    res.json({
      success: true,
      data: db.contestants
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/contestants
export const createContestant = (req, res) => {
  try {
    const { name, team, points = 0, avatar, bio } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Contestant name is required.' });
    }

    const validTeams = ['Red', 'Blue', 'Gold', 'Green'];
    const chosenTeam = validTeams.includes(team) ? team : 'Gold';

    const db = readDB();
    const newContestant = {
      id: `c-${crypto.randomUUID().slice(0, 8)}`,
      name: name.trim(),
      avatar: avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`,
      team: chosenTeam,
      points: Number.isFinite(Number(points)) ? Math.max(0, Number(points)) : 0,
      status: 'Active',
      isCaptain: false,
      isNominated: false,
      isImmune: false,
      bio: bio ? bio.trim() : 'Housemate participating in Big Boss competition.'
    };

    db.contestants.push(newContestant);

    // Add activity log
    db.pointLogs.push({
      id: `log-${crypto.randomUUID().slice(0, 8)}`,
      contestantId: newContestant.id,
      contestantName: newContestant.name,
      amount: newContestant.points,
      reason: 'Entry to Big Boss House initial points',
      timestamp: new Date().toISOString()
    });

    writeDB(db);

    res.status(201).json({
      success: true,
      message: `${newContestant.name} added to the House.`,
      data: newContestant
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/contestants/:id
export const updateContestant = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    const index = db.contestants.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Contestant not found.' });
    }

    const current = db.contestants[index];
    const { name, team, bio, avatar } = req.body;

    if (name) current.name = name.trim();
    if (team) current.team = team;
    if (bio) current.bio = bio.trim();
    if (avatar) current.avatar = avatar;

    writeDB(db);

    res.json({
      success: true,
      message: 'Contestant profile updated.',
      data: current
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/contestants/:id/points
export const updatePoints = (req, res) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;

    const numAmount = Number(amount);
    if (!Number.isFinite(numAmount) || numAmount === 0) {
      return res.status(400).json({ success: false, message: 'Valid non-zero numeric point amount required.' });
    }

    const trimmedReason = reason && reason.trim() ? reason.trim() : (numAmount > 0 ? 'Merit reward by Big Boss' : 'Demerit penalty by Big Boss');

    const db = readDB();
    const contestant = db.contestants.find(c => c.id === id);

    if (!contestant) {
      return res.status(404).json({ success: false, message: 'Contestant not found.' });
    }

    // Rule 1: Evicted contestants cannot receive points
    if (contestant.status === 'Evicted') {
      return res.status(400).json({
        success: false,
        message: 'Rule 1 violation: Cannot modify points for an evicted contestant.'
      });
    }

    contestant.points += numAmount;

    // Rule 7: Prevent NaN
    if (Number.isNaN(contestant.points)) {
      contestant.points = 0;
    }

    const logEntry = {
      id: `log-${crypto.randomUUID().slice(0, 8)}`,
      contestantId: contestant.id,
      contestantName: contestant.name,
      amount: numAmount,
      reason: trimmedReason,
      timestamp: new Date().toISOString()
    };

    db.pointLogs.unshift(logEntry);
    writeDB(db);

    res.json({
      success: true,
      message: `Points updated: ${numAmount > 0 ? `+${numAmount}` : numAmount} for ${contestant.name}`,
      data: {
        contestant,
        log: logEntry
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/contestants/:id/evict
export const evictContestant = (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const db = readDB();
    const contestant = db.contestants.find(c => c.id === id);

    if (!contestant) {
      return res.status(404).json({ success: false, message: 'Contestant not found.' });
    }

    if (contestant.status === 'Evicted') {
      return res.status(400).json({ success: false, message: 'Contestant is already evicted.' });
    }

    const evictionTimestamp = new Date().toISOString();
    const evictionReason = reason && reason.trim() ? reason.trim() : 'Evicted by Big Boss executive order.';

    // Update contestant status
    contestant.status = 'Evicted';
    contestant.isCaptain = false;
    contestant.isNominated = false;
    contestant.isImmune = false;
    contestant.nominationReason = undefined;
    contestant.evictedAt = evictionTimestamp;
    contestant.finalPoints = contestant.points;

    // Record eviction log
    const evictionRecord = {
      id: `evict-${crypto.randomUUID().slice(0, 8)}`,
      contestantId: contestant.id,
      name: contestant.name,
      team: contestant.team,
      finalPoints: contestant.points,
      evictedAt: evictionTimestamp,
      reason: evictionReason
    };

    db.evictions.unshift(evictionRecord);

    // Announce eviction
    db.announcements.unshift({
      id: `ann-${crypto.randomUUID().slice(0, 8)}`,
      message: `🚪 EVICTION NOTICE: ${contestant.name} has been officially evicted from the Big Boss House!`,
      type: 'eviction',
      timestamp: evictionTimestamp,
      pinned: true
    });

    writeDB(db);

    res.json({
      success: true,
      message: `${contestant.name} has been evicted from the House.`,
      data: {
        contestant,
        evictionRecord
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/contestants/:id (admin delete)
export const deleteContestant = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    const index = db.contestants.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Contestant not found.' });
    }

    const removed = db.contestants.splice(index, 1)[0];
    writeDB(db);

    res.json({
      success: true,
      message: `${removed.name} removed from registry.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
