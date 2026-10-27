import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'streakup_super_secret_jwt_key_2026_dev',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
    habits: process.env.HABIT_SERVICE_URL || 'http://localhost:5002',
    analytics: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:5003',
    notifications: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5004',
  },
};