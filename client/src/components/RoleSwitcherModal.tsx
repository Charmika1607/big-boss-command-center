import React, { useState } from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import {
  ShieldAlert,
  UserCheck,
  Eye,
  Crown,
  Check,
  X,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    switchUserRole,
    activeContestants
  } = useCommandCenter();

  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [selectedContestantId, setSelectedContestantId] = useState<string>(
    currentUser.contestantId || (activeContestants[0]?.id || 'c-aarav')
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleApply = async () => {
    setIsSubmitting(true);
    await switchUserRole(selectedRole, selectedRole === 'contestant' ? selectedContestantId : undefined);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 relative flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-600/10 text-red-600 dark:text-red-400 border border-red-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-wide uppercase font-orbitron text-zinc-900 dark:text-white">
                ROLE & ACCESS CONTROL
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-rajdhani">
                Switch active operator permissions & portal vantage point
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles Grid */}
        <div className="space-y-3">
          {/* 1. Admin */}
          <div
            onClick={() => setSelectedRole('admin')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              selectedRole === 'admin'
                ? 'border-red-600 bg-red-600/10 ring-2 ring-red-500/20 shadow-md'
                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${
              selectedRole === 'admin' ? 'bg-red-600 text-white shadow-sm' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
            }`}>
              <Crown className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-orbitron font-bold text-sm text-zinc-900 dark:text-white">
                  ADMIN / BIG BOSS
                </span>
                {selectedRole === 'admin' && (
                  <span className="p-1 rounded-full bg-red-600 text-white">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Full executive house authority. Induct contestants, award/deduct points, commission tasks, enforce nominations, grant immunity, assign captaincy, and evict.
              </p>
            </div>
          </div>

          {/* 2. Contestant */}
          <div
            onClick={() => setSelectedRole('contestant')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              selectedRole === 'contestant'
                ? 'border-blue-600 bg-blue-600/10 ring-2 ring-blue-500/20 shadow-md'
                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${
              selectedRole === 'contestant' ? 'bg-blue-600 text-white shadow-sm' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
            }`}>
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-orbitron font-bold text-sm text-zinc-900 dark:text-white">
                  HOUSE MEMBER / CONTESTANT
                </span>
                {selectedRole === 'contestant' && (
                  <span className="p-1 rounded-full bg-blue-600 text-white">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Contestant portal access. View own profile & points, track leaderboard, view assigned tasks & mark own tasks completed, view performance analytics.
              </p>

              {/* Sub-selector for which contestant */}
              {selectedRole === 'contestant' && (
                <div className="mt-3 pt-3 border-t border-blue-500/20">
                  <label className="block text-[11px] font-bold font-orbitron uppercase text-blue-600 dark:text-blue-400 mb-1.5">
                    Select Housemate Identity:
                  </label>
                  <select
                    value={selectedContestantId}
                    onChange={(e) => setSelectedContestantId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {activeContestants.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.team} Team - {c.points} pts - {c.status})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* 3. Viewer */}
          <div
            onClick={() => setSelectedRole('viewer')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              selectedRole === 'viewer'
                ? 'border-purple-600 bg-purple-600/10 ring-2 ring-purple-500/20 shadow-md'
                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${
              selectedRole === 'viewer' ? 'bg-purple-600 text-white shadow-sm' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
            }`}>
              <Eye className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-orbitron font-bold text-sm text-zinc-900 dark:text-white">
                  PUBLIC VIEWER / SPECTATOR
                </span>
                {selectedRole === 'viewer' && (
                  <span className="p-1 rounded-full bg-purple-600 text-white">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Read-only public audience stream. View live leaderboard, housemates roster, broadcasts, and public statistics. Data modification is restricted.
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Permissions are strictly validated by backend authorization on all API requests.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-xs font-bold font-orbitron uppercase bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isSubmitting ? 'Switching...' : 'Switch Active Role'}
          </button>
        </div>
      </div>
    </div>
  );
};
