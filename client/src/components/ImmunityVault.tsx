import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import {
  ShieldAlert,
  Shield,
  ShieldCheck,
  Plus,
  Lock,
  UserCheck,
  AlertOctagon,
  Sparkles
} from 'lucide-react';

export const ImmunityVault: React.FC = () => {
  const { activeContestants, removeImmunity, openModal, currentUser } = useCommandCenter();

  const immuneContestants = activeContestants.filter((c) => c.isImmune);

  return (
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide uppercase font-orbitron text-zinc-900 dark:text-white">
                IMMUNITY VAULT & PROTECTION PROTOCOLS
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Immune housemates possess an impenetrable shield preventing all Danger Zone nominations.
              </p>
            </div>
          </div>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => openModal('immunity')}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-orbitron uppercase bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 transition-all hover:scale-[1.02] shrink-0"
            >
              <Plus className="w-4 h-4" />
              Grant Immunity Shield
            </button>
          )}
        </div>
      </div>

      {/* Critical Rule Proclamation Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-teal-500/10 border-2 border-teal-500/30 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-teal-500 text-white shrink-0 mt-0.5">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-orbitron font-bold text-sm text-teal-700 dark:text-teal-300 uppercase">
            IMMUNITY RULE CONSTITUTION (RULE 3)
          </h4>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">
            Any housemate possessing the Immunity Shield is completely protected. They <strong className="text-teal-600 dark:text-teal-400 font-bold">CANNOT BE NOMINATED</strong> in the Danger Zone. The nomination selector disables immune contestants automatically, and the backend Express core rejects unauthorized nomination attempts with HTTP 400.
          </p>
        </div>
      </div>

      {/* Immune Contestants Grid */}
      <div>
        <div className="text-xs font-black uppercase font-orbitron tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-500" />
          CURRENTLY SHIELDED HOUSEMATES ({immuneContestants.length})
        </div>

        {immuneContestants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {immuneContestants.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border-2 border-teal-500/40 bg-teal-500/5 dark:bg-teal-950/20 p-5 backdrop-blur-md shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-teal-500 shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-teal-500 text-white">
                          <Shield className="w-3.5 h-3.5 fill-white" />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                          {c.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30">
                            {c.team} Team
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-600 text-white font-orbitron">
                            🛡 IMMUNE
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black font-orbitron text-teal-600 dark:text-teal-400">
                        {c.points}
                      </span>
                      <div className="text-[9px] uppercase font-bold text-zinc-400 font-orbitron">
                        PTS
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                    {c.bio || 'Shield secured through challenge accomplishment.'}
                  </p>
                </div>

                {currentUser.role === 'admin' ? (
                  <div className="pt-3 border-t border-teal-500/20">
                    <button
                      onClick={() => removeImmunity(c.id)}
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold font-orbitron uppercase bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-500/30 transition-colors"
                    >
                      Strip Immunity Shield
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 text-center text-[10px] text-teal-600 dark:text-teal-400 font-orbitron">
                    IMMUNITY ACTIVE • DANGER PROTECTED
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center rounded-2xl bg-white/60 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-zinc-400">
            <Shield className="w-10 h-10 mx-auto mb-2 opacity-40 text-teal-500" />
            <p className="font-semibold text-sm">No housemates currently possess the Immunity Shield.</p>
          </div>
        )}
      </div>
    </div>
  );
};
