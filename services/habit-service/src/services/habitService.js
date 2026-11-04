import { Habit } from '../models/Habit.js';
import { Completion } from '../models/Completion.js';
import { publishEvent } from '../events/rabbitMQPublisher.js';
import { createHabitCompletedEvent, ROUTING_KEYS } from '../../../../shared/event-contracts/habitEvents.js';

export class HabitService {
  // Get all active habits for a user, enriched with completion status
  static async getUserHabitsWithTodayStatus(userId, todayDate) {
    const habits = await Habit.find({ userId, isArchived: false }).sort({ createdAt: -1 });

    // Fetch completions for this user on the requested date
    const todayCompletions = await Completion.find({
      userId,
      date: todayDate,
    });

    const completedHabitIds = new Set(todayCompletions.map((c) => c.habitId.toString()));

    const positiveHabits = [];
    const negativeHabits = [];

    habits.forEach((habit) => {
      const habitObj = habit.toObject();
      habitObj.isCompletedToday = completedHabitIds.has(habit._id.toString());

      if (habit.type === 'negative') {
        negativeHabits.push(habitObj);
      } else {
        positiveHabits.push(habitObj);
      }
    });

    return {
      all: habits,
      positiveHabits,
      negativeHabits,
      metrics: {
        totalActive: habits.length,
        completedToday: todayCompletions.length,
        leftToday: Math.max(0, habits.length - todayCompletions.length),
        progressPercentage:
          habits.length > 0
            ? Math.round((todayCompletions.length / habits.length) * 100)
            : 0,
      },
    };
  }

  // Create a new habit
  static async createHabit(userId, habitData) {
    return await Habit.create({
      userId,
      ...habitData,
    });
  }

  // Update habit
  static async updateHabit(habitId, userId, updateData) {
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      const error = new Error('Habit not found or unauthorized');
      error.status = 404;
      throw error;
    }

    Object.assign(habit, updateData);
    await habit.save();
    return habit;
  }

  // Archive habit
  static async archiveHabit(habitId, userId) {
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      const error = new Error('Habit not found or unauthorized');
      error.status = 404;
      throw error;
    }

    habit.isArchived = true;
    await habit.save();
    return habit;
  }

  // Toggle completion: Complete or Undo completion for a given date
  static async toggleCompletion(habitId, userId, date) {
    // 🔒 STRICT RULE: Prevent completing habits for future dates!
    const todayStr = new Date().toISOString().split('T')[0];
    if (date > todayStr) {
      const error = new Error('Cannot complete habits for future dates! Focus on today.');
      error.status = 400;
      throw error;
    }

    const habit = await Habit.findOne({ _id: habitId, userId, isArchived: false });
    if (!habit) {
      const error = new Error('Active habit not found or unauthorized');
      error.status = 404;
      throw error;
    }

    const existing = await Completion.findOne({ habitId, date });

    if (existing) {
      // Undo completion
      await Completion.deleteOne({ _id: existing._id });
      return {
        completed: false,
        habitId,
        date,
        message: 'Habit marked as incomplete',
      };
    } else {
      // Mark as completed in MongoDB
      const completion = await Completion.create({
        habitId,
        userId,
        date,
      });

      // 🚀 Publish HabitCompleted event to RabbitMQ (Safe Non-blocking)
      try {
        if (typeof publishEvent === 'function') {
          const event = createHabitCompletedEvent ? createHabitCompletedEvent({
            completionId: completion._id.toString(),
            habitId: habit._id.toString(),
            userId,
            date,
          }) : {
            eventId: `evt_${Date.now()}`,
            eventType: 'habit.completed.v1',
            payload: { completionId: completion._id, habitId, userId, date }
          };

          const routingKey = ROUTING_KEYS?.HABIT_COMPLETED || 'habit.completed.v1';
          publishEvent(routingKey, event);
        }
      } catch (eventErr) {
        console.warn('⚠️ RabbitMQ publish skipped:', eventErr.message);
      }

      return {
        completed: true,
        habitId,
        date,
        completionId: completion._id,
        message: 'Habit marked as completed',
      };
    }
  }

  // Get completion history
  static async getCompletions(userId, { habitId, startDate, endDate }) {
    const filter = { userId };
    if (habitId) filter.habitId = habitId;
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    }

    return await Completion.find(filter).sort({ date: -1 });
  }
}