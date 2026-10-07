import { readDB } from '../database/db.js';

// GET /api/analytics/overview
export const getOverviewAnalytics = (req, res) => {
  try {
    const db = readDB();
    const contestants = db.contestants || [];
    const tasks = db.tasks || [];
    const pointLogs = db.pointLogs || [];
    const activities = db.activities || [];
    const evictions = db.evictions || [];

    const activeList = contestants.filter(c => c.status !== 'Evicted');
    const evictedList = contestants.filter(c => c.status === 'Evicted');

    // Points calculations
    const totalPoints = activeList.reduce((acc, c) => acc + (c.points || 0), 0);
    const averagePoints = activeList.length > 0 ? Math.round(totalPoints / activeList.length) : 0;

    let pointsGainedTotal = 0;
    let pointsDeductedTotal = 0;
    pointLogs.forEach(log => {
      if (log.amount > 0) pointsGainedTotal += log.amount;
      else pointsDeductedTotal += Math.abs(log.amount);
    });

    // Task calculations
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const totalRewardsAwarded = tasks
      .filter(t => t.status === 'Completed')
      .reduce((sum, t) => sum + (t.rewardPoints || 0), 0);

    // Team analytics
    const teams = ['Gold', 'Red', 'Blue', 'Green'];
    const teamStats = teams.map(teamName => {
      const members = activeList.filter(c => c.team === teamName);
      const teamTotalPoints = members.reduce((sum, c) => sum + (c.points || 0), 0);
      const teamAvg = members.length > 0 ? Math.round(teamTotalPoints / members.length) : 0;
      const sortedMembers = [...members].sort((a, b) => b.points - a.points);
      return {
        team: teamName,
        activeCount: members.length,
        totalPoints: teamTotalPoints,
        averagePoints: teamAvg,
        topScorer: sortedMembers[0] ? { name: sortedMembers[0].name, points: sortedMembers[0].points } : null
      };
    });

    // Top performers
    const sortedActive = [...activeList].sort((a, b) => b.points - a.points);
    const topPerformers = sortedActive.slice(0, 5).map((c, idx) => ({
      rank: idx + 1,
      id: c.id,
      name: c.name,
      team: c.team,
      avatar: c.avatar,
      points: c.points,
      status: c.status,
      isCaptain: c.isCaptain,
      isImmune: c.isImmune
    }));

    // Timeline of points from point logs
    const pointsTimeline = [...pointLogs]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(log => ({
        timestamp: log.timestamp,
        contestantName: log.contestantName,
        amount: log.amount,
        reason: log.reason
      }));

    // Nomination frequency per contestant from activities & current status
    const nominationCounts = {};
    activeList.forEach(c => {
      nominationCounts[c.id] = { id: c.id, name: c.name, team: c.team, count: c.isNominated ? 1 : 0 };
    });
    activities.forEach(act => {
      if (act.action === 'NOMINATION_CREATED' && act.targetId && nominationCounts[act.targetId]) {
        nominationCounts[act.targetId].count += 1;
      }
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalContestants: contestants.length,
          activeContestants: activeList.length,
          evictedContestants: evictedList.length,
          totalPoints,
          averagePoints,
          pointsGainedTotal,
          pointsDeductedTotal,
          netPoints: pointsGainedTotal - pointsDeductedTotal
        },
        taskAnalytics: {
          totalTasks,
          completedTasks,
          inProgressTasks,
          pendingTasks,
          taskCompletionRate,
          totalRewardsAwarded
        },
        teamPerformance: teamStats,
        topPerformers,
        nominationFrequencies: Object.values(nominationCounts),
        pointsTimeline: pointsTimeline.slice(-15)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/contestants/:id
export const getContestantAnalytics = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    const contestants = db.contestants || [];
    const tasks = db.tasks || [];
    const pointLogs = db.pointLogs || [];
    const activities = db.activities || [];

    const contestant = contestants.find(c => c.id === id);
    if (!contestant) {
      return res.status(404).json({ success: false, message: 'Contestant not found.' });
    }

    // Rank among active contestants
    const activeContestants = contestants.filter(c => c.status !== 'Evicted');
    const sorted = [...activeContestants].sort((a, b) => b.points - a.points);
    const rankIndex = sorted.findIndex(c => c.id === contestant.id);
    const currentRank = rankIndex !== -1 ? rankIndex + 1 : (contestant.status === 'Evicted' ? contestants.length : '-');

    // Points breakdown
    const cLogs = pointLogs.filter(l => l.contestantId === contestant.id);
    let pointsGained = 0;
    let pointsLost = 0;
    cLogs.forEach(l => {
      if (l.amount > 0) pointsGained += l.amount;
      else pointsLost += Math.abs(l.amount);
    });

    // Task breakdown
    const assignedTasks = tasks.filter(t => (t.assignedContestantIds || []).includes(contestant.id));
    const completedTasks = assignedTasks.filter(t => t.status === 'Completed').length;
    const inProgressTasks = assignedTasks.filter(t => t.status === 'In Progress').length;
    const pendingTasks = assignedTasks.filter(t => t.status === 'Pending').length;
    const taskCompletionRate = assignedTasks.length > 0
      ? Math.round((completedTasks / assignedTasks.length) * 100)
      : 100;

    // Nomination count
    let nominationCount = contestant.isNominated ? 1 : 0;
    activities.forEach(a => {
      if (a.action === 'NOMINATION_CREATED' && (a.targetId === contestant.id || a.description?.includes(contestant.name))) {
        nominationCount += 1;
      }
    });

    // Immunity count
    let immunityCount = contestant.isImmune ? 1 : 0;
    activities.forEach(a => {
      if (a.action === 'IMMUNITY_GRANTED' && (a.targetId === contestant.id || a.description?.includes(contestant.name))) {
        immunityCount += 1;
      }
    });

    // Captaincy count
    let captaincyCount = contestant.isCaptain ? 1 : 0;
    activities.forEach(a => {
      if (a.action === 'CAPTAIN_ASSIGNED' && (a.targetId === contestant.id || a.description?.includes(contestant.name))) {
        captaincyCount += 1;
      }
    });

    // Calculate overall performance rating (0 to 100)
    const maxPoints = sorted[0]?.points || 150;
    const pointsRatio = Math.min(1, Math.max(0, contestant.points / (maxPoints || 1)));
    const completionRatio = taskCompletionRate / 100;
    const immunityBonus = Math.min(10, immunityCount * 5);
    const nominationPenalty = Math.min(15, nominationCount * 5);

    let rawScore = (pointsRatio * 50) + (completionRatio * 35) + immunityBonus - nominationPenalty + 15;
    const performanceScore = Math.min(100, Math.max(10, Math.round(rawScore)));

    let performanceTier = 'Average Housemate';
    if (performanceScore >= 85) performanceTier = 'Alpha Leader';
    else if (performanceScore >= 70) performanceTier = 'Strong Contender';
    else if (performanceScore < 45) performanceTier = 'Danger Risk';

    // Cumulative points trend for this contestant
    let cumulative = 0;
    const sortedLogs = [...cLogs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const pointsTrend = sortedLogs.map(l => {
      cumulative += l.amount;
      return {
        timestamp: l.timestamp,
        amount: l.amount,
        cumulative,
        reason: l.reason
      };
    });

    res.json({
      success: true,
      data: {
        contestant: {
          id: contestant.id,
          name: contestant.name,
          avatar: contestant.avatar,
          team: contestant.team,
          points: contestant.points,
          status: contestant.status,
          isCaptain: contestant.isCaptain,
          isImmune: contestant.isImmune,
          isNominated: contestant.isNominated,
          bio: contestant.bio
        },
        currentRank,
        totalPoints: contestant.points,
        pointsGained,
        pointsLost,
        netPoints: pointsGained - pointsLost,
        tasksAssigned: assignedTasks.length,
        tasksCompleted: completedTasks,
        tasksInProgress: inProgressTasks,
        tasksPending: pendingTasks,
        taskCompletionRate,
        nominationCount,
        immunityCount,
        captaincyCount,
        performanceScore,
        performanceTier,
        pointsTrend,
        recentLogs: cLogs.slice(0, 10),
        assignedTasks: assignedTasks.map(t => ({
          id: t.id,
          title: t.title,
          rewardPoints: t.rewardPoints,
          status: t.status,
          deadline: t.deadline
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/points
export const getPointsAnalytics = (req, res) => {
  try {
    const db = readDB();
    const pointLogs = db.pointLogs || [];
    const contestants = db.contestants || [];

    const merits = pointLogs.filter(l => l.amount > 0);
    const demerits = pointLogs.filter(l => l.amount < 0);

    const meritsTotal = merits.reduce((s, l) => s + l.amount, 0);
    const demeritsTotal = demerits.reduce((s, l) => s + Math.abs(l.amount), 0);

    res.json({
      success: true,
      data: {
        totalTransactions: pointLogs.length,
        meritsCount: merits.length,
        demeritsCount: demerits.length,
        meritsTotal,
        demeritsTotal,
        recentMerits: merits.slice(0, 5),
        recentDemerits: demerits.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/tasks
export const getTasksAnalytics = (req, res) => {
  try {
    const db = readDB();
    const tasks = db.tasks || [];

    const completed = tasks.filter(t => t.status === 'Completed');
    const inProgress = tasks.filter(t => t.status === 'In Progress');
    const pending = tasks.filter(t => t.status === 'Pending');

    const totalRewardAvailable = tasks.reduce((s, t) => s + (t.rewardPoints || 0), 0);
    const rewardAwarded = completed.reduce((s, t) => s + (t.rewardPoints || 0), 0);

    res.json({
      success: true,
      data: {
        total: tasks.length,
        completedCount: completed.length,
        inProgressCount: inProgress.length,
        pendingCount: pending.length,
        completionRate: tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0,
        totalRewardAvailable,
        rewardAwarded
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
