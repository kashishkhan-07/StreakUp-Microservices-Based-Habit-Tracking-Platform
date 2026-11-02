import React, { useState } from 'react';
import { Flame, Trophy, CheckCircle } from 'lucide-react';

export default function ProgressChart({ analytics = {} }) {
  const [timeframe, setTimeframe] = useState('weekly');

  const {
    currentStreak = 25,
    longestStreak = 62,
    totalCompletions = 15,
  } = analytics;

  const days = ['THU', 'FRI', 'SAT', 'SUN', 'MON', 'TUE', 'WED'];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 mb-4">Habit Progress Over Time</h3>

      <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-slate-50 rounded-xl mb-5">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-blue-600 font-bold text-sm">
            <Flame className="w-4 h-4" />
            <span>{currentStreak} days</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Current streak</span>
        </div>

        <div className="text-center border-x border-slate-200">
          <div className="flex items-center justify-center gap-1.5 text-blue-600 font-bold text-sm">
            <Trophy className="w-4 h-4" />
            <span>{longestStreak} days</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Longest streak ever</span>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-blue-600 font-bold text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>{totalCompletions}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Completed in total</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <select className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none">
          <option>All Progress</option>
          <option>Health</option>
          <option>Fitness</option>
        </select>

        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold text-slate-500">
          {['Weekly', 'Monthly', 'Yearly'].map((item) => (
            <button
              key={item}
              onClick={() => setTimeframe(item.toLowerCase())}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeframe === item.toLowerCase()
                  ? 'bg-[#1E40AF] text-white shadow-sm'
                  : 'hover:text-slate-800'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-44 w-full">
        <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[10px] text-slate-400 font-medium pb-5">
          <span>100%</span>
          <span>80%</span>
          <span>60%</span>
          <span>40%</span>
          <span>20%</span>
          <span>0%</span>
        </div>

        <div className="ml-8 h-full flex flex-col justify-between">
          <svg className="w-full h-32 overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="500" y2="0" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="60" x2="500" y2="60" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="90" x2="500" y2="90" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="120" x2="500" y2="120" stroke="#F1F5F9" strokeWidth="1" />

            <path
              d="M 0 110 C 100 80, 200 65, 300 95 C 400 115, 450 60, 500 60"
              fill="none"
              stroke="#A78BFA"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            <path
              d="M 0 115 C 100 110, 250 110, 350 15 C 400 -5, 450 40, 500 65"
              fill="none"
              stroke="#34D399"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-2 border-t border-slate-100">
            {days.map((d) => (
              <span key={d} className={d === 'WED' ? 'text-blue-600 font-bold' : ''}>
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}