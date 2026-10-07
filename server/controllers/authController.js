import { readDB, writeDB } from '../database/db.js';
import { logActivity } from '../services/realtime.js';

// GET /api/auth/current
export const getCurrentUser = (req, res) => {
  try {
    const user = req.user || {
      id: 'u-admin',
      username: 'bigboss',
      name: 'Big Boss (Admin)',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    };

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/users
export const getUsers = (req, res) => {
  try {
    const db = readDB();
    res.json({
      success: true,
      data: db.users || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/switch-role
export const switchRole = (req, res) => {
  try {
    const { role, contestantId } = req.body;
    const validRoles = ['admin', 'contestant', 'viewer'];

    if (!role || !validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified. Must be "admin", "contestant", or "viewer".'
      });
    }

    const normalizedRole = role.toLowerCase();
    const db = readDB();

    let user;
    if (normalizedRole === 'admin') {
      user = (db.users || []).find(u => u.role === 'admin') || {
        id: 'u-admin',
        username: 'bigboss',
        name: 'Big Boss (Admin)',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      };
    } else if (normalizedRole === 'viewer') {
      user = (db.users || []).find(u => u.role === 'viewer') || {
        id: 'u-viewer',
        username: 'viewer',
        name: 'Public Spectator',
        role: 'viewer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
      };
    } else {
      // Contestant role
      const targetId = contestantId || 'c-aarav';
      const contestant = (db.contestants || []).find(c => c.id === targetId);

      if (!contestant) {
        return res.status(404).json({ success: false, message: 'Specified contestant not found.' });
      }

      user = (db.users || []).find(u => u.contestantId === contestant.id) || {
        id: `u-${contestant.id}`,
        username: contestant.name.toLowerCase().replace(/\s+/g, ''),
        name: contestant.name,
        role: 'contestant',
        contestantId: contestant.id,
        avatar: contestant.avatar
      };
    }

    // Generate token representation
    const token = Buffer.from(JSON.stringify({
      id: user.id,
      role: user.role,
      contestantId: user.contestantId
    })).toString('base64');

    // Log the session switch
    logActivity(db, {
      actor: user.name,
      role: user.role,
      action: 'USER_LOGIN_SWITCH',
      description: `Active session switched to ${user.name} (${user.role.toUpperCase()})`,
      target: user.role.toUpperCase(),
      targetId: user.id
    });

    res.json({
      success: true,
      message: `Switched session to ${user.name} [${user.role.toUpperCase()}].`,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
