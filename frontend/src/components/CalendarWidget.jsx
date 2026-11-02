import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarWidget({ onDateSelect }) {
  const [selectedDate, setSelectedDate] = useState(17);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const emptyDays = Array(5).fill(null);
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <button className="p-1 text-slate-400 hover:text-slate-600">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-bold text-slate-800 text-base">August 2025</h3>
        <button className="p-1 text-slate-400 hover:text-slate-600">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center mb-3">
        {daysOfWeek.map((day) => (
          <span
            key={day}
            className={`text-xs font-semibold ${day === 'WED' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-3 text-center text-sm font-medium">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {calendarDays.map((day) => {
          const isSelected = day === selectedDate;
          return (
            <button
              key={day}
              onClick={() => {
                setSelectedDate(day);
                if (onDateSelect) onDateSelect(day);
              }}
              className={`w-9 h-9 mx-auto rounded-xl flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-blue-50 text-blue-600 font-bold shadow-sm ring-1 ring-blue-200'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}