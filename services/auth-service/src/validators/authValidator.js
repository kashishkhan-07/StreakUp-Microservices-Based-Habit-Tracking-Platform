export const validateRegisterInput = ({ name, email, password }) => {
  const errors = [];
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('A valid email address is required');
  }
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  return { isValid: errors.length === 0, errors };
};

export const validateLoginInput = ({ email, password }) => {
  const errors = [];
  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');
  return { isValid: errors.length === 0, errors };
};