import axios from 'axios';
import { Streak } from '../models/Streak.js';
import { StreakCalculator } from './streakCalculator.js';

export class AnalyticsService {
  // Helper to fetch data from Habit Service via REST
  static async fetchHabitData(userId, authToken) {
    const habitServiceUrl = process.env.HABIT_SERVICE_URL || 'http://localhost:5002';
    const headers = {
      'x-user-id': userId,
      ...(authToken ? { Authorization: authToken } : {}),
    };

    const [habitsRes, completionsRes] = await Promise.all([
      axios.get(`${habitServiceUrl}/api/habits`, { headers }),
      axios.get(`${habitServiceUrl}/api/habits/completions`, { headers }),
    ]);

    return {
      habits: habitsRes.data.data.all || [],
      todayMetrics: habitsRes.data.data.metrics || {},
      completions: completionsRes.data.data || [],
    };
  }

  // Dashboard Overview Summary (Matches UI top 4 KPI cards and right column stats)
  static async getSummary(userId, todayDate, authToken) {
    const { habits, todayMetrics, completions } = await this.fetchHabitData(userId, authToken);

    // Group completions by habitId
    const completionsByHabit = {};
    completions.forEach((c) => {
      const hId = c.habitId.toString();
      if (!completionsByHabit[hId]) completionsByHabit[hId] = [];
      completionsByHabit[hId].push(c.date);
    });

    let maxCurrentStreak = 0;
    let maxLongestStreak = 0;

    // Calculate streaks for each habit and track maximums
    for (const habit of habits) {
      const dates = completionsByHabit[habit._id.toString()] || [];
      const streakInfo = StreakCalculator.calculate(dates, todayDate);

      if (streakInfo.currentStreak > maxCurrentStreak) {
        maxCurrentStreak = streakInfo.currentStreak;
      }
      if (streakInfo.longestStreak > maxLongestStreak) {
        maxLongestStreak = streakInfo.longestStreak;
      }

      // Upsert into local Analytics DB for fast projections
      await Streak.findOneAndUpdate(
        { userId, habitId: habit._id.toString() },
        {
          currentStreak: streakInfo.currentStreak,
          longestStreak: streakInfo.longestStreak,
          totalCompletions: streakInfo.totalCompletions,
          lastCompletedDate: dates[0] || null,
        },
        { upsert: true, new: true }
      );
    }

    return {
      // Top 4 KPI Cards
      todayProgress: todayMetrics.progressPercentage || 0,
      activeHabits: todayMetrics.totalActive || habits.length,
      completedToday: todayMetrics.completedToday || 0,
      leftToday: todayMetrics.leftToday || 0,

      // Right column "Habit Progress Over Time" stats
      currentStreak: maxCurrentStreak,
      longestStreak: maxLongestStreak,
      totalCompletions: completions.length,
    };
  }

  // Generate trend curves for the Weekly/Monthly chart
  static async getTrends(userId, range = 'weekly', todayDate, authToken) {
    const { habits, completions } = await this.fetchHabitData(userId, authToken);
    const daysCount = range === 'monthly' ? 30 : 7;

    const dataPoints = [];
    const today = new Date(todayDate);

    // Count completions per date
    const dateCountMap = {};
    completions.forEach((c) => {
      dateCountMap[c.date] = (dateCountMap[c.date] || 0) + 1;
    });

    // Generate points for the past N days
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

      const completedOnDay = dateCountMap[dateStr] || 0;
      const rate = habits.length > 0 ? Math.min(100, Math.round((completedOnDay / habits.length) * 100)) : 0;

      dataPoints.push({
        date: dateStr,
        day: dayLabel,
        completionRate: rate,
        // Secondary curve for positive consistency trend line
        positiveTrend: Math.max(0, Math.min(100, Math.round(rate * 0.85 + (i % 2 === 0 ? 5 : -5)))),
      });
    }

    return {
      range,
      dataPoints,
    };
  }
}