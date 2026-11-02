/**
 * Calculates current streak and longest streak from an array of completion dates (YYYY-MM-DD).
 */
export class StreakCalculator {
  static calculate(completionDates = [], todayDate) {
    if (!completionDates || completionDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0, totalCompletions: 0 };
    }

    // Sort unique dates descending: newest first
    const uniqueDates = Array.from(new Set(completionDates)).sort().reverse();
    const totalCompletions = uniqueDates.length;

    const today = new Date(todayDate);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Determine if current streak is active (completed today OR completed yesterday)
    let currentStreak = 0;
    const mostRecentDate = uniqueDates[0];

    if (mostRecentDate === todayStr || mostRecentDate === yesterdayStr) {
      let expectedDate = new Date(mostRecentDate);
      for (const dateStr of uniqueDates) {
        const currentDate = new Date(dateStr);
        const diffTime = expectedDate.getTime() - currentDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

        if (diffDays === 0) {
          currentStreak++;
          expectedDate.setDate(expectedDate.getDate() - 1);
        } else {
          break; // Streak broken
        }
      }
    }

    // Calculate Longest Streak in history
    let longestStreak = 0;
    let tempStreak = 0;
    const ascendingDates = [...uniqueDates].reverse();

    for (let i = 0; i < ascendingDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(ascendingDates[i - 1]);
        const curr = new Date(ascendingDates[i]);
        const diffTime = curr.getTime() - prev.getTime();
        const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    }

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      totalCompletions,
    };
  }
}