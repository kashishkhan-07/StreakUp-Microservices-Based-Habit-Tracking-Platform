/**
 * Canonical Event Contracts for StreakUp
 */

export const EXCHANGES = {
  HABIT_EVENTS: 'streakup.events',
};

export const ROUTING_KEYS = {
  HABIT_COMPLETED: 'habit.completed.v1',
  HABIT_CREATED: 'habit.created.v1',
};

export const QUEUES = {
  ANALYTICS_HABIT_COMPLETED: 'analytics.habit-completed',
  NOTIFICATIONS_HABIT_COMPLETED: 'notifications.habit-completed',
};

export const createHabitCompletedEvent = ({
  completionId,
  habitId,
  userId,
  date,
  habitTitle = 'Habit',
  habitCategory = 'General',
  totalCompletedToday = 1,
  habitTotalCompletions = 1,
  streak = 1,
}) => ({
  eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  eventType: ROUTING_KEYS.HABIT_COMPLETED,
  timestamp: new Date().toISOString(),
  payload: {
    completionId,
    habitId,
    userId,
    date,
    habitTitle,
    habitCategory,
    totalCompletedToday,
    habitTotalCompletions,
    streak,
  },
});

export const createHabitCreatedEvent = ({
  habitId,
  userId,
  habitTitle,
  habitCategory = 'General',
  frequency = 'daily',
}) => ({
  eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  eventType: ROUTING_KEYS.HABIT_CREATED,
  timestamp: new Date().toISOString(),
  payload: {
    habitId,
    userId,
    habitTitle,
    habitCategory,
    frequency,
  },
});