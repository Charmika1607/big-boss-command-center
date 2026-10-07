import React, { useState } from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import {
  Megaphone,
  Send,
  Pin,
  Radio,
  Clock,
  Trash2,
  AlertTriangle,
  Award,
  Crown,
  UserX
} from 'lucide-react';
import { AnnouncementType } from '../types';

export const AnnouncementsView: React.FC = () => {
  const { announcements, makeAnnouncement, currentUser } = useCommandCenter();
  const [message, setMessage] = useState('');
  const [type, setType] = useState<AnnouncementType>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    const success = await makeAnnouncement(message.trim(), type, true);
    setIsSubmitting(false);

    if (success) {
      setMessage('');
    }
  };

  const getTypeBadge = (annType: AnnouncementType) => {
    switch (annType) {
      case 'emergency':
        return 'bg-red-600 text-white';
      case 'eviction':
        return 'bg-rose-900/60 text-rose-300 border border-rose-500/40';
      case 'captain':
        return 'bg-amber-500/20 text-amber-500 border border-amber-500/30';
      case 'nomination':
        return 'bg-red-500/20 text-red-500 border border-red-500/30';
      case 'task':
        return 'bg-blue-500/20 text-blue-500 border border-blue-500/30';
      default:
        return 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Broadcast Command Console (Admin Only) */}
      {currentUser.role === 'admin' ? (
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/70 p-6 sm:p-7 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase font-orbitron tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                TRANSMISSION & BROADCAST CONSOLE
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Transmit official Big Boss proclamations live to all House monitors, bedrooms, and garden speakers.
              </p>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-500 uppercase font-orbitron">
                  CHANNEL:
                </span>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AnnouncementType)}
                  className="px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:ring-2 focus:ring-purple-500"
                >
                  <option value="general">📢 General Proclamation</option>
                  <option value="emergency">🚨 Emergency Alert</option>
                  <option value="task">🎯 Task Briefing</option>
                  <option value="nomination">⚠ Danger Zone Notice</option>
                  <option value="captain">👑 Captaincy Decree</option>
                  <option value="eviction">🚪 Eviction Order</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type official decree: 'Housemates, assemble immediately in the living area for the luxury budget task...'"
                className="w-full p-4 rounded-2xl text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                Broadcast is logged in official house archive.
              </span>

              <button
                type="submit"
                disabled={!message.trim() || isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold font-orbitron uppercase tracking-wider bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Transmitting...' : 'MAKE ANNOUNCEMENT'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/70 p-5 backdrop-blur-xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-sm text-zinc-900 dark:text-white uppercase">
                OFFICIAL TRANSMISSION CHANNEL
              </h3>
              <p className="text-xs text-zinc-400 font-rajdhani">
                Receiving live executive broadcasts from Big Boss Core
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black font-orbitron bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            RECEIVER ACTIVE
          </span>
        </div>
      )}

      {/* Broadcast Archive & History Panel */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/70 p-6 backdrop-blur-xl shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 font-orbitron font-bold text-sm tracking-wide uppercase text-zinc-900 dark:text-white">
            <Clock className="w-4 h-4 text-purple-500" />
            TRANSMISSION LOG HISTORY ({announcements.length})
          </div>
        </div>

        <div className="space-y-3">
          {announcements.map((ann, idx) => (
            <div
              key={ann.id || idx}
              className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800/80 hover:border-purple-500/40 transition-colors flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-black uppercase font-orbitron px-2 py-0.5 rounded-md ${getTypeBadge(
                      ann.type
                    )}`}
                  >
                    {ann.type}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-rajdhani">
                    {new Date(ann.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                    {new Date(ann.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <p className="text-sm text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed">
                  "{ann.message}"
                </p>
              </div>
            </div>
          ))}

          {announcements.length === 0 && (
            <div className="py-8 text-center text-zinc-400 text-xs">
              No announcements broadcasted yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
