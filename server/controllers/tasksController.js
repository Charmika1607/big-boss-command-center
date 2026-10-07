import crypto from 'crypto';
import { readDB, writeDB } from '../database/db.js';

// GET /api/tasks
export const getTasks = (req, res) => {
  try {
    const db = readDB();
    // Hydrate tasks with assigned contestant details
    const hydratedTasks = db.tasks.map(task => {
      const assigned = (task.assignedContestantIds || []).map(id => {
        const c = db.contestants.find(item => item.id === id);
        return c ? { id: c.id, name: c.name, avatar: c.avatar, team: c.team, status: c.status } : null;
      }).filter(Boolean);
      return { ...task, assignedContestants: assigned };
    });

    res.json({
      success: true,
      data: hydratedTasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/tasks
export const createTask = (req, res) => {
  try {
    const { title, description, assignedContestantIds = [], rewardPoints = 20, deadline } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Task title is required.' });
    }

    const numReward = Number(rewardPoints);
    if (!Number.isFinite(numReward) || numReward <= 0) {
      return res.status(400).json({ success: false, message: 'Reward points must be a positive number.' });
    }

    const db = readDB();
    const newTask = {
      id: `task-${crypto.randomUUID().slice(0, 8)}`,
      title: title.trim(),
      description: description ? description.trim() : 'House challenge assigned by Big Boss.',
      assignedContestantIds: Array.isArray(assignedContestantIds) ? assignedContestantIds : [],
      rewardPoints: numReward,
      deadline: deadline || 'Day 18 - 20:00',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    db.tasks.unshift(newTask);

    // Announce new task
    db.announcements.unshift({
      id: `ann-${crypto.randomUUID().slice(0, 8)}`,
      message: `📢 NEW TASK ALERT: Big Boss has announced "${newTask.title}" with a ${newTask.rewardPoints} pts reward!`,
      type: 'task',
      timestamp: new Date().toISOString(),
      pinned: false
    });

    writeDB(db);

    res.status(201).json({
      success: true,
      message: `Task "${newTask.title}" created successfully.`,
      data: newTask
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/tasks/:id
export const updateTask = (req, res) => {
  try {
    const { id } = req.params;
    const { status, title, description, assignedContestantIds, rewardPoints, deadline } = req.body;

    const db = readDB();
    const task = db.tasks.find(t => t.id === id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const previousStatus = task.status;

    if (title) task.title = title.trim();
    if (description) task.description = description.trim();
    if (Array.isArray(assignedContestantIds)) task.assignedContestantIds = assignedContestantIds;
    if (deadline) task.deadline = deadline;
    if (rewardPoints && Number.isFinite(Number(rewardPoints))) {
      task.rewardPoints = Number(rewardPoints);
    }

    let pointsAwarded = false;
    let awardedContestantNames = [];

    // Rule 6: Completed tasks cannot repeatedly award points if marked completed again!
    if (status && status !== previousStatus) {
      task.status = status;

      if (status === 'Completed' && previousStatus !== 'Completed') {
        task.completedAt = new Date().toISOString();
        pointsAwarded = true;

        // Award points to all assigned contestants who are NOT evicted
        (task.assignedContestantIds || []).forEach(contestantId => {
          const contestant = db.contestants.find(c => c.id === contestantId);
          if (contestant && contestant.status !== 'Evicted') {
            contestant.points += task.rewardPoints;
            awardedContestantNames.push(contestant.name);

            // Record point history
            db.pointLogs.unshift({
              id: `log-${crypto.randomUUID().slice(0, 8)}`,
              contestantId: contestant.id,
              contestantName: contestant.name,
              amount: task.rewardPoints,
              reason: `Task completed: ${task.title}`,
              timestamp: new Date().toISOString()
            });
          }
        });

        // Add announcement
        const namesList = awardedContestantNames.length > 0 ? awardedContestantNames.join(', ') : 'Assigned housemates';
        db.announcements.unshift({
          id: `ann-${crypto.randomUUID().slice(0, 8)}`,
          message: `🏆 TASK COMPLETED: "${task.title}". ${task.rewardPoints} points awarded to ${namesList}!`,
          type: 'task',
          timestamp: new Date().toISOString(),
          pinned: false
        });
      }
    }

    writeDB(db);

    res.json({
      success: true,
      message: pointsAwarded
        ? `Task completed! +${task.rewardPoints} points awarded to ${awardedContestantNames.join(', ')}.`
        : `Task updated to ${task.status}.`,
      data: task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    const index = db.tasks.findIndex(t => t.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const removed = db.tasks.splice(index, 1)[0];
    writeDB(db);

    res.json({
      success: true,
      message: `Task "${removed.title}" deleted.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
