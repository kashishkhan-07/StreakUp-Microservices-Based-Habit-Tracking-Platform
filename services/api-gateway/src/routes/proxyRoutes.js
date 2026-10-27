import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '../config/index.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { authenticateAndForwardUser } from '../middleware/authGuard.js';

export const setupProxies = (app) => {
  // 1. Auth Service Routes
  app.use(
    '/api/auth',
    authLimiter,
    createProxyMiddleware({
      target: config.services.auth,
      changeOrigin: true,
      pathRewrite: {
        '^/api/auth': '/api/auth',
      },
    })
  );

  // 2. Habit Service Routes (Protected)
  app.use(
    '/api/habits',
    authenticateAndForwardUser,
    createProxyMiddleware({
      target: config.services.habits,
      changeOrigin: true,
      pathRewrite: {
        '^/api/habits': '/api/habits',
      },
    })
  );

  // 3. Analytics Service Routes (Protected)
  app.use(
    '/api/analytics',
    authenticateAndForwardUser,
    createProxyMiddleware({
      target: config.services.analytics,
      changeOrigin: true,
      pathRewrite: {
        '^/api/analytics': '/api/analytics',
      },
    })
  );

  // 4. Notification Service Routes (Protected)
  app.use(
    '/api/notifications',
    authenticateAndForwardUser,
    createProxyMiddleware({
      target: config.services.notifications,
      changeOrigin: true,
      pathRewrite: {
        '^/api/notifications': '/api/notifications',
      },
    })
  );
};