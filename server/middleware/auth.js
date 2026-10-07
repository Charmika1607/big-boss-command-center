import { readDB } from '../database/db.js';

/**
 * Extract authenticated user and role from request headers
 */
export const extractUser = (req) => {
  const authHeader = req.headers['authorization'];
  const headerRole = req.headers['x-user-role'];
  const headerUserId = req.headers['x-user-id'];
  const headerContestantId = req.headers['x-contestant-id'];

  let role = headerRole ? String(headerRole).toLowerCase() : undefined;
  let userId = headerUserId ? String(headerUserId) : undefined;
  let contestantId = headerContestantId ? String(headerContestantId) : undefined;

  // Try parsing Authorization header
  if (authHeader) {
    const raw = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (raw) {
      if (raw.includes(':')) {
        const parts = raw.split(':');
        role = role || parts[0]?.toLowerCase();
        userId = userId || parts[1];
        contestantId = contestantId || parts[2];
      } else {
        try {
          const decoded = Buffer.from(raw, 'base64').toString('utf-8');
          const parsed = JSON.parse(decoded);
          role = role || parsed.role?.toLowerCase();
          userId = userId || parsed.userId || parsed.id;
          contestantId = contestantId || parsed.contestantId;
        } catch {
          // Token is just role name directly
          role = role || raw.toLowerCase();
        }
      }
    }
  }

  // If no role specified, request is unauthenticated
  if (!role) {
    return null;
  }

  const validRoles = ['admin', 'contestant', 'viewer'];
  const normalizedRole = validRoles.includes(role) ? role : 'viewer';

  const db = readDB();
  const users = db.users || [];
  let user = users.find(u =>
    (userId && u.id === userId) ||
    (contestantId && u.contestantId === contestantId) ||
    u.role === normalizedRole
  );

  if (!user) {
    // Dynamically resolve contestant info if contestant role
    let contestantName = 'Contestant Housemate';
    if (normalizedRole === 'contestant') {
      const targetC = db.contestants.find(c => c.id === (contestantId || 'c-aarav'));
      if (targetC) {
        contestantName = targetC.name;
        contestantId = targetC.id;
      }
    }

    user = {
      id: userId || `u-${normalizedRole}-${contestantId || 'default'}`,
      username: normalizedRole,
      name: normalizedRole === 'admin'
        ? 'Big Boss (Admin)'
        : (normalizedRole === 'contestant' ? contestantName : 'Public Spectator'),
      role: normalizedRole,
      contestantId: normalizedRole === 'contestant' ? (contestantId || 'c-aarav') : undefined
    };
  }

  return {
    ...user,
    role: normalizedRole,
    contestantId: contestantId || user.contestantId
  };
};

/**
 * Non-blocking authentication middleware
 */
export const authenticate = (req, res, next) => {
  req.user = extractUser(req);
  next();
};

/**
 * Enforces that user is authenticated with any valid role
 */
export const requireAuth = (req, res, next) => {
  const user = req.user || extractUser(req);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Authentication credentials required to perform this action.'
    });
  }
  req.user = user;
  next();
};

/**
 * Enforces role-based permissions
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user || extractUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication credentials required.'
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${user.role}' is not authorized to execute this operation.`
      });
    }

    req.user = user;
    next();
  };
};

export const requireAdmin = requireRole('admin');
export const requireContestantOrAdmin = requireRole('admin', 'contestant');
