import { AnalyticsService } from '../services/analyticsService.js';

export const getSummary = async (req, res, next) => {
  try {
    const today = req.query.date || new Date().toISOString().split('T')[0];
    const authToken = req.headers.authorization;
    const summary = await AnalyticsService.getSummary(req.user.id, today, authToken);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

export const getTrends = async (req, res, next) => {
  try {
    const range = req.query.range || 'weekly';
    const today = req.query.date || new Date().toISOString().split('T')[0];
    const authToken = req.headers.authorization;
    const trends = await AnalyticsService.getTrends(req.user.id, range, today, authToken);

    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};