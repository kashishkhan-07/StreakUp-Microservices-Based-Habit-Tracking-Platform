import { AuthService } from '../services/authService.js';
import { validateRegisterInput, validateLoginInput } from '../validators/authValidator.js';

export const register = async (req, res, next) => {
  try {
    const { isValid, errors } = validateRegisterInput(req.body);
    if (!isValid) {
      return res.status(400).json({ success: false, errors });
    }

    const result = await AuthService.register(req.body);
    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { isValid, errors } = validateLoginInput(req.body);
    if (!isValid) {
      return res.status(400).json({ success: false, errors });
    }

    const result = await AuthService.login(req.body);
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await AuthService.getProfile(req.user.id);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const updated = await AuthService.updateProfile(req.user.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};