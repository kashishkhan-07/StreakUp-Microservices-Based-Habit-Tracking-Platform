import React, { useState, useEffect } from 'react';
import { Flame, Trophy, CheckCircle } from 'lucide-react';
import api from '../api/client';

export default function ProgressChart({ analytics = {} }) {
  const [timeframe, setTimeframe] = useState('weekly');
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    currentStreak = 0,
    longestStreak = 0,
    totalCompletions = 0,
  } = analytics;

  // Fetch real completion curve from Analytics Service
  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/analytics/trends?range=${timeframe}`);
        if (res.data?.data?.dataPoints) {
          setTrendData(res.data.data.dataPoints);
        }
      } catch (err) {
        // Fallback default 7 days if offline
        const fallbackDays = ['THU', 'FRI', 'SAT', 'SUN', 'MON', 'TUE', 'WED'];
        setTrendData(fallbackDays.map((d) => ({ day: d, completionRate: 0, positiveTrend: 0 })));
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [timeframe, totalCompletions]);

  // Generate smooth SVG Bezier curve path from dataPoints
  const generateSvgPath = (points, key = 'completionRate', width = 500, height = 120) => {
    if (!points || points.length === 0) return `M 0 ${height} L ${width} ${height}`;

    const step = width / (points.length - 1 || 1);
    const coords = points.map((p, i) => {
      const val = Math.min(100, Math.max(0, p[key] || 0));
      // Invert Y axis: 100% is top (y=10), 0% is bottom (y=height-10)
      const y = height - 10 - (val / 100) * (height - 20);
      return { x: i * step, y };
    });

    if (coords.length === 1) return `M 0 ${coords[0].y} L ${width} ${coords[0].y}`;

    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      path += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const primaryCurve = generateSvgPath(trendData, 'completionRate', 500, 120);
  const secondaryCurve = generateSvgPath(trendData, 'positiveTrend', 500, 120);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 mb-4">Habit Progress Over Time</h3>

      {/* Mini Streak Metrics */}
      <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-slate-50/70 rounded-2xl mb-5 border border-slate-100">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-blue-600 font-bold text-sm">
            <Flame className="w-4 h-4 fill-blue-600" />
            <span>{currentStreak} days</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Current streak</span>
        </div>

        <div className="text-center border-x border-slate-200">
          <div className="flex items-center justify-center gap-1.5 text-blue-600 font-bold text-sm">
            <Trophy className="w-4 h-4" />
            <span>{longestStreak} days</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Longest streak</span>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-blue-600 font-bold text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>{totalCompletions}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Total completed</span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
          Consistency Trend
        </span>

        <div className="flex bg-slate-100/80 p-1 rounded-xl gap-1 text-xs font-semibold text-slate-500">
          {['Weekly', 'Monthly'].map((item) => (
            <button
              key={item}
              onClick={() => setTimeframe(item.toLowerCase())}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeframe === item.toLowerCase()
                  ? 'bg-[#1E40AF] text-white shadow-sm font-bold'
                  : 'hover:text-slate-800'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Wave Chart */}
      <div className="relative h-44 w-full">
        {/* Y Axis */}
        <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[10px] text-slate-400 font-semibold pb-5">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>

        {/* SVG Drawing */}
        <div className="ml-8 h-full flex flex-col justify-between">
          <svg className="w-full h-32 overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="0" y1="10" x2="500" y2="10" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="37" x2="500" y2="37" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="65" x2="500" y2="65" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="92" x2="500" y2="92" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="115" x2="500" y2="115" stroke="#F1F5F9" strokeWidth="1" />

            {/* Secondary trend curve (Purple) */}
            <path
              d={secondaryCurve}
              fill="none"
              stroke="#A78BFA"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-500"
            />

            {/* Primary completion curve (Teal/Emerald) */}
            <path
              d={primaryCurve}
              fill="none"
              stroke="#34D399"
              strokeWidth="3"
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>

          {/* X Axis Day Labels */}
          <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-2 border-t border-slate-100">
            {trendData.map((d, i) => (
              <span key={i} className={i === trendData.length - 1 ? 'text-blue-600 font-bold' : ''}>
                {d.day}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}