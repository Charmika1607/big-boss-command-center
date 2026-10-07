import React, { useState, useEffect } from 'react';
import { useCommandCenter } from '../../context/CommandCenterContext';
import {
  X,
  UserPlus,
  Coins,
  PlusCircle,
  AlertOctagon,
  ShieldAlert,
  Shield,
  Crown,
  Megaphone,
  UserX,
  AlertTriangle,
  Check
} from 'lucide-react';
import { Team, AnnouncementType } from '../../types';

export const AllModals: React.FC = () => {
  const {
    activeModal,
    modalPayload,
    closeModal,
    activeContestants,
    createContestant,
    adjustPoints,
    createTask,
    nominateContestant,
    grantImmunity,
    removeImmunity,
    assignCaptain,
    makeAnnouncement,
    evictContestant,
    currentCaptain
  } = useCommandCenter();

  // 1. Add Contestant State
  const [newCName, setNewCName] = useState('');
  const [newCTeam, setNewCTeam] = useState<Team>('Gold');
  const [newCPoints, setNewCPoints] = useState(50);
  const [newCBio, setNewCBio] = useState('');

  // 2. Adjust Points State
  const [adjContestantId, setAdjContestantId] = useState('');
  const [adjAmount, setAdjAmount] = useState<number>(10);
  const [adjDirection, setAdjDirection] = useState<'add' | 'deduct'>('add');
  const [adjReason, setAdjReason] = useState('');

  // 3. Create Task State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskReward, setTaskReward] = useState<number>(20);
  const [taskDeadline, setTaskDeadline] = useState('Day 18 - 20:00');
  const [assignedIds, setAssignedIds] = useState<string[]>([]);

  // 4. Nominate State
  const [nomContestantId, setNomContestantId] = useState('');
  const [nomReason, setNomReason] = useState('');

  // 5. Immunity State
  const [immContestantId, setImmContestantId] = useState('');

  // 6. Captain State
  const [capContestantId, setCapContestantId] = useState('');

  // 7. Announcement State
  const [annMessage, setAnnMessage] = useState('');
  const [annType, setAnnType] = useState<AnnouncementType>('general');

  // 8. Eviction State
  const [evictTargetId, setEvictTargetId] = useState('');
  const [evictReason, setEvictReason] = useState('Audience elimination vote tally.');

  // Pre-fill from modalPayload
  useEffect(() => {
    if (!activeModal) return;

    if (activeModal === 'adjust-points') {
      if (modalPayload?.contestantId) setAdjContestantId(modalPayload.contestantId);
      else if (activeContestants.length > 0) setAdjContestantId(activeContestants[0].id);
      if (modalPayload?.direction) setAdjDirection(modalPayload.direction);
      setAdjReason(modalPayload?.direction === 'deduct' ? 'Demerit for rule violation' : 'Bonus for exceptional task execution');
      setAdjAmount(10);
    }

    if (activeModal === 'nominate') {
      if (modalPayload?.contestantId) setNomContestantId(modalPayload.contestantId);
      else {
        // pick first non-immune contestant
        const nominatable = activeContestants.filter(c => !c.isImmune);
        if (nominatable.length > 0) setNomContestantId(nominatable[0].id);
      }
      setNomReason('Direct nomination by Big Boss authority.');
    }

    if (activeModal === 'immunity') {
      if (modalPayload?.contestantId) setImmContestantId(modalPayload.contestantId);
      else if (activeContestants.length > 0) setImmContestantId(activeContestants[0].id);
    }

    if (activeModal === 'captain') {
      if (modalPayload?.contestantId) setCapContestantId(modalPayload.contestantId);
      else if (activeContestants.length > 0) setCapContestantId(activeContestants[0].id);
    }

    if (activeModal === 'evict') {
      if (modalPayload?.contestantId) setEvictTargetId(modalPayload.contestantId);
      else if (activeContestants.length > 0) setEvictTargetId(activeContestants[0].id);
      setEvictReason('Evicted by Big Boss executive order.');
    }
  }, [activeModal, modalPayload, activeContestants]);

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-7 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. ADD CONTESTANT MODAL */}
        {activeModal === 'add-contestant' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-orbitron font-black text-lg text-zinc-900 dark:text-white uppercase">
                  INDUCT NEW CONTESTANT
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Register an official housemate into the Big Boss compound.
                </p>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newCName.trim()) return;
                await createContestant({
                  name: newCName.trim(),
                  team: newCTeam,
                  points: Number(newCPoints) || 0,
                  bio: newCBio.trim() || undefined
                });
                setNewCName('');
                setNewCBio('');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyanshu Dave"
                  value={newCName}
                  onChange={(e) => setNewCName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                    Team Allocation
                  </label>
                  <select
                    value={newCTeam}
                    onChange={(e) => setNewCTeam(e.target.value as Team)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="Gold">Gold Team</option>
                    <option value="Red">Red Team</option>
                    <option value="Blue">Blue Team</option>
                    <option value="Green">Green Team</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                    Initial Points
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCPoints}
                    onChange={(e) => setNewCPoints(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Housemate Persona / Bio
                </label>
                <textarea
                  rows={2}
                  placeholder="Strategic challenger, endurance champion..."
                  value={newCBio}
                  onChange={(e) => setNewCBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold font-orbitron uppercase bg-red-600 hover:bg-red-700 text-white shadow-lg"
                >
                  Confirm Induction
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 2. ADJUST POINTS MODAL */}
        {activeModal === 'adjust-points' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-orbitron font-black text-lg text-zinc-900 dark:text-white uppercase">
                  MODIFY CONTESTANT POINTS
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Award merit points or levy demerit fines for house rule infractions.
                </p>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!adjContestantId) return;
                const finalAmt = adjDirection === 'deduct' ? -Math.abs(adjAmount) : Math.abs(adjAmount);
                await adjustPoints(adjContestantId, finalAmt, adjReason.trim());
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Select Contestant *
                </label>
                <select
                  required
                  value={adjContestantId}
                  onChange={(e) => setAdjContestantId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                >
                  {activeContestants.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.points} pts - {c.team} Team)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                    Action Type
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setAdjDirection('add')}
                      className={`py-1.5 rounded-lg text-xs font-bold font-orbitron transition-all ${
                        adjDirection === 'add'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                    >
                      + AWARD
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjDirection('deduct')}
                      className={`py-1.5 rounded-lg text-xs font-bold font-orbitron transition-all ${
                        adjDirection === 'deduct'
                          ? 'bg-red-600 text-white shadow'
                          : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                    >
                      - DEDUCT
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                    Point Amount *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    required
                    value={adjAmount}
                    onChange={(e) => setAdjAmount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm font-orbitron font-bold bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Official Justification / Reason *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exceptional performance in physical challenge"
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold font-orbitron uppercase text-white shadow-lg ${
                    adjDirection === 'add' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {adjDirection === 'add' ? `Award +${adjAmount} pts` : `Deduct -${adjAmount} pts`}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. CREATE TASK MODAL */}
        {activeModal === 'create-task' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/30">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-orbitron font-black text-lg text-zinc-900 dark:text-white uppercase">
                  CREATE HOUSE CHALLENGE
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Assign a new task with configured merit rewards and deadlines.
                </p>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!taskTitle.trim()) return;
                await createTask({
                  title: taskTitle.trim(),
                  description: taskDesc.trim(),
                  rewardPoints: Number(taskReward) || 20,
                  deadline: taskDeadline.trim(),
                  assignedContestantIds: assignedIds
                });
                setTaskTitle('');
                setTaskDesc('');
                setAssignedIds([]);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laser Grid Surveillance Run"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Brief Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain instructions and winning conditions..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                    Reward Points
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="200"
                    value={taskReward}
                    onChange={(e) => setTaskReward(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm font-orbitron font-bold bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                    Deadline / Target Time
                  </label>
                  <input
                    type="text"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* Assign Contestants */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Assign Housemates (Select multiple):
                </label>
                <div className="max-h-32 overflow-y-auto p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
                  {activeContestants.map((c) => {
                    const isSelected = assignedIds.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) setAssignedIds((prev) => [...prev, c.id]);
                            else setAssignedIds((prev) => prev.filter((id) => id !== c.id));
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <img src={c.avatar} alt={c.name} className="w-5 h-5 rounded-full object-cover" />
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">{c.name}</span>
                        <span className="text-[10px] text-zinc-400">({c.team})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold font-orbitron uppercase bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                >
                  Publish Task
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4. NOMINATE MODAL */}
        {activeModal === 'nominate' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-red-600/10 text-red-600 border border-red-600/30">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-orbitron font-black text-lg text-red-600 dark:text-red-500 uppercase">
                  NOMINATE FOR DANGER ZONE
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Place an active housemate in the Danger Zone for eviction.
                </p>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!nomContestantId) return;
                await nominateContestant(nomContestantId, nomReason.trim());
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Choose Contestant *
                </label>
                <select
                  required
                  value={nomContestantId}
                  onChange={(e) => setNomContestantId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                >
                  {activeContestants.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                      disabled={c.isImmune}
                      className={c.isImmune ? 'text-zinc-400 bg-zinc-100 dark:bg-zinc-800' : ''}
                    >
                      {c.name} {c.isImmune ? '🛡 (IMMUNE - CANNOT NOMINATE)' : c.isNominated ? '⚠ (ALREADY NOMINATED)' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-amber-500 dark:text-amber-400 mt-1 flex items-center gap-1 font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  MANDATORY RULE: Immune contestants cannot be nominated.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Nomination Grounds / Reason *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Failure to comply with house rationing rules..."
                  value={nomReason}
                  onChange={(e) => setNomReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold font-orbitron uppercase bg-red-600 hover:bg-red-700 text-white shadow-lg"
                >
                  Confirm Nomination
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 5. IMMUNITY MODAL */}
        {activeModal === 'immunity' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-orbitron font-black text-lg text-zinc-900 dark:text-white uppercase">
                  MANAGE IMMUNITY SHIELD
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Grant or revoke complete protection against Danger Zone nominations.
                </p>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!immContestantId) return;
                const target = activeContestants.find(c => c.id === immContestantId);
                if (target?.isImmune) {
                  await removeImmunity(immContestantId);
                } else {
                  await grantImmunity(immContestantId);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Target Contestant *
                </label>
                <select
                  required
                  value={immContestantId}
                  onChange={(e) => setImmContestantId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                >
                  {activeContestants.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.isImmune ? '🛡 Currently Shielded' : 'Unshielded'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400">
                Granting Immunity automatically clears any active nomination on the contestant!
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold font-orbitron uppercase bg-teal-600 hover:bg-teal-700 text-white shadow-lg"
                >
                  {activeContestants.find(c => c.id === immContestantId)?.isImmune ? 'Revoke Immunity' : 'Grant Immunity'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 6. CAPTAIN MODAL */}
        {activeModal === 'captain' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30">
                <Crown className="w-5 h-5 fill-amber-500/20" />
              </div>
              <div>
                <h3 className="font-orbitron font-black text-lg text-zinc-900 dark:text-white uppercase">
                  APPOINT HOUSE CAPTAIN
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Select an active housemate to hold supreme leadership and authority.
                </p>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!capContestantId) return;
                await assignCaptain(capContestantId);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Select New Captain *
                </label>
                <select
                  required
                  value={capContestantId}
                  onChange={(e) => setCapContestantId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                >
                  {activeContestants.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.points} pts - {c.team} Team) {c.isCaptain ? '👑 (Current Captain)' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Rule 4: Only 1 captain can exist at a time. The previous captain automatically reverts.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold font-orbitron uppercase bg-amber-500 hover:bg-amber-600 text-black shadow-lg"
                >
                  Confirm Decree
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 7. ANNOUNCEMENT MODAL */}
        {activeModal === 'announcement' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-orbitron font-black text-lg text-zinc-900 dark:text-white uppercase">
                  BROADCAST PROCLAMATION
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Transmit an instant announcement across all House monitors.
                </p>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!annMessage.trim()) return;
                await makeAnnouncement(annMessage.trim(), annType, true);
                setAnnMessage('');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Transmission Type
                </label>
                <select
                  value={annType}
                  onChange={(e) => setAnnType(e.target.value as AnnouncementType)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="general">📢 General Broadcast</option>
                  <option value="emergency">🚨 Emergency Alert</option>
                  <option value="task">🎯 Task Transmission</option>
                  <option value="nomination">⚠ Danger Zone Announcement</option>
                  <option value="captain">👑 Captaincy Announcement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Decree Message *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Type official Big Boss announcement..."
                  value={annMessage}
                  onChange={(e) => setAnnMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold font-orbitron uppercase bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
                >
                  Broadcast Now
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 8. EVICTION MODAL */}
        {activeModal === 'evict' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-red-600/10 text-red-600 border border-red-600/30">
                <UserX className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-orbitron font-black text-lg text-red-600 dark:text-red-500 uppercase">
                  EXECUTE EVICTION PROTOCOL
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Permanently remove housemate from the active compound.
                </p>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!evictTargetId) return;
                await evictContestant(evictTargetId, evictReason.trim());
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Contestant to Evict *
                </label>
                <select
                  required
                  value={evictTargetId}
                  onChange={(e) => setEvictTargetId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                >
                  {activeContestants.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.points} pts - {c.team} Team)
                    </option>
                  ))}
                </select>
              </div>

              {/* Explicit Mandatory Warning Box */}
              <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-600/40 text-red-200 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-red-400 font-orbitron uppercase text-[11px]">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  MANDATORY EVICTION CONFIRMATION
                </div>
                <p>
                  Are you sure you want to evict{' '}
                  <span className="font-bold text-white">
                    {activeContestants.find(c => c.id === evictTargetId)?.name || 'this contestant'}
                  </span>
                  ? This action will remove the contestant from the active House, strip captaincy and immunity, and remove them from the active leaderboard.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Eviction Reason / Justification
                </label>
                <input
                  type="text"
                  required
                  value={evictReason}
                  onChange={(e) => setEvictReason(e.target.value)}
                  placeholder="e.g. Lowest audience support votes in Week 3"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold font-orbitron uppercase bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/30"
                >
                  Confirm Eviction
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
