import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Check,
  Sparkles,
  Plus,
  Lock,
  Clock,
  Pencil,
  Trash2
} from 'lucide-react';
import HabitIcon from './HabitIcon';

export default function HabitSection({
  title,
  type,
  habits = [],
  onToggle,
  onAddNew,
  onEdit,
  onDelete,
  selectedDate,
  todayStr
}) {
  const [collapsed, setCollapsed] = useState(false);

  // Check if viewing a future date
  const isFutureDate = selectedDate > todayStr;

  // Format creation timestamp: e.g. "03 Nov 2026, 01:15 PM"
  const formatCreationDate = (createdAt) => {
    if (!createdAt) return null;
    const d = new Date(createdAt);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6">
      {/* Section Header */}
      <div
        className="flex items-center justify-between cursor-pointer select-none mb-4"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold">
            {habits.length}
          </span>
          {isFutureDate && (
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
              <Lock className="w-3 h-3" /> Upcoming (Locked)
            </span>
          )}
        </div>
        <button className="text-slate-400 hover:text-slate-600 p-1">
          {collapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
      </div>

      {/* Habit Items or Clean Empty State */}
      {!collapsed && (
        <div className="space-y-3">
          {habits.length === 0 ? (
            <div className="text-center py-7 px-4 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
              <Sparkles className="w-6 h-6 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">
                {type === 'positive'
                  ? 'No positive habits yet.'
                  : 'No negative habits to avoid yet.'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Click "+ Add new" below to track your first routine.
              </p>
            </div>
          ) : (
            habits.map((habit) => {
              const isCompleted = habit.isCompletedToday;
              const formattedCreated = formatCreationDate(habit.createdAt);

              return (
                <div
                  key={habit._id || habit.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCompleted
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : isFutureDate
                      ? 'border-slate-100 bg-slate-50/50 opacity-80'
                      : type === 'negative'
                      ? 'border-purple-100 bg-purple-50/15 hover:border-purple-200'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isFutureDate
                          ? 'bg-slate-100 text-slate-400'
                          : type === 'negative'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        <HabitIcon
                          icon={habit.icon}
                          title={habit.title}
                          type={type}
                          className="w-5 h-5"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{habit.title}</h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>{habit.frequency?.type === 'weekly' ? '3x per week' : 'Daily'}</span>
                          <span>•</span>
                          <span>{habit.streak || 0}-day streak</span>
                          <span className="capitalize px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[10px] font-semibold">
                            {habit.category || 'health'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Completion Action or Lock Icon */}
                    {isFutureDate ? (
                      <div
                        title="Upcoming date locked. Complete on the day of!"
                        className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 cursor-not-allowed"
                      >
                        <Lock className="w-4 h-4" />
                      </div>
                    ) : (
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
                    )}
                  </div>

                  {/* 🕒 Creation Date & Time Badge + Edit & Delete Buttons */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <span>{formattedCreated ? `Created on ${formattedCreated}` : 'Active routine'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(habit);
                          }}
                          title="Edit habit"
                          className="flex items-center gap-1 px-2 py-0.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-md transition"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(habit._id || habit.id, habit.title);
                          }}
                          title="Delete habit"
                          className="flex items-center gap-1 px-2 py-0.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-md transition"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Add New Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => onAddNew(type)}
              className="bg-[#1E40AF] hover:bg-[#1A3699] text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm transition active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add new</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
