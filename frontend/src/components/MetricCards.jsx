import React from 'react';
import { PieChart, Zap, CheckCircle2, Hourglass } from 'lucide-react';

export default function MetricCards({ metrics = {} }) {
  const {
    todayProgress = 40,
    activeHabits = 5,
    completedToday = 2,
    leftToday = 3,
  } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Today's Progress */}
      <div className="bg-[#E9F0FE] rounded-2xl p-5 flex items-center gap-4 border border-blue-100 shadow-sm transition hover:shadow-md">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-sm">
          <PieChart className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900 leading-tight">{todayProgress}%</h3>
          <p className="text-xs font-medium text-slate-600 mt-0.5">Today's Progress</p>
        </div>
      </div>

      {/* 2. Active Habits */}
      <div className="bg-white rounded-2xl p-5 flex items-center gap-4 border border-slate-100 shadow-sm transition hover:shadow-md">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <Zap className="w-6 h-6 fill-blue-600 stroke-[1.5]" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900 leading-tight">{activeHabits}</h3>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Active Habits</p>
        </div>
      </div>

      {/* 3. Completed */}
      <div className="bg-white rounded-2xl p-5 flex items-center gap-4 border border-slate-100 shadow-sm transition hover:shadow-md">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <CheckCircle2 className="w-6 h-6 stroke-[2]" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900 leading-tight">{completedToday}</h3>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Completed</p>
        </div>
      </div>

      {/* 4. Left Today */}
      <div className="bg-white rounded-2xl p-5 flex items-center gap-4 border border-slate-100 shadow-sm transition hover:shadow-md">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <Hourglass className="w-6 h-6 stroke-[2]" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900 leading-tight">{leftToday}</h3>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Left Today</p>
        </div>
      </div>
    </div>
  );
}