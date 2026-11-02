import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Check, GlassWater, BookOpen, Dumbbell, Ban, WineOff } from 'lucide-react';

const iconMap = {
  water: GlassWater,
  book: BookOpen,
  workout: Dumbbell,
  smoke: Ban,
  drink: WineOff,
};

export default function HabitSection({ title, type, habits = [], onToggle, onAddNew }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
      <div
        className="flex items-center justify-between cursor-pointer select-none mb-4"
        onClick={() => setCollapsed(!collapsed)}
      >
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <button className="text-slate-400 hover:text-slate-600 p-1">
          {collapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
      </div>

      {!collapsed && (
        <div className="space-y-3">
          {habits.map((habit) => {
            const IconComponent = iconMap[habit.icon] || (type === 'negative' ? Ban : GlassWater);
            const isCompleted = habit.isCompletedToday;

            return (
              <div
                key={habit._id || habit.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : type === 'negative'
                    ? 'border-purple-100 bg-purple-50/10 hover:border-purple-200'
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    type === 'negative'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{habit.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span>{habit.frequency?.type === 'weekly' ? '3x per week' : 'Daily 5/7'}</span>
                      <span>•</span>
                      <span>{habit.streak || 7}-day streak</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onToggle(habit._id || habit.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-400 text-white shadow-sm'
                      : 'border-2 border-slate-200 hover:border-blue-400'
                  }`}
                >
                  {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                </button>
              </div>
            );
          })}

          <div className="flex justify-end pt-2">
            <button
              onClick={() => onAddNew(type)}
              className="bg-[#1E40AF] hover:bg-[#1A3699] text-white px-5 py-2 rounded-xl text-sm font-medium shadow-sm transition active:scale-95 flex items-center gap-1.5"
            >
              <span>+ Add new</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}