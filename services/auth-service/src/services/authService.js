import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export class AuthService {
  static generateToken(user) {
    return jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        timezone: user.timezone,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  static async register({ name, email, password, timezone }) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const error = new Error('An account with this email already exists');
      error.status = 400;
      throw error;
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      timezone: timezone || 'UTC',
    });

    const token = this.generateToken(user);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        timezone: user.timezone,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  static async login({ email, password }) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        timezone: user.timezone,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  static async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    return user;
  }

  static async updateProfile(userId, { name, timezone, avatar }) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    if (name) user.name = name;
    if (timezone) user.timezone = timezone;
    if (avatar) user.avatar = avatar;

    await user.save();
    return user;
  }
}