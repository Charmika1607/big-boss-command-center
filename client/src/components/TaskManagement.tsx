import React, { useState } from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import {
  CheckSquare,
  Plus,
  Play,
  CheckCircle,
  Clock,
  Trash2,
  Trophy,
  Users,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { TaskStatus } from '../types';

export const TaskManagement: React.FC = () => {
  const { tasks, updateTaskStatus, deleteTask, openModal } = useCommandCenter();
  const [filter, setFilter] = useState<string>('All');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'All') return true;
    return t.status === filter;
  });

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'In Progress':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 animate-pulse';
      case 'Pending':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/30">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide uppercase font-orbitron text-zinc-900 dark:text-white">
                HOUSE TASKS & CHALLENGES
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Commission challenges, assign housemates, track lifecycle, and award merit points upon completion.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="All">All Challenges</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <button
              onClick={() => openModal('create-task')}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-orbitron uppercase bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] shrink-0"
            >
              <Plus className="w-4 h-4" />
              + New Task
            </button>
          </div>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => {
          const isCompleted = task.status === 'Completed';

          return (
            <div
              key={task.id}
              className={`rounded-2xl border p-5 backdrop-blur-md transition-all duration-200 flex flex-col justify-between ${
                isCompleted
                  ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/30'
                  : task.status === 'In Progress'
                  ? 'bg-blue-500/5 dark:bg-blue-950/20 border-blue-500/40 shadow-sm'
                  : 'bg-white/80 dark:bg-zinc-900/70 border-zinc-200 dark:border-zinc-800/80 shadow-sm'
              }`}
            >
              <div>
                {/* Status + Reward */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-black uppercase font-orbitron px-2.5 py-1 rounded-lg border ${getStatusBadge(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-black font-orbitron">
                    <Trophy className="w-3.5 h-3.5" />
                    +{task.rewardPoints} PTS
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-base text-zinc-900 dark:text-white mb-1.5 leading-snug">
                  {task.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
                  {task.description}
                </p>

                {/* Assigned Contestants Avatars */}
                <div className="mb-4 pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
                  <div className="text-[10px] font-black uppercase font-orbitron text-zinc-400 mb-2 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    ASSIGNED HOUSEMATES:
                  </div>

                  {task.assignedContestants && task.assignedContestants.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {task.assignedContestants.map((assignee) => (
                        <div
                          key={assignee.id}
                          className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                        >
                          <img
                            src={assignee.avatar}
                            alt={assignee.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">
                            {assignee.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-400 italic">
                      All Housemates participating
                    </span>
                  )}
                </div>

                {/* Deadline & Created At */}
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-4 font-rajdhani">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    Target: {task.deadline}
                  </span>
                  {task.completedAt && (
                    <span className="text-emerald-500 font-bold">
                      Completed: {new Date(task.completedAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Status transition controls */}
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center gap-2">
                {task.status === 'Pending' && (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'In Progress')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold font-orbitron uppercase bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-600/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Start Task
                  </button>
                )}

                {task.status === 'In Progress' && (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'Completed')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold font-orbitron uppercase bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle className="w-3.5 h-3.5 fill-white" />
                    Complete & Award +{task.rewardPoints}
                  </button>
                )}

                {isCompleted && (
                  <div className="flex-1 text-center py-2 px-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-orbitron font-bold text-xs border border-emerald-500/20">
                    ✓ Task Completed & Points Awarded
                  </div>
                )}

                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Purge Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-white/60 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-zinc-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="font-semibold text-sm">No tasks found under selected filter.</p>
        </div>
      )}
    </div>
  );
};
