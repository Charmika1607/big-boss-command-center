import React, { useState, useEffect } from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle,
  AlertOctagon,
  Shield,
  Crown,
  Coins,
  Users,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Scale,
  Target,
  Zap
} from 'lucide-react';
import { ContestantAnalytics, OverviewAnalytics, Contestant } from '../types';
import { api } from '../services/api';

export const AnalyticsView: React.FC = () => {
  const {
    activeContestants,
    contestants,
    tasks,
    pointLogs,
    overviewAnalytics,
    analyticsLoading,
    refreshAnalytics,
    currentUser
  } = useCommandCenter();

  // Filters
  const [selectedContestantId, setSelectedContestantId] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'today' | '7d' | '30d' | 'all'>('all');

  // Head-to-head comparison contestants
  const [compContestantA, setCompContestantA] = useState<string>(activeContestants[0]?.id || 'c-aarav');
  const [compContestantB, setCompContestantB] = useState<string>(activeContestants[1]?.id || 'c-meera');

  // Individual contestant analytics state
  const [individualData, setIndividualData] = useState<ContestantAnalytics | null>(null);
  const [indivLoading, setIndivLoading] = useState<boolean>(false);

  // If logged-in user is a contestant, default to their profile or allow selecting all
  useEffect(() => {
    if (currentUser.role === 'contestant' && currentUser.contestantId && selectedContestantId === 'all') {
      setSelectedContestantId(currentUser.contestantId);
    }
  }, [currentUser]);

  // Fetch individual contestant data when selected
  useEffect(() => {
    if (selectedContestantId !== 'all') {
      setIndivLoading(true);
      api.getContestantAnalytics(selectedContestantId)
        .then(data => setIndividualData(data))
        .catch(err => console.error('Failed to load contestant analytics:', err))
        .finally(() => setIndivLoading(false));
    } else {
      setIndividualData(null);
    }
  }, [selectedContestantId, pointLogs, tasks]);

  // Fallback calculation if overviewAnalytics not yet loaded
  const activeList = activeContestants.length > 0 ? activeContestants : contestants.filter(c => c.status !== 'Evicted');
  const totalHousePoints = activeList.reduce((acc, c) => acc + (c.points || 0), 0);
  const avgHousePoints = activeList.length > 0 ? Math.round(totalHousePoints / activeList.length) : 0;
  const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  // Filter point logs based on time filter
  const getFilteredLogs = () => {
    const now = Date.now();
    return pointLogs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      if (timeFilter === 'today') return now - logTime <= 86400000;
      if (timeFilter === '7d') return now - logTime <= 86400000 * 7;
      if (timeFilter === '30d') return now - logTime <= 86400000 * 30;
      return true;
    });
  };

  const filteredPointLogs = getFilteredLogs();
  const meritsTotal = filteredPointLogs.filter(l => l.amount > 0).reduce((s, l) => s + l.amount, 0);
  const demeritsTotal = filteredPointLogs.filter(l => l.amount < 0).reduce((s, l) => s + Math.abs(l.amount), 0);

  // Top contestants sorted
  const sortedContestants = [...activeList].sort((a, b) => b.points - a.points);

  // Contestant objects for head-to-head comparison
  const contestantA = contestants.find(c => c.id === compContestantA) || activeList[0];
  const contestantB = contestants.find(c => c.id === compContestantB) || activeList[1] || activeList[0];

  const getContestantTaskStats = (cId: string) => {
    const assigned = tasks.filter(t => (t.assignedContestantIds || []).includes(cId));
    const completed = assigned.filter(t => t.status === 'Completed').length;
    const rate = assigned.length > 0 ? Math.round((completed / assigned.length) * 100) : 0;
    return { assignedCount: assigned.length, completedCount: completed, rate };
  };

  const statsA = contestantA ? getContestantTaskStats(contestantA.id) : { assignedCount: 0, completedCount: 0, rate: 0 };
  const statsB = contestantB ? getContestantTaskStats(contestantB.id) : { assignedCount: 0, completedCount: 0, rate: 0 };

  return (
    <div className="w-full space-y-6">
      {/* Header & Filter Controls Bar */}
      <div className="bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-5 backdrop-blur-md shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 text-white shadow-lg shadow-amber-500/20 border border-amber-500/40">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-wide uppercase font-orbitron text-zinc-900 dark:text-white">
                  PERFORMANCE ANALYTICS HUB
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase font-orbitron bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400">
                  REAL-TIME METRICS
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Dynamic statistical intelligence computed live from house tasks, point audits, nominations and leadership records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refreshAnalytics()}
              disabled={analyticsLoading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${analyticsLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          {/* Contestant Selector */}
          <div className="md:col-span-7">
            <label className="block text-[10px] font-black uppercase font-orbitron text-zinc-400 mb-1.5">
              ANALYTICS FOCUS / CONTESTANT:
            </label>
            <select
              value={selectedContestantId}
              onChange={(e) => setSelectedContestantId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="all">🏆 All Housemates (Whole House Overview)</option>
              {contestants.map((c) => (
                <option key={c.id} value={c.id}>
                  👤 {c.name} ({c.team} Team • {c.points} pts • {c.status})
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Filter */}
          <div className="md:col-span-5">
            <label className="block text-[10px] font-black uppercase font-orbitron text-zinc-400 mb-1.5">
              TIME WINDOW:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'today', label: 'Today' },
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
                { id: 'all', label: 'All Time' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeFilter(t.id as any)}
                  className={`py-2 rounded-xl text-xs font-bold font-orbitron transition-all ${
                    timeFilter === t.id
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: INDIVIDUAL CONTESTANT DEEP DIVE */}
      {selectedContestantId !== 'all' && individualData && (
        <div className="space-y-6">
          {/* Contestant Profile Banner */}
          <div className="bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-5 backdrop-blur-md shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={individualData.contestant.avatar}
                  alt={individualData.contestant.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500/40 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-black font-orbitron text-zinc-900 dark:text-white">
                      {individualData.contestant.name}
                    </h3>
                    <span className="text-[10px] font-bold uppercase font-orbitron px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400">
                      RANK #{individualData.currentRank}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      Team {individualData.contestant.team}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-600/10 text-red-600 dark:text-red-400 border border-red-500/20 font-orbitron">
                      {individualData.performanceTier}
                    </span>
                    {individualData.contestant.isCaptain && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center gap-1 font-orbitron">
                        <Crown className="w-3.5 h-3.5" /> House Captain
                      </span>
                    )}
                    {individualData.contestant.isImmune && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-orbitron">
                        <Shield className="w-3.5 h-3.5" /> Immune
                      </span>
                    )}
                    {individualData.contestant.isNominated && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-red-600 text-white flex items-center gap-1 font-orbitron animate-pulse">
                        <AlertOctagon className="w-3.5 h-3.5" /> In Danger Zone
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Performance Composite Score */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 to-red-500/10 border border-amber-500/20">
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase font-orbitron text-zinc-400">
                    PERFORMANCE INDEX
                  </div>
                  <div className="text-2xl font-black font-orbitron text-amber-500">
                    {individualData.performanceScore}/100
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black font-orbitron text-lg shadow-md">
                  {individualData.performanceScore >= 80 ? 'A+' : individualData.performanceScore >= 65 ? 'B' : 'C'}
                </div>
              </div>
            </div>
          </div>

          {/* 4 Key KPI Cards for Contestant */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Points */}
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md shadow-xs">
              <div className="text-[10px] font-black uppercase font-orbitron text-zinc-400 mb-1">
                TOTAL POINTS
              </div>
              <div className="text-2xl font-black font-orbitron text-zinc-900 dark:text-white">
                {individualData.totalPoints} PTS
              </div>
              <div className="text-[11px] text-emerald-500 font-semibold mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{individualData.pointsGained} earned
              </div>
            </div>

            {/* Task Completion Rate */}
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md shadow-xs">
              <div className="text-[10px] font-black uppercase font-orbitron text-zinc-400 mb-1">
                CHALLENGE WIN RATE
              </div>
              <div className="text-2xl font-black font-orbitron text-blue-500">
                {individualData.taskCompletionRate}%
              </div>
              <div className="text-[11px] text-zinc-400 font-semibold mt-1">
                {individualData.tasksCompleted} / {individualData.tasksAssigned} completed
              </div>
            </div>

            {/* Penalties Deducted */}
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md shadow-xs">
              <div className="text-[10px] font-black uppercase font-orbitron text-zinc-400 mb-1">
                DEMERITS DEDUCTED
              </div>
              <div className="text-2xl font-black font-orbitron text-rose-500">
                -{individualData.pointsLost} PTS
              </div>
              <div className="text-[11px] text-zinc-400 font-semibold mt-1">
                Net Point Delta: +{individualData.netPoints}
              </div>
            </div>

            {/* Danger Zone Record */}
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md shadow-xs">
              <div className="text-[10px] font-black uppercase font-orbitron text-zinc-400 mb-1">
                SURVIVAL RECORD
              </div>
              <div className="text-2xl font-black font-orbitron text-amber-500">
                {individualData.nominationCount} AT RISK
              </div>
              <div className="text-[11px] text-zinc-400 font-semibold mt-1 flex items-center gap-2">
                <span>🛡 {individualData.immunityCount} Immune</span>
                <span>👑 {individualData.captaincyCount} Cap</span>
              </div>
            </div>
          </div>

          {/* Points Timeline Visual Curve */}
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <h3 className="font-orbitron font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white">
                  POINTS PROGRESSION TIMELINE
                </h3>
              </div>
              <span className="text-[10px] text-zinc-400 font-orbitron">
                CUMULATIVE SCORE TRAJECTORY
              </span>
            </div>

            {/* SVG Trend Line */}
            {individualData.pointsTrend.length > 1 ? (
              <div className="w-full h-44 flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                  <defs>
                    <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {(() => {
                    const pts = individualData.pointsTrend;
                    const max = Math.max(...pts.map(p => p.cumulative), 50);
                    const min = Math.min(...pts.map(p => p.cumulative), 0);
                    const range = max - min || 1;
                    const stepX = 500 / (pts.length - 1 || 1);

                    const coordinates = pts.map((p, i) => {
                      const x = i * stepX;
                      const y = 140 - ((p.cumulative - min) / range) * 120;
                      return { x, y, ...p };
                    });

                    const pathD = coordinates.reduce((acc, c, idx) =>
                      idx === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`, '');

                    const areaD = `${pathD} L 500 150 L 0 150 Z`;

                    return (
                      <>
                        <path d={areaD} fill="url(#curveGradient)" />
                        <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                        {coordinates.map((c, i) => (
                          <g key={i}>
                            <circle cx={c.x} cy={c.y} r="5" fill="#f59e0b" className="stroke-white dark:stroke-zinc-950 stroke-2" />
                            <text
                              x={c.x}
                              y={c.y - 10}
                              textAnchor="middle"
                              className="text-[9px] fill-zinc-500 dark:fill-zinc-400 font-orbitron font-bold"
                            >
                              {c.cumulative}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-zinc-400">
                Limited historical data points to plot continuous trajectory.
              </div>
            )}
          </div>

          {/* Assigned Tasks for this Contestant */}
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md shadow-sm">
            <h3 className="font-orbitron font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white mb-3">
              ASSIGNED CHALLENGES & COMPLIANCE
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {individualData.assignedTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200">
                      {t.title}
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-rajdhani">
                      Deadline: {t.deadline}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-orbitron text-amber-500">
                      +{t.rewardPoints} PTS
                    </span>
                    <span className={`text-[9px] font-bold uppercase font-orbitron px-2 py-0.5 rounded-md ${
                      t.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-500'
                        : t.status === 'In Progress'
                        ? 'bg-blue-500/20 text-blue-500'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
              {individualData.assignedTasks.length === 0 && (
                <div className="col-span-2 text-center py-6 text-zinc-400 text-xs">
                  No individual challenges currently assigned.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: WHOLE HOUSE OVERVIEW ANALYTICS */}
      {selectedContestantId === 'all' && (
        <div className="space-y-6">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Points */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-[10px] font-black uppercase font-orbitron">HOUSE MERIT POOL</span>
                <Coins className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-orbitron text-zinc-900 dark:text-white">
                {totalHousePoints} PTS
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                Average {avgHousePoints} pts / active contestant
              </div>
            </div>

            {/* Task Completion Rate */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-[10px] font-black uppercase font-orbitron">TASK COMPLETION</span>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-orbitron text-emerald-500">
                {taskCompletionRate}%
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                {completedTasksCount} of {tasks.length} challenges finished
              </div>
            </div>

            {/* Points Flow */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-[10px] font-black uppercase font-orbitron">MERITS VS PENALTIES</span>
                <Scale className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-orbitron text-zinc-900 dark:text-white flex items-center gap-2">
                <span className="text-emerald-500">+{meritsTotal}</span>
                <span className="text-zinc-400 text-sm">/</span>
                <span className="text-rose-500">-{demeritsTotal}</span>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                Net House Flow: +{meritsTotal - demeritsTotal} pts
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-[10px] font-black uppercase font-orbitron">DANGER ZONE RISK</span>
                <AlertOctagon className="w-4 h-4 text-red-500 animate-pulse" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-orbitron text-red-500">
                {activeList.filter(c => c.isNominated).length} NOMINEES
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                {activeList.filter(c => c.isImmune).length} contestants protected
              </div>
            </div>
          </div>

          {/* Visual Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Points Distribution & Ranking Gap */}
            <div className="p-5 rounded-3xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                  <h3 className="font-orbitron font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white">
                    LEADERBOARD RANKING SPREAD
                  </h3>
                </div>
                <span className="text-[10px] text-zinc-400 font-orbitron">POINTS COMPARISON</span>
              </div>

              <div className="space-y-3">
                {sortedContestants.slice(0, 6).map((c, idx) => {
                  const maxPts = sortedContestants[0]?.points || 150;
                  const pct = Math.round((c.points / maxPts) * 100);

                  return (
                    <div key={c.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                          <span className="text-zinc-400 text-[10px] font-orbitron">#{idx + 1}</span>
                          {c.name}
                        </span>
                        <span className="font-orbitron font-bold text-amber-500">
                          {c.points} PTS
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 2: Team Performance Share */}
            <div className="p-5 rounded-3xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <h3 className="font-orbitron font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white">
                    TEAM POWER RATINGS
                  </h3>
                </div>
                <span className="text-[10px] text-zinc-400 font-orbitron">AGGREGATE POINTS</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {['Gold', 'Red', 'Blue', 'Green'].map((teamName) => {
                  const teamMembers = activeList.filter(c => c.team === teamName);
                  const teamPoints = teamMembers.reduce((s, c) => s + c.points, 0);
                  const teamAvg = teamMembers.length > 0 ? Math.round(teamPoints / teamMembers.length) : 0;

                  const colorMap: Record<string, string> = {
                    Gold: 'border-amber-500/30 text-amber-500 bg-amber-500/5',
                    Red: 'border-red-500/30 text-red-500 bg-red-500/5',
                    Blue: 'border-blue-500/30 text-blue-500 bg-blue-500/5',
                    Green: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
                  };

                  return (
                    <div
                      key={teamName}
                      className={`p-3.5 rounded-2xl border ${colorMap[teamName] || ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-orbitron font-bold text-xs uppercase">{teamName}</span>
                        <span className="text-[10px] text-zinc-400">{teamMembers.length} Active</span>
                      </div>
                      <div className="text-xl font-black font-orbitron">
                        {teamPoints} PTS
                      </div>
                      <div className="text-[10px] text-zinc-400 font-rajdhani mt-1">
                        Avg: {teamAvg} pts / player
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* HEAD-TO-HEAD CONTESTANT COMPARISON TOOL */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-red-500" />
                <h3 className="font-orbitron font-black text-sm uppercase tracking-wider text-zinc-900 dark:text-white">
                  HEAD-TO-HEAD CONTESTANT COMPARISON
                </h3>
              </div>
              <span className="text-xs text-zinc-400 font-rajdhani">
                Compare duelists across merit scores, challenge completion, and survival history
              </span>
            </div>

            {/* Selectors Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[10px] font-black uppercase font-orbitron text-zinc-400 mb-1.5">
                  CONTESTANT A:
                </label>
                <select
                  value={compContestantA}
                  onChange={(e) => setCompContestantA(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                >
                  {activeList.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.points} pts)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase font-orbitron text-zinc-400 mb-1.5">
                  CONTESTANT B:
                </label>
                <select
                  value={compContestantB}
                  onChange={(e) => setCompContestantB(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                >
                  {activeList.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.points} pts)</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Visual Comparison Card */}
            {contestantA && contestantB && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-zinc-50 dark:bg-zinc-950/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                {/* Contestant A Card */}
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center text-center">
                  <img
                    src={contestantA.avatar}
                    alt={contestantA.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-red-500/40 mb-2"
                  />
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{contestantA.name}</h4>
                  <span className="text-[10px] font-semibold text-zinc-400">{contestantA.team} Team</span>
                  <div className="text-xl font-black font-orbitron text-amber-500 mt-2">
                    {contestantA.points} PTS
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    Win Rate: {statsA.rate}%
                  </div>
                </div>

                {/* VS Center Meter */}
                <div className="space-y-4 px-2">
                  <div className="text-center">
                    <span className="px-3 py-1 rounded-full text-xs font-black font-orbitron bg-red-600 text-white shadow-md">
                      VS
                    </span>
                  </div>

                  {/* Points Comparison Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold font-orbitron mb-1 text-zinc-400">
                      <span>{contestantA.points}</span>
                      <span>POINTS GAP: {Math.abs(contestantA.points - contestantB.points)}</span>
                      <span>{contestantB.points}</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 flex overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${(contestantA.points / (contestantA.points + contestantB.points || 1)) * 100}%` }}
                      />
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${(contestantB.points / (contestantA.points + contestantB.points || 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Task Completion Comparison */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold font-orbitron mb-1 text-zinc-400">
                      <span>{statsA.completedCount} done</span>
                      <span>CHALLENGES</span>
                      <span>{statsB.completedCount} done</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 flex overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${statsA.rate}%` }}
                      />
                      <div
                        className="h-full bg-purple-500 transition-all duration-300"
                        style={{ width: `${statsB.rate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Contestant B Card */}
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center text-center">
                  <img
                    src={contestantB.avatar}
                    alt={contestantB.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/40 mb-2"
                  />
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{contestantB.name}</h4>
                  <span className="text-[10px] font-semibold text-zinc-400">{contestantB.team} Team</span>
                  <div className="text-xl font-black font-orbitron text-blue-500 mt-2">
                    {contestantB.points} PTS
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    Win Rate: {statsB.rate}%
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
