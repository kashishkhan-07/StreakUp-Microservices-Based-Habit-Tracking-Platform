import { HabitService } from '../services/habitService.js';
import { validateCreateHabit } from '../validators/habitValidator.js';

export const getHabits = async (req, res, next) => {
  try {
    const today = req.query.date || new Date().toISOString().split('T')[0];
    const data = await HabitService.getUserHabitsWithTodayStatus(req.user.id, today);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createHabit = async (req, res, next) => {
  try {
    const { isValid, errors } = validateCreateHabit(req.body);
    if (!isValid) {
      return res.status(400).json({ success: false, errors });
    }

    const habit = await HabitService.createHabit(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Habit created successfully',
      data: habit,
    });
  } catch (error) {
    next(error);
  }
};

export const updateHabit = async (req, res, next) => {
  try {
    const updated = await HabitService.updateHabit(req.params.id, req.user.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Habit updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const archiveHabit = async (req, res, next) => {
  try {
    await HabitService.archiveHabit(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Habit archived successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const toggleCompletion = async (req, res, next) => {
  try {
    const date = req.body.date || new Date().toISOString().split('T')[0];
    const result = await HabitService.toggleCompletion(req.params.id, req.user.id, date);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getCompletions = async (req, res, next) => {
  try {
    const completions = await HabitService.getCompletions(req.user.id, req.query);
    res.status(200).json({
      success: true,
      data: completions,
    });
  } catch (error) {
    next(error);
  }
};