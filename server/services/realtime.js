import crypto from 'crypto';
import { writeDB } from '../database/db.js';

// Connected SSE clients set
const sseClients = new Set();

/**
 * Handle new SSE subscriber connection
 */
export const subscribeSSE = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  res.write(': connected to Big Boss real-time stream\n\n');
  sseClients.add(res);

  // Heartbeat to keep connection alive every 25s
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
};

/**
 * Broadcast event to all active SSE subscribers
 */
export const broadcastSSE = (eventType, data) => {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
};

/**
 * Log a real application activity and stream it in real time
 */
export const logActivity = (db, {
  actor = 'Big Boss',
  role = 'admin',
  action,
  description,
  target = 'House',
  targetId = null
}) => {
  if (!Array.isArray(db.activities)) {
    db.activities = [];
  }

  const entry = {
    id: `act-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
    timestamp: new Date().toISOString(),
    actor,
    role,
    action,
    description,
    target,
    targetId
  };

  db.activities.unshift(entry);

  // Keep last 500 entries in storage
  if (db.activities.length > 500) {
    db.activities = db.activities.slice(0, 500);
  }

  writeDB(db);
  broadcastSSE('activity', entry);
  return entry;
};

/**
 * Create a real event notification and stream it in real time
 */
export const createNotification = (db, {
  recipient = 'all',
  title,
  message,
  type = 'system',
  relatedEntity = null
}) => {
  if (!Array.isArray(db.notifications)) {
    db.notifications = [];
  }

  const notification = {
    id: `notif-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
    recipient,
    title,
    message,
    type,
    timestamp: new Date().toISOString(),
    read: false,
    relatedEntity
  };

  db.notifications.unshift(notification);

  // Keep last 300 entries in storage
  if (db.notifications.length > 300) {
    db.notifications = db.notifications.slice(0, 300);
  }

  writeDB(db);
  broadcastSSE('notification', notification);
  return notification;
};
