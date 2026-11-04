import React, { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  Sparkles,
  Trash2,
  X,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function GoalsView({ habits = [], analytics = {} }) {
  const { toast, showConfirm } = useToast();
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('streakup_custom_goals');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'goal-1',
        title: '30-Day Fitness Consistency',
        category: 'fitness',
        targetDays: 30,
        currentDays: Math.min(30, analytics.totalCompletions || 12),
        period: 'Monthly',
        deadline: 'End of Month',
        completed: false,
      },
      {
        id: 'goal-2',
        title: 'Zero Negative Habit Relapse',
        category: 'health',
        targetDays: 14,
        currentDays: Math.min(14, analytics.currentStreak || 6),
        period: 'Bi-Weekly',
        deadline: 'Nov 14, 2026',
        completed: false,
      },
      {
        id: 'goal-3',
        title: 'Daily Mindfulness & Learning',
        category: 'learning',
        targetDays: 21,
        currentDays: Math.min(21, analytics.totalCompletions || 9),
        period: 'Monthly',
        deadline: 'Nov 25, 2026',
        completed: false,
      },
    ];
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState(15);
  const [newPeriod, setNewPeriod] = useState('Monthly');
  const [newCategory, setNewCategory] = useState('fitness');

  useEffect(() => {
    localStorage.setItem('streakup_custom_goals', JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newGoal = {
      id: `goal_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      targetDays: Number(newTarget) || 10,
      currentDays: 0,
      period: newPeriod,
      deadline: newPeriod === 'Weekly' ? 'End of Week' : 'End of Month',
      completed: false,
    };

    setGoals([newGoal, ...goals]);
    toast.success(`Milestone "${newTitle.trim()}" created! 🎯`);
    setNewTitle('');
    setNewTarget(15);
    setModalOpen(false);
  };

  const handleDeleteGoal = (id, goalTitle) => {
    showConfirm({
      title: 'Remove Goal?',
      message: `Are you sure you want to delete "${goalTitle || 'this milestone'}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDestructive: true,
      onConfirm: () => {
        setGoals((prev) => prev.filter((g) => g.id !== id));
        toast.info('Milestone goal removed.');
      },
    });
  };

  const handleIncrement = (id) => {
    setGoals(
      goals.map((g) => {
        if (g.id !== id) return g;
        const nextCount = Math.min(g.targetDays, g.currentDays + 1);
        const isNowDone = nextCount >= g.targetDays;
        if (isNowDone && !g.completed) {
          toast.success(`🏆 Milestone Achieved: ${g.title}! Outstanding consistency!`);
        } else {
          toast.info(`Logged 1 day for "${g.title}" (${nextCount}/${g.targetDays})`);
        }
        return {
          ...g,
          currentDays: nextCount,
          completed: isNowDone,
        };
      })
    );
  };

  const completedCount = goals.filter((g) => g.completed || g.currentDays >= g.targetDays).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-white/10 backdrop-blur-md">
              <Target className="w-5 h-5 text-yellow-300" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Personal Milestones
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Target Goals & Milestones
          </h1>
          <p className="text-blue-100/90 text-sm mt-1 max-w-xl">
            Set ambitious targets, track your execution progress, and earn consistency badges as you build unbreakable habits.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Set New Goal</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Total Goals</span>
            <Target className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{goals.length}</p>
          <span className="text-[11px] text-slate-400 font-medium">Active trackers</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Achieved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{completedCount}</p>
          <span className="text-[11px] text-emerald-600/80 font-medium">Completed milestones</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Longest Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-500">{analytics.longestStreak || 0} Days</p>
          <span className="text-[11px] text-slate-400 font-medium">Best consistency record</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Success Rate</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-indigo-600">
            {goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0}%
          </p>
          <span className="text-[11px] text-slate-400 font-medium">Target completion ratio</span>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {goals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.currentDays / goal.targetDays) * 100));
          const isDone = goal.completed || goal.currentDays >= goal.targetDays;

          return (
            <div
              key={goal.id}
              className={`rounded-3xl p-6 border transition-all ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-white border-slate-100 shadow-sm hover:border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    {isDone ? <Award className="w-6 h-6" /> : <Target className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{goal.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px]">
                        {goal.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {goal.deadline}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteGoal(goal.id, goal.title)}
                  className="text-slate-300 hover:text-rose-500 p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                  title="Remove goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500">Progress</span>
                  <span className={isDone ? 'text-emerald-600' : 'text-blue-600'}>
                    {goal.currentDays} / {goal.targetDays} Days ({percent}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Actions & Status */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100/80">
                {isDone ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Goal Achieved! 🏆
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">
                    {goal.targetDays - goal.currentDays} days remaining
                  </span>
                )}

                {!isDone && (
                  <button
                    onClick={() => handleIncrement(goal.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log 1 Day</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg text-slate-900">Set New Milestone</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                  Goal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. 25 Workouts in November"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                    Target Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none"
                  >
                    <option value="fitness">Fitness</option>
                    <option value="health">Health</option>
                    <option value="productivity">Productivity</option>
                    <option value="learning">Learning</option>
                    <option value="mindfulness">Mindfulness</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1E40AF] hover:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-sm"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
