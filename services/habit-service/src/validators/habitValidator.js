export const validateCreateHabit = ({ title, type }) => {
  const errors = [];
  if (!title || title.trim().length === 0) {
    errors.push('Habit title is required');
  }
  if (type && !['positive', 'negative'].includes(type)) {
    errors.push("Habit type must be either 'positive' or 'negative'");
  }
  return { isValid: errors.length === 0, errors };
};