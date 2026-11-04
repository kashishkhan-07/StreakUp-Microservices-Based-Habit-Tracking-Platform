import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarWidget({ selectedDate, onDateSelect, completionDates = [] }) {
  const [viewDate, setViewDate] = useState(new Date());

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth(); // 0 = Jan, 11 = Dec

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Calculate days in month and starting day
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  const emptyDays = Array(firstDayIndex).fill(null);
  const monthDays = Array.from({ length: totalDays }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Format date helper: YYYY-MM-DD
  const formatDateString = (day) => {
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${currentYear}-${m}-${d}`;
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={handlePrevMonth}
          className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="font-bold text-slate-800 text-sm sm:text-base">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 text-center mb-2.5">
        {daysOfWeek.map((day, idx) => {
          const isTodayDay = new Date().getDay() === idx;
          return (
            <span
              key={day}
              className={`text-[11px] font-bold ${isTodayDay ? 'text-blue-600' : 'text-slate-400'}`}
            >
              {day}
            </span>
          );
        })}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-semibold">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {monthDays.map((day) => {
          const dateStr = formatDateString(day);
          const isSelected = selectedDate === dateStr;
          const isToday = todayStr === dateStr;
          const hasCompletions = completionDates.includes(dateStr);

          return (
            <div key={day} className="flex flex-col items-center justify-center">
              <button
                onClick={() => onDateSelect && onDateSelect(dateStr)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all relative ${
                  isSelected
                    ? 'bg-[#1E40AF] text-white shadow-sm font-bold'
                    : isToday
                    ? 'bg-blue-50 text-blue-600 font-bold ring-1 ring-blue-300'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {day}
              </button>

              {/* Green dot for days with completions */}
              <div className="h-1 mt-0.5">
                {hasCompletions && (
                  <span className={`block w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}