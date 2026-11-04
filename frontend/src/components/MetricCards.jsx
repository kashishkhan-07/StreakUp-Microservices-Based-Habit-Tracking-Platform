import React from 'react';
import { PieChart, Zap, CheckCircle2, Hourglass } from 'lucide-react';

export default function MetricCards({ metrics = {} }) {
  const todayProgress = metrics.todayProgress ?? metrics.progressPercentage ?? 0;
  const activeHabits = metrics.activeHabits ?? metrics.totalActive ?? 0;
  const completedToday = metrics.completedToday ?? 0;
  const leftToday = metrics.leftToday ?? Math.max(0, activeHabits - completedToday);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* 1. Today's Progress */}
      <div className="bg-[#E9F0FE] rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 border border-blue-100 shadow-sm transition hover:shadow-md">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
          <PieChart className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight truncate">
            {todayProgress}%
          </h3>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-0.5 truncate">
            Today's Progress
          </p>
        </div>
      </div>

      {/* 2. Active Habits */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 border border-slate-100 shadow-sm transition hover:shadow-md">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-blue-600 stroke-[1.5]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight truncate">
            {activeHabits}
          </h3>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5 truncate">
            Active Habits
          </p>
        </div>
      </div>

      {/* 3. Completed */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 border border-slate-100 shadow-sm transition hover:shadow-md">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight truncate">
            {completedToday}
          </h3>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5 truncate">
            Completed
          </p>
        </div>
      </div>

      {/* 4. Left Today */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 border border-slate-100 shadow-sm transition hover:shadow-md">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          <Hourglass className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight truncate">
            {leftToday}
          </h3>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5 truncate">
            Left Today
          </p>
        </div>
      </div>
    </div>
  );
}