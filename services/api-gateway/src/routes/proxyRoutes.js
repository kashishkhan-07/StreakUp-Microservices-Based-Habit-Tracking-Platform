import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '../config/index.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { authenticateAndForwardUser } from '../middleware/authGuard.js';

export const setupProxies = (app) => {
  // 1. Auth Service Routes (Public)
  app.use(
    '/api/auth',
    authLimiter,
    createProxyMiddleware({
      target: config.services.auth,
      changeOrigin: true,
    })
  );

  // 2. Habit Service Routes (Protected)
  app.use(
    '/api/habits',
    authenticateAndForwardUser,
    createProxyMiddleware({
      target: config.services.habits,
      changeOrigin: true,
      on: {
        proxyReq: (proxyReq, req) => {
          // Forward user headers
          if (req.headers['x-user-id']) {
            proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
          }
          if (req.headers['x-user-email']) {
            proxyReq.setHeader('x-user-email', req.headers['x-user-email']);
          }
          if (req.headers['authorization']) {
            proxyReq.setHeader('authorization', req.headers['authorization']);
          }
        },
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
      on: {
        proxyReq: (proxyReq, req) => {
          if (req.headers['x-user-id']) {
            proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
          }
          if (req.headers['authorization']) {
            proxyReq.setHeader('authorization', req.headers['authorization']);
          }
        },
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
      on: {
        proxyReq: (proxyReq, req) => {
          if (req.headers['x-user-id']) {
            proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
          }
          if (req.headers['authorization']) {
            proxyReq.setHeader('authorization', req.headers['authorization']);
          }
        },
      },
    })
  );
};